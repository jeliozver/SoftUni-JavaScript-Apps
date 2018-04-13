HANDLERS.listMyMessagesHandler = function (context) {
    context.username = authService.getUsername();
    let partials = helperService.getCommonPartials();
    partials.messageReceived = './templates/messageReceived.hbs';
    crudService.listMyMessages().then(res => {
        for (let msg of res) {
            msg.date = helperService
                .formatDate(msg._kmd.lmt);
            msg.sender_name = helperService
                .formatSender(msg.sender_name, msg.sender_username);
        }
        context.messages = res;
        context.loadPartials(partials).then(function () {
            this.partial('./templates/viewMyMessages.hbs');
        });
    }).catch(requestService.handleError);
};

HANDLERS.listSentArchiveMessages = function (context) {
    context.username = authService.getUsername();
    let partials = helperService.getCommonPartials();
    partials.messageSend = './templates/messageSend.hbs';
    crudService.listMessagesSent().then(res => {
        res.forEach(msg => msg.date = helperService.formatDate(msg._kmd.lmt));
        context.messages = res;
        context.loadPartials(partials).then(function () {
            this.partial('./templates/viewArchive.hbs');
        });
    }).catch(helperService.handleError);
};

HANDLERS.getSendMessageViewHandler = function (context) {
    context.username = authService.getUsername();
    let partials = helperService.getCommonPartials();
    partials.user = './templates/user.hbs';
    crudService.listUsers().then(res => {
        res.forEach(u => u.name = helperService.formatSender(u.name, u.username));
        res = res.filter(u => u.username !== authService.getUsername());
        context.users = res;
        context.loadPartials(partials).then(function () {
            this.partial('./templates/viewSendMessage.hbs');
        });
    }).catch(helperService.handleError);
};

HANDLERS.sendMessageHandler = function (context) {
    let recipient_username = $('#msgRecipientUsername')
        .find(":selected").val();
    let text = context.params.text;
    crudService.sendMessage(recipient_username, text).then(() => {
        helperService.showInfo('Message sent.');
        context.redirect('#/archive');
    }).catch(helperService.handleError);
};

HANDLERS.deleteMessageHandler = function (context) {
    let id = context.params.id.slice(1);
    crudService.deleteMessage(id).then(() => {
        helperService.showInfo('Message deleted.');
        context.redirect('#/archive');
    }).catch(helperService.handleError);
};