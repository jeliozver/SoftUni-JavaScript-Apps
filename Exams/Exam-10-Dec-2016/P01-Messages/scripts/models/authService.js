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

    function getName() {
        return sessionStorage.getItem('name');
    }

    function saveSession(res) {
        sessionStorage.setItem('username', res.username);
        sessionStorage.setItem('name', res.name);
        sessionStorage.setItem('authToken', res._kmd.authtoken);
        sessionStorage.setItem('userId', res._id);
    }

    function clearSession() {
        sessionStorage.clear();
    }

    function register(username, password, name) {
        let body = {
            username: username,
            password: password,
            name: name
        };
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
        getName,
        saveSession,
        clearSession,
        register,
        login,
        logout
    };
})();