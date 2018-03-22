function loadRepos() {
    let container = $('#repos');
    let username = $('#username');

    container.html('');
    let url = "https://api.github.com/users/" + username.val() + "/repos";

    $.ajax({
       url,
       success: handleSuccess,
       error: handleError
    });

    function handleSuccess(res) {
        for (let repo of res) {
            let newLi = $('<li>');
            let newAnchor = $('<a>').text(repo.full_name);

            newAnchor.attr('href', repo.html_url);
            newLi.append(newAnchor);
            container.append(newLi)
        }
    }

    function handleError(error) {
        container.append($('<div>').text('Error!'));
    }
}