// Supply appkey, username and password from your Kinvey project
// You can import sample entries from books.json file
const appKey = '';
const username = '';
const password = '';
const baseUrl = `https://baas.kinvey.com/appdata/${appKey}/books/`;
const auth = {'Authorization': 'Basic ' + btoa(username + ':' + password)};

function request(method, endpoint, body) {
    // Construct request, using the passed in parameters
    return $.ajax({
        method: method,
        url: baseUrl + endpoint,
        headers: auth,
        contentType: 'application/json',
        data: JSON.stringify(body),
    });
}

module.exports = request;