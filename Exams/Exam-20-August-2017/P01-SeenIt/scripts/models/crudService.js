let crudService = (() => {
    const APPDATA_MODULE = 'appdata';
    const AUTH = 'kinvey';
    const POSTS_ENTITY = 'posts/';
    const POSTS_QUERY = 'posts?query={}&sort={"_kmd.ect": -1}';
    const COMMENTS_ENTITY = 'comments/';

    function getMyPostsQuery() {
        return `posts?query={"author":"${authService.getUsername()}"}&sort={"_kmd.ect": -1}`;
    }

    function getCommentsQuery(id) {
        return `comments?query={"postId":"${id}"}&sort={"_kmd.ect": -1}`;
    }

    function listPosts() {
        return requestService.get(APPDATA_MODULE, POSTS_QUERY, AUTH);
    }

    function listMyPosts() {
        let query = getMyPostsQuery();
        return requestService.get(APPDATA_MODULE, query, AUTH);
    }

    function listComments(id) {
        let query = getCommentsQuery(id);
        return requestService.get(APPDATA_MODULE, query, AUTH);
    }

    function getSingleLink(id) {
        return requestService.get(APPDATA_MODULE, POSTS_ENTITY + id, AUTH);
    }

    function createLink(author, url, title, imageUrl, description) {
        let body = {
            author:author,
            url:url,
            title:title,
            imageUrl:imageUrl,
            description:description
        };

        return requestService.post(APPDATA_MODULE, POSTS_ENTITY, AUTH, body);
    }

    function createComment(postId, content, author) {
        let body = {
            postId:postId,
            content:content,
            author:author
        };

        return requestService.post(APPDATA_MODULE, COMMENTS_ENTITY, AUTH, body);
    }

    function editLink(id, author, url, title, imageUrl, description) {
        let body = {
            author:author,
            url:url,
            title:title,
            imageUrl:imageUrl,
            description:description
        };

        return requestService.update(APPDATA_MODULE, POSTS_ENTITY + id, AUTH, body);
    }

    function deleteLink(id) {
        return requestService.remove(APPDATA_MODULE, POSTS_ENTITY + id, AUTH);
    }

    function deleteComment(id) {
        return requestService.remove(APPDATA_MODULE, COMMENTS_ENTITY + id, AUTH);
    }

    return {
        listPosts,
        listMyPosts,
        listComments,
        getSingleLink,
        createLink,
        createComment,
        editLink,
        deleteLink,
        deleteComment
    };
})();