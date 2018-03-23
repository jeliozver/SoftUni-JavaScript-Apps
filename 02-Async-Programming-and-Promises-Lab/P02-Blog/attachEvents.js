function attachEvents() {
    const loadBtn = $('#btnLoadPosts');
    const viewBtn = $('#btnViewPost');
    const posts = $('#posts');
    const postTitle = $('#post-title');
    const postBody = $('#post-body');
    const postComments = $('#post-comments');

    // Supply appkey, username and password from your Kinvey project
    // You can import sample entries from posts.json and comments.json files
    const appKey = '';
    const username = '';
    const password = '';

    const baseUrl = `https://baas.kinvey.com/appdata/${appKey}/`;
    const auth = {'Authorization': 'Basic ' + btoa(username + ':' + password)};

    const getPostsReq = {
        method: 'GET',
        url: baseUrl + 'posts',
        headers: auth,
        success: displayPosts,
        error: handleError
    };

    const getPostByIdReq = {
        method: 'GET',
        url: '',
        headers: auth,
        success: displayPost,
        error: handleError
    };

    const getPostComments = {
        method: 'GET',
        url: '',
        headers: auth,
        success: displayComments,
        error: handleError
    };

    loadBtn.on('click', loadPosts);
    viewBtn.on('click', viewPost);

    function loadPosts() {
        $.ajax(getPostsReq);
    }

    function viewPost() {
        let id = posts.find('option:selected').attr('value');
        getPostByIdReq.url = baseUrl + 'posts/' + id;
        getPostComments.url = baseUrl + 'comments/?query=' + `{"post_id":"${id}"}`;
        $.ajax(getPostByIdReq);
        $.ajax(getPostComments);
    }

    function displayPosts(res) {
        posts.empty();
        for (let post of res) {
            posts.append($('<option>').attr('value', `${post._id}`).text(`${post.title}`));
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