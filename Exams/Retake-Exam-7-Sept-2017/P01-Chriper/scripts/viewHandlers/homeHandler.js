HANDLERS.homeHandler = function (context) {
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
                crudService.listChirps(),
                crudService.getChirpsCount(username),
                crudService.getFollowingCount(username),
                crudService.getFollowersCount(username)
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
            this.partial('./templates/feedView.hbs');
        });
    }
};