const Chance = require('chance');
var chance = new Chance();

module.exports = class CustomChance {

    constructor() {
        var chance = new Chance();
    }

    createTicket() {
        var newTicket = chance.ticket();
        return newTicket;
    }

    createBugTicket() {
        var ticket = chance.ticket(0);
        var bug = chance.bug(ticket.ticketId);

        var ticketAndBug = {
            ticket: ticket,
            bug: bug
        };

        return ticketAndBug;
    }

    createEnhancementTicket() {
        var ticket = chance.ticket(1);
        var enhancement = chance.enhancement(ticket.ticketId);

        var ticketAndEnhancement = {
            ticket: ticket,
            enhancement: enhancement
        };

        return ticketAndEnhancement;
    }

    createRequestTicket() {
        var ticket = chance.ticket(2);
        var request = chance.request(ticket.ticketId);

        var ticketAndRequest = {
            ticket: ticket,
            request: request
        };

        return ticketAndRequest;
    }

    createSupportTicket() {
        var ticket = chance.ticket(3);
        var support = chance.support(ticket.ticketId);

        var ticketAndSupport = {
            ticket: ticket,
            support: support
        };

        return ticketAndSupport;
    }

    createComment(ticketId) {
        var comment = chance.comment(ticketId);

        return comment;
    }

    createLabel(ticketId) {
        var label = chance.label(ticketId);

        return label;
    }
}

chance.mixin({
    'label': (ticketId) => {
        var label = {
            id: '',
            ticketId: '',
            name: ''
        }
        label.id = chance.guid();
        label.ticketId = ticketId;
        label.name = chance.pickone(['backend', 'frontend', 'database', 'internal', 'qa']);

        return label;
    }
});

chance.mixin({
    'comment': (ticketId) => {
        var comment = {
            id: '',
            content: '',
            created: '',
            ticketId: ''
        }
        comment.id = chance.guid();
        var sentence = chance.sentence();
        comment.content = sentence.substring(0, sentence.length -1) + ' ' + chance.pickone(['keyword', 'error', 'system', 'help' + '.',
         'fire', 'computer', 'user', 'broken', 
         'fix', 'please', 'coffee and keyboard', 'utter failure', 
         'nothing works', 'database', 'down', 'mouse']);
        comment.created = chance.date({ year: chance.pickone([2016, 2017]) });
        comment.ticketId = ticketId;

        return comment;
    }
});

chance.mixin({
    'support': (ticketId) => {
        var supportTicket = {
            ticketId: '',
            problem: '',
            description: ''
        }
        supportTicket.ticketId = ticketId;
        supportTicket.problem = chance.sentence();
        supportTicket.description = chance.sentence();

        return supportTicket;
    }
});

chance.mixin({
    'request': (ticketId) => {
        var requestTicket = {
            ticketId: '',
            request: '',
            requestDescription: ''
        }
        requestTicket.ticketId = ticketId;
        requestTicket.request = chance.sentence();
        requestTicket.requestDescription = chance.sentence();

        return requestTicket;
    }
});

chance.mixin({
    'enhancement': (ticketId) => {
        var enhancementTicket = {
            ticketId: '',
            feature: '',
            reason: ''
        }
        enhancementTicket.ticketId = ticketId;
        enhancementTicket.feature = chance.sentence();
        enhancementTicket.reason = chance.sentence();

        return enhancementTicket;
    }
});

chance.mixin({
    'bug': (ticketId) => {
        var bugTicket = {
            ticketId: '',
            bugDescription: '',
            reproductionSteps: '',
            reproductionRate: ''
        }
        bugTicket.ticketId = ticketId;
        bugTicket.bugDescription = chance.sentence();
        bugTicket.reproductionSteps = chance.sentence();
        bugTicket.reproductionRate = chance.pickone([0, 1, 2, 3]);

        return bugTicket;
    }
});

chance.mixin({
    'ticket': (type) => {
        var ticket = {
            ticketId: '',
            description: '',
            status: '',
            reportedBy: '',
            reportedDate: '',
            assignedDate: '',
            assignedTo: '',
            resolvedDate: '',
            resolvedBy: '',
            ticketLabels: '',
            ticketType: '',
            urgency: ''
        }
        var tmpDate = chance.date({ year: chance.pickone([2016, 2017]) });
        ticket.ticketId = chance.guid();
        ticket.description = chance.sentence();
        ticket.status = chance.pickone([0, 1]);
        ticket.ticketType = type;
        ticket.urgency = chance.pickone([0, 1, 2]);
        ticket.reportedBy = chance.name();
        ticket.reportedDate = new Date(tmpDate);
        ticket.assignedDate = new Date(tmpDate.addDays(chance.natural({ min: 1, max: 30 })));
        ticket.assignedTo = chance.pickone(['Danny', 'Zack', 'DJ', 'Matthew']);
        if (ticket.status === 0) {
            ticket.resolvedBy = ticket.assignedTo;
            ticket.resolvedDate = new Date(tmpDate.addDays(chance.natural({ min: 30, max: 60 })));
        } else {
            ticket.resolvedBy = null;
            ticket.resolvedDate = null;
        }
        return ticket;
    }
});