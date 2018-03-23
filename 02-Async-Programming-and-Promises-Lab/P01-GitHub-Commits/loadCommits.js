function loadCommits() {
    const userInput = $('#username');
    const repoInput = $('#repo');
    const commits = $('#commits');

    if (userInput.val() !== '' && repoInput.val() !== '') {
        commits.empty();
        $.get(`https://api.github.com/repos/${userInput.val()}/${repoInput.val()}/commits`)
            .then(displayCommits)
            .catch(handleError);

        function displayCommits(data) {
            for (let obj of data) {
                let newLi = $('<li>').text(`${obj.commit.author.name}: ${obj.commit.message}`);
                commits.append(newLi);
            }
        }

        function handleError(reason) {
            let newLi = $('<li>').text(`Error: ${reason.status} (${reason.statusText})`);
            commits.append(newLi);
        }
    }
}