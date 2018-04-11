HANDLERS.createChirpHandler = function (context) {
    let text = context.params.text;
    if (text === '') {
        helperService.showError('Chirp text cannot be empty!');
    } else if (text.length > 150) {
        helperService.showError('Chirp text cannot contain more than 150 symbols!');
    } else {
        crudService.createChirp(text).then(() => {
            helperService.showInfo('Chirp published.');
            context.redirect('#/myProfile');
        }).catch(helperService.handleError);
    }
};

HANDLERS.deleteChirpHandler = function (context) {
    let id = context.params.id.slice(1);
    crudService.deleteChirp(id)
        .then(() => {
            helperService.showInfo('Chirp deleted.');
            context.redirect('#/myProfile');
        }).catch(helperService.handleError);
};

HANDLERS.getMyProfileHandler = function (context) {
    let username = authService.getUsername();
    context.isAuth = authService.isAuth();
    context.username = username;
    let partials = helperService.getCommonPartials();

    if (authService.isAuth()) {
        partials.chirp = './templates/chirp.hbs';

        async function loadData() {
            let [
                chirps,
                chirpsCount,
                following,
                followers
            ] = await Promise.all([
                crudService.listChirpsByUsername(username),
                crudService.getChirpsCount(username),
                crudService.getFollowingCount(username),
                crudService.getFollowersCount(username)
            ]);

            for (let ch of chirps) {
                ch.timeCreated = helperService.calcTime(ch._kmd.ect);
                ch.isAuthor = true;
            }

            context.chirps = chirps;
            context.chirpsCount = chirpsCount.length;
            context.following = following[0].subscriptions.length;
            context.followers = followers.length;
        }

        loadData()
            .then(() => render())
            .catch(helperService.handleError);

    } else {
        render();
    }

    function render() {
        context.loadPartials(partials).then(function () {
            this.partial('./templates/viewMyProfile.hbs');
        });
    }
};

HANDLERS.getProfileHandler = function (context) {
    let author = context.params.author.slice(1);
    context.username = author;
    context.isAuth = authService.isAuth();
    if (author !== authService.getUsername()) {
        context.isNotMyProfile = true;
    }
    let partials = helperService.getCommonPartials();
    let following = JSON.parse(authService.getSubs());
    if (following.includes(author)) {
        context.isFollowing = true;
    }

    if (authService.isAuth()) {
        partials.chirp = './templates/chirp.hbs';

        async function loadData() {
            let [
                chirps,
                chirpsCount,
                following,
                followers
            ] = await Promise.all([
                crudService.listChirpsByUsername(author),
                crudService.getChirpsCount(author),
                crudService.getFollowingCount(author),
                crudService.getFollowersCount(author)
            ]);

            for (let ch of chirps) {
                ch.timeCreated = helperService.calcTime(ch._kmd.ect);
            }

            context.chirps = chirps;
            context.chirpsCount = chirpsCount.length;
            context.following = following[0].subscriptions.length;
            context.followers = followers.length;
        }

        loadData()
            .then(() => render())
            .catch(helperService.handleError);

    } else {
        render();
    }

    function render() {
        context.loadPartials(partials).then(function () {
            this.partial('./templates/viewProfile.hbs');
        });
    }
};

HANDLERS.discoverHandler = function (context) {
    context.isAuth = authService.isAuth();
    let partials = helperService.getCommonPartials();

    if (authService.isAuth()) {
        partials.user = './templates/user.hbs';
        let users = [];
        crudService.getAllUsers()
            .then(res => {
                for (let user of res) {
                    if (user.username !== authService.getUsername()) {
                        user.followers = res
                            .filter(c => c.subscriptions.includes(user.username)).length;
                        users.push(user);
                    }
                }
                users = users.sort((a, b) => b.followers - a.followers);
                context.users = users;
                render();
            }).catch(helperService.handleError);
    } else {
        render();
    }

    function render() {
        context.loadPartials(partials).then(function () {
            this.partial('./templates/viewDiscoverPage.hbs');
        });
    }
};

HANDLERS.followHandler = function (context) {
    let username = context.params.username.slice(1);
    crudService.followUser(username).then(res => {
        helperService.showInfo(`Subscribed to ${username}`);
        sessionStorage.removeItem('subscriptions');
        sessionStorage.setItem('subscriptions', JSON.stringify(res.subscriptions));
        context.redirect('#/myProfile');
    }).catch(helperService.handleError);
};

HANDLERS.unfollowHandler = function (context) {
    let username = context.params.username.slice(1);
    crudService.unfollowUser(username).then(res => {
        helperService.showInfo(`Unsubscribed to ${username}`);
        sessionStorage.removeItem('subscriptions');
        sessionStorage.setItem('subscriptions', JSON.stringify(res.subscriptions));
        context.redirect('#/myProfile');
    }).catch(helperService.handleError);
};