let authService = (() => {
    const MODULE = 'user';
    const BASIC_AUTH = 'basic';
    const KINVEY_AUTH = 'kinvey';
    const LOGIN = 'login';
    const LOGOUT = '_logout';

    function isAuth() {
        return sessionStorage.getItem('authToken') !== null;
    }

    function getUserId() {
        return sessionStorage.getItem('userId');
    }

    function getUsername() {
        return sessionStorage.getItem('username');
    }

    function getSubs() {
        return sessionStorage.getItem('subscriptions');
    }

    function saveSession(res) {
        sessionStorage.setItem('username', res.username);
        sessionStorage.setItem('authToken', res._kmd.authtoken);
        sessionStorage.setItem('userId', res._id);
        sessionStorage.setItem('subscriptions', JSON.stringify(res.subscriptions));
    }

    function clearSession() {
        sessionStorage.clear();
    }

    function register(username, password) {
        let body = {username: username, password: password, subscriptions: []};
        return requestService.post(MODULE, '', BASIC_AUTH, body);
    }

    function login(username, password) {
        let body = {username: username, password: password};
        return requestService.post(MODULE, LOGIN, BASIC_AUTH, body);
    }

    function logout() {
        return requestService.post(MODULE, LOGOUT, KINVEY_AUTH, {});
    }

    return {
        isAuth,
        getUserId,
        getUsername,
        getSubs,
        saveSession,
        clearSession,
        register,
        login,
        logout
    };
})();