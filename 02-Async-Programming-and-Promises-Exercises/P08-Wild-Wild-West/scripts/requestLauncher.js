const appKey = 'kid_SJl3KvDqz';
const username = 'peter';
const password = 'sagan';
const baseUrl = `https://baas.kinvey.com/appdata/${appKey}/players/`;
const auth = {'Authorization': 'Basic ' + btoa(username + ':' + password)};

function request(method, endpoint, body) {
    // Construct request, using the passed in parameters
    return $.ajax({
        method: method,
        url: baseUrl + endpoint,
        headers: auth,
        contentType: 'application/json',
        data: JSON.stringify(body)
    });
}