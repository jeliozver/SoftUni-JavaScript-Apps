// Supply appkey, username and password from your Kinvey project
const appKey = `kid_BJXTsSi-e`;
const username = 'guest';
const password = 'guest';

const baseUrl = `https://baas.kinvey.com/appdata/${appKey}/students/`;
const auth = {'Authorization': 'Basic ' + btoa(username + ':' + password)};

function request(method, body) {
    // Construct request, using the passed in parameters
    return $.ajax({
        method: method,
        url: baseUrl,
        headers: auth,
        contentType: 'application/json',
        data: JSON.stringify(body),
    });
}

module.exports = request;