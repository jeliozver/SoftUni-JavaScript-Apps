HANDLERS.createLinkGetHandler = function (context) {
    context.isAuth = authService.isAuth();
    context.username = sessionStorage.getItem('username');

    if (authService.isAuth()) {
        context.isViewCreate = true;
        render();
    } else {
        render();
    }

    function render() {
        context.loadPartials(helperService.getCommonPartials()).then(function () {
            this.partial('./templates/content/content.hbs');
        });
    }
};

HANDLERS.createLinkPostHandler = function (context) {
    let url = context.params.url;
    let title = context.params.title;
    let imageUrl = context.params.image;
    let description = context.params.comment;

    if (helperService.validateCreateEdit(url, title)) {
        crudService.createLink(authService.getUsername(), url, title, imageUrl, description)
            .then(() => {
                helperService.showInfo('Post created.');
                context.redirect('#/index.html');
            }).catch(helperService.handleError);
    }
};

HANDLERS.editLinkGetHandler = function (context) {
    let id = context.params.id.slice(1);
    crudService.getSingleLink(id)
        .then(res => {
            context.isAuth = authService.isAuth();
            context.username = sessionStorage.getItem('username');

            if (authService.isAuth()) {
                context.isViewEdit = true;
                context.title = res.title;
                context.url = res.url;
                context.imageUrl = res.imageUrl;
                context.description = res.description;
                context._id = res._id;
                render();
            } else {
                render();
            }

            function render() {
                context.loadPartials(helperService.getCommonPartials()).then(function () {
                    this.partial('./templates/content/content.hbs');
                });
            }
        }).catch(helperService.handleError);
};

HANDLERS.editLinkPostHandler = function (context) {
    let id = context.params.id.slice(1);
    let url = context.params.url;
    let title = context.params.title;
    let imageUrl = context.params.image;
    let description = context.params.description;

    if (helperService.validateCreateEdit(url, title)) {
        crudService.editLink(id, authService.getUsername(), url, title, imageUrl, description)
            .then(() => {
                helperService.showInfo(`Post ${title} updated.`);
                context.redirect('#/index.html');
            }).catch(helperService.handleError);
    }
};

HANDLERS.deleteLinkHandler = function (context) {
    let id = context.params.id.slice(1);
    crudService.deleteLink(id).then(() => {
        helperService.showInfo('Post deleted.');
        context.redirect('#/index.html');
    }).catch(helperService.handleError);
};

HANDLERS.viewMyPostsHandler = function (context) {
    context.isAuth = authService.isAuth();
    context.username = sessionStorage.getItem('username');

    if (authService.isAuth()) {
        context.isViewMyPosts = true;
        crudService.listMyPosts().then(res => {
            for (let i = 0; i < res.length; i++) {
                res[i].rank = i + 1;
                res[i].submitTime = helperService.calcTime(res[i]._kmd.ect);
                if (res[i]._acl.creator === authService.getUserId()) {
                    res[i].isAuthor = true;
                }
            }
            context.posts = res;
            render();
        }).catch(helperService.handleError);
    } else {
        render();
    }

    function render() {
        let partials = helperService.getCommonPartials();
        partials.post = './templates/content/post.hbs';
        context.loadPartials(partials).then(function () {
            this.partial('./templates/content/content.hbs');
        });
    }
};

HANDLERS.viewCommentsHandler = function (context) {
    context.isAuth = authService.isAuth();
    context.username = sessionStorage.getItem('username');

    if (authService.isAuth()) {
        context.isViewComments = true;
        let id = context.params.id.slice(1);
        crudService.getSingleLink(id)
            .then(res => {
                context.submitTime = helperService.calcTime(res._kmd.ect);
                if (res._acl.creator === authService.getUserId()) {
                    context.isAuthor = true;
                }

                context.url = res.url;
                context.imageUrl = res.imageUrl;
                context.description = res.description;
                context.title = res.title;
                context.author = res.author;
                context._id = res._id;

                crudService.listComments(id).then(res => {
                    for (let comment of res) {
                        comment.submitTime = helperService.calcTime(comment._kmd.ect);
                        if (comment._acl.creator === authService.getUserId()) {
                            comment.isAuthor = true;
                        }
                    }
                    context.comments = res;
                    render();
                }).catch(helperService.handleError);
            }).catch(helperService.handleError);
    } else {
        render();
    }

    function render() {
        let partials = helperService.getCommonPartials();
        partials.comment = './templates/content/comment.hbs';
        context.loadPartials(partials).then(function () {
            this.partial('./templates/content/content.hbs');
        });
    }
};

HANDLERS.addCommentHandler = function (context) {
    let postId = context.params.id.slice(1);
    let content = context.params.content;
    let author = authService.getUsername();
    if (content === '') {
        helperService.showError('Content must not be empty!');
    } else {
        crudService.createComment(postId, content, author).then(() => {
            helperService.showInfo('Comment created.');
            context.redirect(`#/viewComments/:${postId}`);
        }).catch(helperService.handleError)
    }
};

HANDLERS.deleteCommentHandler = function (context) {
    let ids = context.params.id
        .split(':')
        .filter(id => id !== '');

    let commentId = ids[0];
    let postId = ids[1];
    crudService.deleteComment(commentId).then(() => {
        helperService.showInfo('Comment deleted.');
        context.redirect(`#/viewComments/:${postId}`);
    }).catch(helperService.handleError)
};