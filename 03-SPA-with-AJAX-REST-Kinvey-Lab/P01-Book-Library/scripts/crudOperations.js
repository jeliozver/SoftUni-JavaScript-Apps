const APP_KEY = 'kid_rkyWGeO9z';
const APP_SECRET = '7eb6a7639c1f42be8b711d47a5756f44';
const BASE_URL = 'https://baas.kinvey.com/';

const USER_REGISTER_URL = BASE_URL + `user/${APP_KEY}/`;
const USER_LOGIN_URL = USER_REGISTER_URL + 'login';
const USER_LOGOUT_URL = USER_REGISTER_URL + '_logout';

const BOOKS_BASE_URL = BASE_URL + `appdata/${APP_KEY}/books/`;

const AUTH_HEADERS = {'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET)};
const BOOKS_PER_PAGE = 10;

let bks = [];

function loginUser() {
    let loginForm = $('#formLogin');

    let username = loginForm.find('input[name=username]').val();
    let password = loginForm.find('input[name=passwd]').val();
    let body = {username: username, password: password};

    request('POST', USER_LOGIN_URL, AUTH_HEADERS, body)
        .then(res => {
            signInUser(res, 'Login successful.');
        }).catch(handleAjaxError);
}

function registerUser() {
    let regForm = $('#formRegister');

    let username = regForm.find('input[name=username]').val();
    let password = regForm.find('input[name=passwd]').val();
    let body = {username: username, password: password};

    request('POST', USER_REGISTER_URL, AUTH_HEADERS, body)
        .then(res => {
            signInUser(res, 'Registration successful.');
        })
        .catch(handleAjaxError);
}

function listBooks() {
    request('GET', BOOKS_BASE_URL, getAuthToken(), {})
        .then(res => {
            showView('viewBooks');
            bks = [];
            for (let entry of res.reverse()) {
                bks.push(entry);
            }

            displayPaginationAndBooks(bks);
        })
        .catch(handleAjaxError);
}

function createBook() {
    let createForm = $('#formCreateBook');
    let body = {
        title: createForm.find('input[name=title]').val(),
        author: createForm.find('input[name=author]').val(),
        description: createForm.find('textarea[name=description]').val()
    };

    request('POST', BOOKS_BASE_URL, getAuthToken(), body)
        .then(res => {
            showView('viewBooks');
            bks.unshift(res);
            displayPaginationAndBooks(bks);
        })
        .catch(handleAjaxError);
}

function deleteBook(book) {
    request('DELETE', BOOKS_BASE_URL + book, getAuthToken(), {})
        .then(() => {
            showView('viewBooks');
            bks = bks.filter(function(obj) {
                return obj._id !== book;
            });

            displayPaginationAndBooks(bks);
        })
        .catch(handleAjaxError);
}

function loadBookForEdit(id, title, author, description) {
    showView('viewEditBook');
    let editForm = $('#formEditBook');
    editForm.find('input[name=id]').val(`${id}`);
    editForm.find('input[name=title]').val(`${title}`);
    editForm.find('input[name=author]').val(`${author}`);
    editForm.find('textarea[name=description]').val(`${description}`);
}

function editBook() {
    let editForm = $('#formEditBook');
    let id = editForm.find('input[name=id]').val();

    let body = {
        title: editForm.find('input[name=title]').val(),
        author: editForm.find('input[name=author]').val(),
        description: editForm.find('textarea[name=description]').val()
    };

    request('PUT', BOOKS_BASE_URL + id, getAuthToken(), body)
        .then(() => {
            showView('viewBooks');
            for (let entry of bks) {
                if (entry._id === id) {
                    entry.title = body.title;
                    entry.author = body.author;
                    entry.description = body.description;
                    break;
                }
            }

            displayPaginationAndBooks(bks);
        })
        .catch(handleAjaxError);
}

function logoutUser() {
    request('POST', USER_LOGOUT_URL, getAuthToken(), {})
        .then(logoutSuccess)
        .catch(handleAjaxError);
}

function getAuthToken() {
    return {'Authorization': "Kinvey " + sessionStorage.getItem('authToken')};
}

function signInUser(res, message) {
    sessionStorage.setItem('username', res.username);
    sessionStorage.setItem('authToken', res._kmd.authtoken);
    sessionStorage.setItem('userId', res._id);

    showHomeView();
    showHideMenuLinks();
    showInfo(message);
}

function logoutSuccess() {
    sessionStorage.clear();
    showHomeView();
    showHideMenuLinks();
    showInfo('Logout successful.');
}

function displayPaginationAndBooks(books) {
    let pagination = $('#pagination-demo');
    if (pagination.data("twbs-pagination")) {
        pagination.twbsPagination('destroy')
    }
    pagination.twbsPagination({
        totalPages: Math.ceil(books.length / BOOKS_PER_PAGE),
        visiblePages: 5,
        next: 'Next',
        prev: 'Prev',
        onPageClick: function (event, page) {
            let table = $('#books').find('table');
            table.find('tr:gt(0)').remove();
            let startBook = (page - 1) * BOOKS_PER_PAGE;
            let endBook = Math.min(startBook + BOOKS_PER_PAGE, books.length);
            $(`a:contains(${page})`).addClass('active');
            for (let i = startBook; i < endBook; i++) {
                table.append(renderBook(books[i]));
            }
        }
    });
}

function renderBook(data) {
    let container = $('<tr>');
    let bookTitle = $('<td>').text(`${data.title}`);
    let bookAuthor = $('<td>').text(`${data.author}`);
    let bookDesc = $('<td>').text(`${data.description}`);
    let links = $('<td>');

    if (sessionStorage.getItem('userId') === data._acl.creator) {
        let deleteLink = $('<a href="#">[Delete]<a>').on('click', (event) => {
            event.preventDefault();
            deleteBook(data._id);
        });

        let editLink = $('<a href="#">[Edit]<a>').on('click', (event) => {
            event.preventDefault();
            loadBookForEdit(data._id, data.title, data.author, data.description);
        });

        links.append(deleteLink);
        links.append(editLink);
    }

    container
        .append(bookTitle)
        .append(bookAuthor)
        .append(bookDesc)
        .append(links);

    return container;
}

function handleAjaxError(response) {
    let errorMsg = JSON.stringify(response);
    if (response.readyState === 0)
        errorMsg = "Cannot connect due to network error.";
    if (response.responseJSON && response.responseJSON.description)
        errorMsg = response.responseJSON.description;
    showError(errorMsg);
}