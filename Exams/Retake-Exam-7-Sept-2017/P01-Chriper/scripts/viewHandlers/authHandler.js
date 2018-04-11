HANDLERS.registerGetHandler = function (context) {
    context.loadPartials(helperService.getCommonPartials()).then(function () {
        this.partial('./templates/registerView.hbs');
    });
};

HANDLERS.registerPostHandler = function (context) {
    let username = context.params.username;
    let password = context.params.password;
    let repeatPassword = context.params.repeatPass;

    if (helperService.validateInput(username, password)) {
        if (password !== repeatPassword) {
            helperService.showError('Passwords do not match!');
        } else {
            authService.register(username, password).then(res => {
                authService.saveSession(res);
                helperService.showInfo('User registration successful.');
                context.redirect('#/index.html');
            }).catch(helperService.handleError);
        }
    }
};

HANDLERS.loginPostHandler = function (context) {
    let username = context.params.username;
    let password = context.params.password;

    if (helperService.validateInput(username, password)) {
        authService.login(username, password).then(res => {
            authService.saveSession(res);
            helperService.showInfo('Login successful.');
            context.redirect('#/index.html');
        }).catch(helperService.handleError);
    }
};

HANDLERS.logoutHandler = function (context) {
    authService.logout().then(() => {
        authService.clearSession();
        helperService.showInfo('Logout successful.');
        context.redirect('#/index.html');
    }).catch(helperService.handleError);
};