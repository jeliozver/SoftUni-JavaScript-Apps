let auth = (() => {
    const MODULE = 'user';
    const BASIC_AUTH = 'basic';
    const KINVEY_AUTH = 'kinvey';
    const LOGIN = 'login';
    const LOGOUT = '_logout';

    function isAuth() {
        return sessionStorage.getItem('authToken') !== null;
    }

    function saveSession(res) {
        sessionStorage.setItem('username', res.username);
        sessionStorage.setItem('authToken', res._kmd.authtoken);
        sessionStorage.setItem('userId', res._id);
    }

    function clearSession() {
        sessionStorage.clear();
    }

    function register(username, password, context) {
        let body = {username: username, password: password};
        remote.post(MODULE, '', BASIC_AUTH, body)
            .then(res => {
                saveSession(res);
                context.redirect('#/index.html');
            })
            .catch(console.error);
    }

    function login(username, password, context) {
        let body = {username: username, password: password};
        remote.post(MODULE, LOGIN, BASIC_AUTH, body)
            .then(res => {
                saveSession(res);
                context.redirect('#/index.html');
            })
            .catch(console.error);
    }

    function logout(context) {
        remote.post(MODULE, LOGOUT, KINVEY_AUTH, {})
            .then(() => {
                clearSession();
                context.redirect('#/index.html');
            })
            .catch(console.error);
    }

    return {
        isAuth,
        register,
        login,
        logout
    };
})();