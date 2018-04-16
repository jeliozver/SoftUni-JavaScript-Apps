HANDLERS.registerHandler = function (context) {
    let username = context.params['username-register'];
    let password = context.params['password-register'];
    let repeatPassword = context.params['password-register-check'];

    if (helperService.validateInput(username, password)) {
        if (password !== repeatPassword) {
            helperService.showError('Passwords do not match!');
        } else {
            authService.register(username, password).then(res => {
                authService.saveSession(res);
                helperService.showInfo('User registration successful.');
                crudService.createReceipt().then(() => {
                    context.redirect('#/home');
                }).catch(helperService.handleError);
            }).catch(helperService.handleError);
        }
    }
};

HANDLERS.loginHandler = function (context) {
    let username = context.params['username-login'];
    let password = context.params['password-login'];

    if (helperService.validateInput(username, password)) {
        authService.login(username, password).then(res => {
            authService.saveSession(res);
            helperService.showInfo('Login successful.');
            context.redirect('#/home');
        }).catch(helperService.handleError);
    }
};

HANDLERS.logoutHandler = function (context) {
    authService.logout().then(() => {
        authService.clearSession();
        helperService.showInfo('Logout successful.');
        context.redirect('#/home');
    }).catch(helperService.handleError);
};