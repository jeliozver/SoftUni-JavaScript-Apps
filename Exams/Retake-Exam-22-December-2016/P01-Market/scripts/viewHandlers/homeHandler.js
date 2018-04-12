HANDLERS.homeHandler = function (context) {
    if (authService.isAuth()) {
        context.username = sessionStorage.getItem('username');
        context.loadPartials(helperService.getCommonPartials()).then(function () {
            this.partial('./templates/userHome.hbs');
        });

    } else {
        context.anonymous = true;
        context.loadPartials(helperService.getCommonPartials()).then(function () {
            this.partial('./templates/home.hbs');
        });
    }
};