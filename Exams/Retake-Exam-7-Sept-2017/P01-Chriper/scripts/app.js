const HANDLERS = {};

$(() => {

    helperService.attachNotificationsEvents();

    const APP = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');

        this.get('#/index.html', HANDLERS.homeHandler);
        this.get('/index.html', HANDLERS.homeHandler);
        this.get('/', HANDLERS.homeHandler);

        this.get('#/register', HANDLERS.registerGetHandler);
        this.post('#/register', HANDLERS.registerPostHandler);
        this.get('#/login', HANDLERS.homeHandler);
        this.post('#/login', HANDLERS.loginPostHandler);
        this.get('#/logout', HANDLERS.logoutHandler);

        this.post('#/create', HANDLERS.createChirpHandler);
        this.get('#delete/:id', HANDLERS.deleteChirpHandler);

        this.get('#/discover', HANDLERS.discoverHandler);
        this.get('#/myProfile', HANDLERS.getMyProfileHandler);
        this.get('#feed/:author', HANDLERS.getProfileHandler);

        this.get('#/follow/:username', HANDLERS.followHandler);
        this.get('#/unfollow/:username', HANDLERS.unfollowHandler);
    });

    APP.run();
});