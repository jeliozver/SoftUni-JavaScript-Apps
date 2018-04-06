function request(method, endpoint, auth, body) {
    // Construct request, using the passed in parameters and return promise
    return $.ajax({
        method: method,
        url: endpoint,
        headers: auth,
        contentType: 'application/json',
        data: JSON.stringify(body)
    });
}