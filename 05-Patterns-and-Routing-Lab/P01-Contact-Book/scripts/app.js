const HANDLERS = {};

$(() => {
    const APP = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');

        this.get('#/index.html', HANDLERS.homeHandler);

        this.get('#/register', HANDLERS.registerGetHandler);

        this.post('#/register', HANDLERS.registerPostHandler);

        this.post('#/login', HANDLERS.loginHandler);

        this.get('#/logout', HANDLERS.logoutHandler);
    });

    APP.run();
});