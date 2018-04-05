HANDLERS.registerGetHandler = function (context) {
    context.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs',
        navigation: './templates/common/navigation.hbs',
    }).then(function () {
        this.partial('./templates/forms/registerForm.hbs');
    });
};

HANDLERS.registerPostHandler = function (context) {
    let username = context.params.username;
    let password = context.params.password;
    let repeatPassword = context.params.repeatPassword;

    if (password !== repeatPassword) {
        alert('Passwords do not match');
    } else {
        auth.register(username, password, context);
    }
};

HANDLERS.loginHandler = function (context) {
    let username = context.params.username;
    let password = context.params.password;

    auth.login(username, password, context);
};

HANDLERS.logoutHandler = function (context) {
    auth.logout(context);
};