function attachEvents() {
    const loadBtn = $('#btnLoadPosts');
    const viewBtn = $('#btnViewPost');
    const posts = $('#posts');
    const postTitle = $('#post-title');
    const postBody = $('#post-body');
    const postComments = $('#post-comments');

    // Supply appkey, username and password from your Kinvey project
    // You can import sample entries from posts.json and comments.json files
    const appKey = ``;
    const username = '';
    const password = '';

    const baseUrl = `https://baas.kinvey.com/appdata/${appKey}/`;
    const auth = {'Authorization': 'Basic ' + btoa(username + ':' + password)};

    function request(endpoint) {
        return $.ajax({
            method: 'GET',
            url: baseUrl + endpoint,
            headers: auth
        });
    }

    loadBtn.on('click', loadPosts);
    viewBtn.on('click', viewPost);

    function loadPosts() {
        request('posts')
            .then(displayPosts)
            .catch(handleError);
    }

    function viewPost() {
        let id = posts
            .find('option:selected')
            .attr('value');

        request(`posts/${id}`)
            .then(displayPost)
            .catch(handleError);

        request(`comments/?query={"post_id":"${id}"}`)
            .then(displayComments)
            .catch(handleError);
    }

    function displayPosts(res) {
        posts.empty();
        for (let post of res) {
            posts.append($('<option>')
                .attr('value', `${post._id}`)
                .text(`${post.title}`));
        }
    }

    function displayPost(res) {
        postTitle.text(res.title);
        postBody.text(res.body);
    }

    function displayComments(res) {
        postComments.empty();
        for (let comment of res) {
            postComments.append($('<li>').text(`${comment.text}`));
        }
    }

    function handleError(reason) {
        alert(`Error: ${reason.status} (${reason.statusText})`);
    }
}

attachEvents();