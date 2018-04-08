HANDLERS.listTeamsHandler = function (context) {
    crudService.loadTeams().then(res => {
        context.loggedIn = authService.isAuth();
        context.username = sessionStorage.getItem('username');
        context.hasNoTeam = !authService.hasTeam();
        context.teams = res;

        notifications.showInfo('Teams listed.');
        context.loadPartials({
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs',
            team: './templates/catalog/team.hbs'
        }).then(function () {
            this.partial('./templates/catalog/teamCatalog.hbs');
        });

    }).catch(notifications.handleError);
};

HANDLERS.teamDetailsHandler = function (context) {
    let teamId = context.params.teamId.slice(1);
    let teamInfo;
    let membersInfo;

    getTeamInfo().then(() => {
        context.loggedIn = authService.isAuth();
        context.username = sessionStorage.getItem('username');
        context.hasNoTeam = !authService.hasTeam();
        context.isOnTeam = authService.hasTeam();
        context.isAuthor = authService.getUserId() === teamInfo._acl.creator;
        context.name = teamInfo.name;
        context.comment = teamInfo.comment;
        context.members = membersInfo;
        context.teamId = teamInfo._id;

        notifications.showInfo(`Details for ${context.name} listed.`);

        context.loadPartials({
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs',
            teamControls: './templates/catalog/teamControls.hbs',
            teamMember: './templates/catalog/teamMember.hbs'
        }).then(function () {
            this.partial('./templates/catalog/details.hbs');
        });
    }).catch(notifications.handleError);

    async function getTeamInfo() {
        let [teamDetails, teamMembers] = await Promise.all([
            crudService.loadTeamDetails(teamId),
            crudService.loadTeamMembers(teamId),
        ]);
        teamInfo = teamDetails;
        membersInfo = teamMembers;
    }
};

HANDLERS.createTeamGetHandler = function (context) {
    context.loggedIn = authService.isAuth();
    context.username = sessionStorage.getItem('username');

    context.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs',
        createForm: './templates/create/createForm.hbs'
    }).then(function () {
        this.partial('./templates/create/createPage.hbs');
    });
};

HANDLERS.createTeamPostHandler = function (context) {
    let name = context.params.name;
    let comment = context.params.comment;
    crudService.createTeam(name, comment).then(res => {
        crudService.joinTeam(res._id).then(() => {
            sessionStorage.setItem('teamId', res._id);
            notifications.showInfo(`Team ${name} successfully created.`);
            context.redirect('#/home');
        }).catch(notifications.handleError);
    }).catch(notifications.handleError);
};

HANDLERS.editTeamGetHandler = function (context) {
    context.loggedIn = authService.isAuth();
    context.username = sessionStorage.getItem('username');
    context.teamId = context.params.teamId.slice(1);

    context.loadPartials({
        header: './templates/common/header.hbs',
        footer: './templates/common/footer.hbs',
        editForm: './templates/edit/editForm.hbs'
    }).then(function () {
        this.partial('./templates/edit/editPage.hbs');
    });
};

HANDLERS.editTeamPostHandler = function (context) {
    let teamId = context.params.teamId.slice(1);
    let name = context.params.name;
    let comment = context.params.comment;

    crudService.editTeam(teamId, name, comment).then(() => {
        notifications.showInfo(`Team ${name} successfully edited.`);
        context.redirect('#/home');
    }).catch(notifications.handleError);
};

HANDLERS.joinTeamHandler = function (context) {
    let teamId = context.teamId = context.params.teamId.slice(1);
    crudService.joinTeam(teamId).then(res => {
        sessionStorage.setItem('teamId', res.teamId);
        notifications.showInfo(`Join successful.`);
        context.redirect('#/home');
    }).catch(notifications.handleError);
};

HANDLERS.leaveTeamHandler = function (context) {
    crudService.leaveTeam().then(() => {
        sessionStorage.removeItem('teamId');
        notifications.showInfo(`Team successfully left.`);
        context.redirect('#/home');
    }).catch(notifications.handleError);
};