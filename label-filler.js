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
        fillLabels(ticketsIds, (result) => {
            console.log('done: ', result);
        });
    }
});

function fillLabels(tickets, cb) {
    var inserted = 0;

    for (var i = 0; i < tickets.length; i++) {
        insertLabel(tickets[i].id, (err, result) => {
            if (err) {
                console.log(err);
            }
            if (++inserted === tickets.length) {
                cb(result);
            }
        });
    }

}

function insertLabel(id, callback) {
    var label = customChance.createLabel(id);
    pool.query({
        name: 'label',
        text: 'insert into labels(id, "ticketId", name) values($1, $2, $3)',
        values: [
            label.id,
            label.ticketId,
            label.name,
        ]
    }, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            callback(result);
        }
    });
}

