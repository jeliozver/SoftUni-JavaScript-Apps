let crudService = (() => {
    const APPDATA_MODULE = 'appdata';
    const USER_MODULE = 'user';
    const AUTH = 'kinvey';
    const ENTITY = 'teams/';

    function loadTeams() {
        return requestService.get(APPDATA_MODULE, ENTITY, AUTH);
    }

    function loadTeamDetails(teamId) {
        return requestService.get(APPDATA_MODULE, ENTITY + teamId, AUTH);
    }

    function loadTeamMembers(teamId) {
        let query = `?query={"teamId":"${teamId}"}`;
        return requestService.get(USER_MODULE, query, AUTH);
    }

    function editTeam(teamId, name, description) {
        let teamData = {
            name: name,
            comment: description
        };

        return requestService.update(APPDATA_MODULE, ENTITY + teamId, AUTH, teamData);
    }

    function createTeam(name, comment) {
        let teamData = {
            name: name,
            comment: comment
        };

        return requestService.post(APPDATA_MODULE, ENTITY, AUTH, teamData);
    }

    function joinTeam(teamId) {
        let userData = {
            username: sessionStorage.getItem('username'),
            teamId: teamId
        };

        return requestService.update(USER_MODULE, sessionStorage.getItem('userId'), AUTH, userData);
    }

    function leaveTeam() {
        let userData = {
            username: sessionStorage.getItem('username')
        };

        return requestService.update(USER_MODULE, sessionStorage.getItem('userId'), AUTH, userData);
    }

    return {
        loadTeams,
        loadTeamDetails,
        loadTeamMembers,
        editTeam,
        createTeam,
        joinTeam,
        leaveTeam
    };
})();