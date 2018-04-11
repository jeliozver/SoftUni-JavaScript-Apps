let crudService = (() => {
    const APPDATA_MODULE = 'appdata';
    const USER_MODULE = 'user';
    const AUTH = 'kinvey';
    const CHIRPS_ENTITY = 'chirps/';

    function getChirpsQuery() {
        let subs = authService.getSubs();
        return `chirps?query={"author":{"$in": ${subs}}}&sort={"_kmd.ect": 1}`;
    }

    function getChripsByUserQuery(username) {
        return `chirps?query={"author":"${username}"}&sort={"_kmd.ect": 1}`;
    }

    function getCountChirpsQuery(username) {
        return `chirps?query={"author":"${username}"}`;
    }

    function getFollowingQuery(username) {
        return `?query={"username":"${username}"}`;
    }

    function getFollowersQuery(username) {
        return `?query={"subscriptions":"${username}"}`;
    }

    function listChirps() {
        return requestService.get(APPDATA_MODULE, getChirpsQuery(), AUTH);
    }

    function listChirpsByUsername(username) {
        return requestService.get(APPDATA_MODULE, getChripsByUserQuery(username), AUTH);
    }

    function getChirpsCount(username) {
        return requestService.get(APPDATA_MODULE, getCountChirpsQuery(username), AUTH);
    }

    function getFollowingCount(username) {
        return requestService.get(USER_MODULE, getFollowingQuery(username), AUTH);
    }

    function getFollowersCount(username) {
        return requestService.get(USER_MODULE, getFollowersQuery(username), AUTH);
    }

    function createChirp(text) {
        let body = {
            text: text,
            author: authService.getUsername()
        };

        return requestService.post(APPDATA_MODULE, CHIRPS_ENTITY, AUTH, body);
    }

    function deleteChirp(id) {
        return requestService.remove(APPDATA_MODULE, CHIRPS_ENTITY + id, AUTH);
    }

    function getAllUsers() {
        return requestService.get(USER_MODULE, '', AUTH);
    }

    function followUser(username) {
        let currentSubs = JSON.parse(authService.getSubs());
        currentSubs.push(username);
        let body = {
            subscriptions: currentSubs
        };

        return requestService.update(USER_MODULE, authService.getUserId(), AUTH, body);
    }

    function unfollowUser(username) {
        let currentSubs = JSON.parse(authService.getSubs());
        currentSubs = currentSubs.filter(u => u !== username);
        let body = {
            subscriptions: currentSubs
        };

        return requestService.update(USER_MODULE, authService.getUserId(), AUTH, body);
    }

    return {
        listChirps,
        listChirpsByUsername,
        getChirpsCount,
        getFollowingCount,
        getFollowersCount,
        createChirp,
        deleteChirp,
        getAllUsers,
        followUser,
        unfollowUser
    };
})();