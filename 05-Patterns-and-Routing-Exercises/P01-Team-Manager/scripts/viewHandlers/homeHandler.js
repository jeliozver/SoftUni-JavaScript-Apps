HANDLERS.homeHandler = function (context) {
    context.loggedIn = authService.isAuth();
    context.username = sessionStorage.getItem('username');

    if (authService.hasTeam()) {
        context.hasTeam = authService.hasTeam();
        context.teamId = sessionStorage.getItem('teamId');
    }

    context.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs',
    }).then(function () {
        this.partial('./templates/home/home.hbs');
    });
};

HANDLERS.aboutHandler = function (context) {
    context.loggedIn = authService.isAuth();
    context.username = sessionStorage.getItem('username');

    context.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs',
    }).then(function () {
        this.partial('./templates/about/about.hbs');
    });
};