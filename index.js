const prompt = require('prompt');
const CustomChance = require('./custom-chance');
const pool = require('./db');
const Status = require('./models/status');
const Type = require('./models/type');
const Urgency = require('./models/urgency');
const ReproductionRate = require('./models/reproduction-rate');
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
                prompt.get(['query'], (err, result) => {
                    pool.query(result.query, (err, result) => {
                        if (err) {
                            console.log('Error: ', err);
                        } else {
                            console.log('Query Success');
                            console.log('Results: ');
                            console.log(result.rows);
                            showPrompt();
                        }
                    });
                })
                break;
            case 'exit':
                process.exit();
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

showPrompt();