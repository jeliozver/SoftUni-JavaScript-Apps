const APP_KEY = 'kid_ByZoedtqf';
const APP_SECRET = '051d2a5f39db4e32bd03b13ec858d032';
const BASE_URL = 'https://baas.kinvey.com/';
const AUTH_HEADERS = {'Authorization': "Basic " + btoa(APP_KEY + ":" + APP_SECRET)};

const USER_REGISTER_URL = BASE_URL + `user/${APP_KEY}/`;
const USER_LOGIN_URL = USER_REGISTER_URL + 'login';
const USER_LOGOUT_URL = USER_REGISTER_URL + '_logout';
const ADS_BASE_URL = BASE_URL + `appdata/${APP_KEY}/ads/`;

// Local container for all ads in order to skip requesting all of them after each Edit/Delete
let adsContainer = [];

function getAuthToken() {
    return {'Authorization': "Kinvey " + sessionStorage.getItem('authToken')};
}

function registerUser() {
    let regForm = $('#formRegister');

    let username = regForm.find('input[name=username]').val();
    let password = regForm.find('input[name=passwd]').val();
    let body = {username: username, password: password};

    if (!validateInput(body)) return;

    request('POST', USER_REGISTER_URL, AUTH_HEADERS, body)
        .then(res => {
            signInUser(res, 'Registration successful.');
        })
        .catch(handleAjaxError);
}

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

function signInUser(res, message) {
    // Save username, authToken and userId into sessionStorage
    sessionStorage.setItem('username', res.username);
    sessionStorage.setItem('authToken', res._kmd.authtoken);
    sessionStorage.setItem('userId', res._id);

    loadLinksTemplate({
        isLogged: sessionStorage.getItem('authToken') !== null,
        username: "Welcome, " + sessionStorage.getItem('username') + "!"
    });

    loadHomeTemplate();
    showInfo(message);
}

function logoutUser() {
    request('POST', USER_LOGOUT_URL, getAuthToken(), {})
        .then(logoutSuccess)
        .catch(handleAjaxError);
}

function logoutSuccess() {
    sessionStorage.clear();

    loadLinksTemplate({
        isLogged: sessionStorage.getItem('authToken') !== null,
        username: "Welcome, " + sessionStorage.getItem('username') + "!"
    });

    loadHomeTemplate();
    showInfo('Logout successful.');
}

function createAd() {
    let createForm = $('#formCreateAd');
    // onPreSave hook in Kinvey is setting views to 0 for every new ad to avoid
    // someone, creating an add with a lot of views from the start
    let body = {
        publisher: sessionStorage.getItem('username'),
        title: createForm.find('input[name=title]').val(),
        description: createForm.find('textarea[name=description]').val(),
        date: createForm.find('input[name=datePublished]').val(),
        price: parseFloat(Number(createForm.find('input[name=price]').val()).toFixed(2)),
        image: createForm.find('input[name=image]').val(),
    };

    if (!validateInput(body)) return;

    request('POST', ADS_BASE_URL, getAuthToken(), body)
        .then(res => {
            res['isAuthor'] = true;
            adsContainer.push(res);
            displayAds();
            showInfo('Ad created.');
        })
        .catch(handleAjaxError);
}

function listAds() {
    // Send GET request for all ads in db
    // then sort response array and fill the local container with each entry
    request('GET', ADS_BASE_URL, getAuthToken(), {})
        .then(res => {
            adsContainer = [];

            for (let entry of res.sort((a, b) => b.views - a.views)) {
                if (sessionStorage.getItem('userId') === entry._acl.creator) {
                    entry['isAuthor'] = true;
                }

                adsContainer.push(entry);
            }

            displayAds();
        })
        .catch(handleAjaxError);
}

function deleteAd(id) {
    // Send DELETE request with ad id as endpoint
    // then delete entry from local container
    request('DELETE', ADS_BASE_URL + id, getAuthToken(), {})
        .then(() => {
            adsContainer = adsContainer.filter(function (obj) {
                return obj._id !== id;
            });

            displayAds();
            showInfo('Ad deleted.');
        })
        .catch(handleAjaxError);
}

function loadAdForEdit(data) {
    // Fill the inputs in the html with the data from the selected ad
    loadEditTemplate();
    let editForm = $('#formEditAd');
    editForm.find('input[name=id]').val(`${data._id}`);
    editForm.find('input[name=publisher]').val(`${data.publisher}`);
    editForm.find('input[name=title]').val(`${data.title}`);
    editForm.find('textarea[name=description]').val(`${data.description}`);
    editForm.find('input[name=datePublished]').val(`${data.date}`);
    editForm.find('input[name=price]').val(`${data.price}`);
    editForm.find('input[name=image]').val(`${data.image}`);
}

function editAd() {
    let editForm = $('#formEditAd');
    let id = editForm.find('input[name=id]').val();

    // onPreSave hook in Kinvey is setting views to the actual views in the database before
    // request completes in order to avoid someone, spamming fake views in his ad
    let body = {
        publisher: sessionStorage.getItem('username'),
        title: editForm.find('input[name=title]').val(),
        description: editForm.find('textarea[name=description]').val(),
        date: editForm.find('input[name=datePublished]').val(),
        price: parseFloat(Number(editForm.find('input[name=price]').val()).toFixed(2)),
        image: editForm.find('input[name=image]').val(),
    };

    if (!validateInput(body)) return;

    request('PUT', ADS_BASE_URL + id, getAuthToken(), body)
        .then(res => {
            for (let entry of adsContainer) {
                if (entry._id === id) {
                    // Update the info into local storage as well
                    entry.title = res.title;
                    entry.description = res.description;
                    entry.date = res.date;
                    entry.price = res.price;
                    entry.image = res.image;
                    entry.views = res.views;
                    entry.isAuthor = true;
                    break;
                }
            }

            displayAds();
            showInfo('Ad edited.');
        })
        .catch(handleAjaxError);
}

function getSingleAd(id) {
    // Sending GET request with id as endpoint will trigger preFetchHook in Kinvey
    // that will increment the views count so the response will return with the new views value
    request('GET', ADS_BASE_URL + id, getAuthToken(), {})
        .then(res => {
            for (let entry of adsContainer) {
                if (entry._id === id) {
                    // Update the info into local storage as well
                    entry.title = res.title;
                    entry.description = res.description;
                    entry.date = res.date;
                    entry.price = res.price;
                    entry.image = res.image;
                    entry.views = res.views;
                    break;
                }
            }

            displaySingleAd(res);
        })
        .catch(handleAjaxError);
}

function displayAds() {
    loadListAdsTemplate({
        ads: adsContainer
    });
}

function displaySingleAd(data) {
    // Fill the inputs in the html with the data from the selected ad
    loadAdDetailsTemplate();
    let detailsForm = $('#formDetailsAd');

    $('.adImage').find('img').attr('src', `${data.image}`);
    detailsForm.find('input[name=title]').val(`${data.title}`);
    detailsForm.find('textarea[name=description]').val(`${data.description}`);
    detailsForm.find('input[name=publisher]').val(`${data.publisher}`);
    detailsForm.find('input[name=datePublished]').val(`${data.date}`);
    detailsForm.find('input[name=views]').val(`${data.views}`);
}

function validateInput(data) {
    // Simulate server response object to pass it in the handleAjaxError function
    // in case there is an issue with the inputs from the user
    let errorResponse = {
        readyState: 1,
        responseJSON: {
            description: ''
        },
    };

    if (data.hasOwnProperty('username')) {
        if (data.username === '') {
            errorResponse.responseJSON['description'] = 'Please fill out Username field.';
            handleAjaxError(errorResponse);
            return false;
        }

        if (data.password === '') {
            errorResponse.responseJSON['description'] = 'Please fill out Password field.';
            handleAjaxError(errorResponse);
            return false;
        }

        return true;
    }

    if (data.title === '') {
        errorResponse.responseJSON['description'] = 'Please fill out Title field.';
        handleAjaxError(errorResponse);
        return false;
    }

    if (data.publisher === '') {
        errorResponse.responseJSON['description'] = 'Please fill out Publisher field.';
        handleAjaxError(errorResponse);
        return false;
    }

    if (data.description === '') {
        errorResponse.responseJSON['description'] = 'Please fill out Description field.';
        handleAjaxError(errorResponse);
        return false;
    }

    if (data.date === '') {
        errorResponse.responseJSON['description'] = 'Please fill out Date field.';
        handleAjaxError(errorResponse);
        return false;
    }

    if (isNaN(data.price)) {
        errorResponse.responseJSON['description'] = 'Please fill out Price field with a valid number.';
        handleAjaxError(errorResponse);
        return false;
    }

    if (data.image === '') {
        errorResponse.responseJSON['description'] = 'Please fill out Image field.';
        handleAjaxError(errorResponse);
        return false;
    }

    return true;
}

function handleAjaxError(response) {
    // Handle error and display the error message
    let errorMsg = JSON.stringify(response);
    if (response.readyState === 0)
        errorMsg = "Cannot connect due to network error.";
    if (response.responseJSON && response.responseJSON.description)
        errorMsg = response.responseJSON.description;

    showError(errorMsg);
}