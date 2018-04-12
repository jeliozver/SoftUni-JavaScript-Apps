HANDLERS.registerGetHandler = function (context) {
    context.anonymous = true;
    context.loadPartials(helperService.getCommonPartials()).then(function () {
        this.partial('./templates/viewRegister.hbs');
    });
};

HANDLERS.registerHandler = function (context) {
    let username = context.params.username;
    let password = context.params.password;
    let name = context.params.name;

    authService.register(username, password, name).then(res => {
        authService.saveSession(res);
        helperService.showInfo('User registration successful.');
        context.redirect('#/home');
    }).catch(helperService.handleError);
};

HANDLERS.loginGetHandler = function (context) {
    context.anonymous = true;
    context.loadPartials(helperService.getCommonPartials()).then(function () {
        this.partial('./templates/viewLogin.hbs');
    });
};

HANDLERS.loginHandler = function (context) {
    let username = context.params.username;
    let password = context.params.password;

    authService.login(username, password).then(res => {
        authService.saveSession(res);
        helperService.showInfo('Login successful.');
        context.redirect('#/home');
    }).catch(helperService.handleError);

};

HANDLERS.logoutHandler = function (context) {
    authService.logout().then(() => {
        authService.clearSession();
        helperService.showInfo('Logout successful.');
        context.redirect('#/home');
    }).catch(helperService.handleError);
};