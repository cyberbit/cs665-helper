const prompt = require('prompt');
const CustomChance = require('./custom-chance');
const pool = require('./db');
const Status = require('./models/status');
const Type = require('./models/type');
const Urgency = require('./models/urgency');
const ReproductionRate = require('./models/reproduction-rate');
const queries = require('./preparedQueries');
require('datejs');

var customChance = new CustomChance();
prompt.start();

function showPrompt() {
    console.log(`
    1. generate random ticket
    2. insert random bug ticket into db
    3. insert random enhancement ticket into db
    4. insert random request ticket into db
    5. insert random support ticket into db
    6. query
    7. query (repeating)
    8. prepared queries
	
	To exit type 'exit'`);
    prompt.get(['option'], (err, results) => {
        switch (results.option) {
            case '1':
                console.log(customChance.createTicket());
                break;
            case '2':
                createBugTicket();
                break;
            case '3':
                createEnhancementTicket();
                break;
            case '4':
                createRequestTicket();
                break;
            case '5':
                createSupportTicket();
                break;
            case '6':
                query(false);
                break;
            case '7':
                query(true);
                break;
            case '8':
                preparedQueries();
                break;
            case 'exit':
                process.exit();
                break;
            default:
                showPrompt();
                break;
        }
        // if (results.option !== 'exit') {
        //     showPrompt();
        // }
    });
}

function createBugTicket() {
    var bugTicket = customChance.createBugTicket();
    insertTicket(bugTicket.ticket, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result.rows);
            pool.query({
                name: 'bug',
                text: 'insert into bugs("ticketId", "bugDescription", "reproductionSteps", "reproductionRate") values($1, $2, $3, $4)',
                values: [
                    bugTicket.bug.ticketId,
                    bugTicket.bug.bugDescription,
                    bugTicket.bug.reproductionSteps,
                    bugTicket.bug.reproductionRate
                ]
            }, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(result.rows);
                    showPrompt();
                }
            });
        }
    });
}

function createEnhancementTicket() {
    var enhancementTicket = customChance.createEnhancementTicket();
    insertTicket(enhancementTicket.ticket, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result.rows);
            pool.query({
                name: 'enhancement',
                text: 'insert into enhancements("ticketId", "feature", "reason") values($1, $2, $3)',
                values: [
                    enhancementTicket.enhancement.ticketId,
                    enhancementTicket.enhancement.feature,
                    enhancementTicket.enhancement.reason
                ]
            }, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(result.rows);
                    showPrompt();
                }
            });
        }
    });
}

function createRequestTicket() {
    var requestTicket = customChance.createRequestTicket();
    insertTicket(requestTicket.ticket, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result.rows);
            pool.query({
                name: 'request',
                text: 'insert into requests("ticketId", "request", "requestDescription") values($1, $2, $3)',
                values: [
                    requestTicket.request.ticketId,
                    requestTicket.request.request,
                    requestTicket.request.requestDescription
                ]
            }, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(result.rows);
                    showPrompt();
                }
            });
        }
    });
}

function createSupportTicket() {
    var supportTicket = customChance.createSupportTicket();
    insertTicket(supportTicket.ticket, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result.rows);
            pool.query({
                name: 'enhancement',
                text: 'insert into supports("ticketId", "problem", "description") values($1, $2, $3)',
                values: [
                    supportTicket.support.ticketId,
                    supportTicket.support.problem,
                    supportTicket.support.description
                ]
            }, (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(result.rows);
                    showPrompt();
                }
            });
        }
    });
}

function insertTicket(ticket, callback) {
    pool.query({
        name: 'ticket',
        text: 'insert into tickets(id, description, status, "reportedDate", "reportedBy", "assignedDate", "assignedTo", "resolvedDate", "resolvedBy", type, urgency) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
        values: [
            ticket.ticketId,
            ticket.description,
            ticket.status,
            ticket.reportedDate,
            ticket.reportedBy,
            ticket.assignedDate,
            ticket.assignedTo,
            ticket.resolvedDate,
            ticket.resolvedBy,
            ticket.ticketType,
            ticket.urgency
        ]
    }, (err, result) => {
        callback(err, result);
    });
}


function query(repeat) {
    prompt.get(['query'], (err, result) => {
        if (result.query !== 'exit') {
            pool.query(result.query, (err, result) => {
                if (err) {
                    console.log('Error: ', err);
                    if (repeat) {
                        query(true);
                    } else {
                        showPrompt();
                    }
                } else {
                    console.log('Query Success');
                    console.log('Results: ');
                    console.log(result.rows);
                    if (repeat) {
                        query(true);
                    } else {
                        showPrompt();
                    }
                }
            });
        } else {
            showPrompt();
        }
    });
}

function preparedQueries() {
    console.log('Prepared Queries:');
    var keys = Object.keys(queries);
    for (var i = 0; i < keys.length; i++) {
        console.log(i + 1 + ': ', keys[i]);
    }

    prompt.get(['option'], (err, result) => {
        if (result.option > 0 && result.option <= keys.length) {
            var query = queries[keys[result.option - 1]];
            if (query.variables > 0) {
                var values = [];
                console.log('enter value for variables ', query.variableNames);
                prompt.get(query.variableNames, (err, result) => {
                    query.variableNames.forEach((element) => {
                        values.push(result[element]);
                    });

                    var readyQuery = prepareQuery(query.query, values);
                    pool.query(readyQuery, (err, results) => {
                        if (err) {
                            console.log('Error: ', err);
                        } else {
                            console.log('Query Success');
                            console.log('Results: ');
                            console.log(result.rows);
                        }
                    });
                });
            }
        }
    });
}

function prepareQuery(query, values) {
    var dateString = "(DATE '" + Date.today().toString('MM-dd-yyyy') + "')";
    var newQuery;
    newQuery = query.replace(/INPUT_DATE/gi, dateString);
    if (values.length > 0) {
        values.forEach((element, i) => {
            var regEx = new RegExp("VALUE" + (i + 1), "gi");
            newQuery = newQuery.replace(regEx, "'" + element + "'");
        });
    }
    return newQuery;
}

showPrompt();