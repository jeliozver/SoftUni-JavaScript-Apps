const HANDLERS = {};

$(() => {
    const APP = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');

        this.get('#/index.html', HANDLERS.homeHandler);
        this.get('#/home', HANDLERS.homeHandler);
        this.get('#/about', HANDLERS.aboutHandler);

        this.get('#/register', HANDLERS.registerGetHandler);
        this.post('#/register', HANDLERS.registerPostHandler);

        this.get('#/login', HANDLERS.loginGetHandler);
        this.post('#/login', HANDLERS.loginPostHandler);

        this.get('#/logout', HANDLERS.logoutHandler);

        this.get('#/catalog', HANDLERS.listTeamsHandler);
        this.get('#/catalog/:teamId', HANDLERS.teamDetailsHandler);

        this.get('#/create', HANDLERS.createTeamGetHandler);
        this.post('#/create', HANDLERS.createTeamPostHandler);

        this.get('#/edit/:teamId', HANDLERS.editTeamGetHandler);
        this.post('#/edit/:teamId', HANDLERS.editTeamPostHandler);

        this.get('#/join/:teamId', HANDLERS.joinTeamHandler);
        this.get('#/leave', HANDLERS.leaveTeamHandler);
    });

    APP.run();
});