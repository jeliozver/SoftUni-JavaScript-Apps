const HANDLERS = {};

$(() => {

    helperService.attachNotificationsEvents();

    const APP = Sammy('#container', function () {
        this.use('Handlebars', 'hbs');

        this.get('#/index.html', HANDLERS.homeHandler);
        this.get('/index.html', HANDLERS.homeHandler);
        this.get('#/home', HANDLERS.homeHandler);

        this.post('#/register', HANDLERS.registerHandler);
        this.post('#/login', HANDLERS.loginHandler);
        this.get('#/logout', HANDLERS.logoutHandler);

        this.post('#/create', HANDLERS.createEntryHandler);
        this.get('#/delete/:id', HANDLERS.deleteEntryHandler);

        this.post('#/checkout', HANDLERS.checkoutHandler);
        this.get('#/overview', HANDLERS.listReceiptsHandler);
        this.get('#/details/:id', HANDLERS.getReceiptDetails);
    });

    APP.run();
});