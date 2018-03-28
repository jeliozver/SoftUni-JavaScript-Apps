function request(method, endpoint, auth, body) {
    // Construct request, using the passed in parameters
    return $.ajax({
        method: method,
        url: endpoint,
        headers: auth,
        contentType: 'application/json',
        data: JSON.stringify(body)
    });
}