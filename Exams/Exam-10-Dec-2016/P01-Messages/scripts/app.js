const HANDLERS = {};

$(() => {

    helperService.attachNotificationsEvents();

    const APP = Sammy('#app', function () {
        this.use('Handlebars', 'hbs');

        this.get('#/index.html', HANDLERS.homeHandler);
        this.get('/index.html', HANDLERS.homeHandler);
        this.get('#/home', HANDLERS.homeHandler);
        this.get('#/myProfile', HANDLERS.homeHandler);

        this.get('#/register', HANDLERS.registerGetHandler);
        this.post('#/register', HANDLERS.registerHandler);
        this.get('#/login', HANDLERS.loginGetHandler);
        this.post('#/login', HANDLERS.loginHandler);
        this.get('#/logout', HANDLERS.logoutHandler);

        this.get('#/messages', HANDLERS.listMyMessagesHandler);
        this.get('#/archive', HANDLERS.listSentArchiveMessages);

        this.get('#/send', HANDLERS.getSendMessageViewHandler);
        this.post('#/send', HANDLERS.sendMessageHandler);

        this.get('#/delete/:id', HANDLERS.deleteMessageHandler);
    });

    APP.run();
});