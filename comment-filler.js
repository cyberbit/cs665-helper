const pool = require('./db');
const Chance = require('chance');
const CustomChance = require('./custom-chance');

var customChance = new CustomChance();
var chance = new Chance();
var ticketsIds;
var position = 0;

pool.query('select id from tickets', (err, result) => {
    if (err) {
        console.log(err);
    } else {
        ticketsIds = result.rows;
        fillComments(ticketsIds, (result) => {
            console.log('done: ', result);
        });
    }
});

function fillComments(tickets, cb) {
    var inserted = 0;

    for (var i = 0; i < tickets.length; i++) {
        insertComment(tickets[i].id, (err, result) => {
            if (err) {
                console.log(err);
            }
            if (++inserted === tickets.length) {
                console.log('iteration: ', i);
                cb(result);
            }
        });
    }

}

function insertComment(id, callback) {
    var j = 0;
    var numberOfComments = chance.natural({ min: 1, max: 5 });

    for (var i = 0; i < numberOfComments; i++) {
        var comment = customChance.createComment(id);
        pool.query({
            name: 'comment',
            text: 'insert into comments(id, content, created, "ticketId") values($1, $2, $3, $4)',
            values: [
                comment.id,
                comment.content,
                comment.created,
                comment.ticketId
            ]
        }, (err, result) => {
            if (err) {
                console.log(err);
            } else {
                j++;
                if (j = numberOfComments) {
                    callback(result);
                }
            }
        });
    }
}

