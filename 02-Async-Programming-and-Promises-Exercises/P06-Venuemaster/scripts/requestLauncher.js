const appKey = 'kid_BJ_Ke8hZg';
const username = 'guest';
const password = 'pass';
const venuesBaseUrl = `https://baas.kinvey.com/appdata/${appKey}/venues/`;
const baseQueryUrl = `https://baas.kinvey.com/rpc/${appKey}/custom/`;
const auth = {'Authorization': 'Basic ' + btoa(username + ':' + password)};

function request(method, endpoint) {
    // Construct request, using the passed in parameters
    return $.ajax({
        method: method,
        url: method === 'GET' ? venuesBaseUrl + endpoint : baseQueryUrl + endpoint,
        headers: auth,
        contentType: 'application/json',
    });
}

module.exports = request;