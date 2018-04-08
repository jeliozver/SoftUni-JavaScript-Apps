const HANDLERS = {};

$(() => {

    helperService.attachNotificationsEvents();

    const APP = Sammy('#container', function () {
        this.use('Handlebars', 'hbs');

        this.get('#/index.html', HANDLERS.homeHandler);

        this.post('#/register', HANDLERS.registerHandler);
        this.post('#/login', HANDLERS.loginHandler);
        this.get('#/logout', HANDLERS.logoutHandler);

        this.get('#/create', HANDLERS.createLinkGetHandler);
        this.post('#/create', HANDLERS.createLinkPostHandler);

        this.get('#/edit/:id', HANDLERS.editLinkGetHandler);
        this.post('#/edit/:id', HANDLERS.editLinkPostHandler);

        this.get('#/delete/:id', HANDLERS.deleteLinkHandler);

        this.get('#/viewMyPosts', HANDLERS.viewMyPostsHandler);

        this.get('#/viewComments/:id', HANDLERS.viewCommentsHandler);
        this.post('#/addComment/:id', HANDLERS.addCommentHandler);
        this.get('#/deleteComment/:id', HANDLERS.deleteCommentHandler);
    });

    APP.run();
});