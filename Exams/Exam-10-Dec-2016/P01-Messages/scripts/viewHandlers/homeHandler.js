HANDLERS.homeHandler = function (context) {
    if (authService.isAuth()) {
        context.username = sessionStorage.getItem('username');
        context.loadPartials(helperService.getCommonPartials()).then(function () {
            this.partial('./templates/viewHomeUser.hbs');
        });

    } else {
        context.anonymous = true;
        context.loadPartials(helperService.getCommonPartials()).then(function () {
            this.partial('./templates/viewHome.hbs');
        });
    }
};