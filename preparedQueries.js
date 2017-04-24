
module.exports = {
    "setTicketToResolved": {
        variables: 1,
        variableNames: ['id'],
        query: 'update tickets set status = not status, "resolvedBy" = "assignedTo", "resolvedDate" = INPUT_DATE where id = (VALUE1)'
    },
    "reassignTicket": {
        variables: 2,
        variableNames: ['reassignTo', 'id'],
        query: 'update tickets set "assignedTo" = (VALUE1) where id = (VALUE2) and status <> true'
    }
};