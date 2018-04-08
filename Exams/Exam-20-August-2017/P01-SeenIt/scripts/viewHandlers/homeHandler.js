HANDLERS.homeHandler = function (context) {
    context.isAuth = authService.isAuth();
    context.username = sessionStorage.getItem('username');

    if (authService.isAuth()) {
        context.isViewCatalog = true;
        crudService.listPosts().then(res => {
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