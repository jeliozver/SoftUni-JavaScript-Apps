function startApp() {
    loadTemplates()
        .then(() => {
            loadLinksTemplate({
                isLogged: sessionStorage.getItem('authToken') !== null,
                username: "Welcome, " + sessionStorage.getItem('username') + "!"
            });

            loadHomeTemplate();
            attachNotificationsEvents();
        })
        .catch(handleAjaxError);
}