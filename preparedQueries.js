
module.exports = {
    "changeTicketStatus": {
        variables: 1,
        variableNames: ['id'],
        query: 'update tickets set status = not status, "resolvedBy" = case when status = false then "assignedTo" else NULL end, "resolvedDate" = case when status = false then (INPUT_DATE) else NULL end where id = (VALUE1)'
    },
    "reassignTicket": {
        variables: 2,
        variableNames: ['reassignTo', 'id'],
        query: 'update tickets set "assignedTo" = (VALUE1) where id = (VALUE2) and status <> true'
    },
    "changeUrgency": {
        variables: 2,
        variableNames: ['urgencyValue', 'id'],
        query: 'update tickets set "urgency" = (VALUE1) where id = (VALUE2)'
    }
};