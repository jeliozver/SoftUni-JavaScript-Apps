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

        this.get('#/shop', HANDLERS.shopHandler);
        this.get('#/purchase/:stats', HANDLERS.purchaseHandler);

        this.get('#/cart', HANDLERS.cartHandler);
        this.get('#/discard/:id', HANDLERS.discardHandler);
    });

    APP.run();
});