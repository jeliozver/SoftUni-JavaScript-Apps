(() => {
    const appKey = 'kid_BJXTsSi-e';
    const loginUrl = `https://baas.kinvey.com/user/${appKey}/login`;
    const baseUrl = `https://baas.kinvey.com/appdata/${appKey}/knock?query=`;

    const usernameInput = $('#username');
    const passwordInput = $('#password');
    const loginBtn = $('#loginBtn');
    const loginForm = $('.login');
    const resultDiv = $('#result');
    const knockBtn = $('#knockBtn');

    let username = '';
    let password = '';
    let auth = {};
    let nextMessage = 'Knock Knock.';

    resultDiv.css('display', 'none');

    loginBtn.on('click', login);
    knockBtn.on('click', knock);

    function login(event) {
        event.preventDefault();

        username = usernameInput.val();
        password = passwordInput.val();
        auth = {'Authorization': 'Basic ' + btoa(username + ':' + password)};

        let body = {
            username: `${username}`,
            password: `${password}`
        };

        request('POST', '', body)
            .then(greetUser)
            .catch(handleError);
    }

    function knock(event) {
        event.preventDefault();

        request('GET', nextMessage, {})
            .then(displayData)
            .catch(handleError)
    }

    function request(method, endpoint, body) {
        // Construct request, using the passed in parameters
        return $.ajax({
            method: method,
            url: method === 'GET' ? baseUrl + endpoint : loginUrl + endpoint,
            headers: auth,
            contentType: 'application/json',
            data: JSON.stringify(body)
        });
    }

    function greetUser(data) {
        resultDiv.css('display', 'block');
        loginForm.css('display', 'none');
        $('#user').text(`Hello, ${data.username}!`)
    }

    function displayData(data) {
        nextMessage = data.message;
        if (nextMessage === undefined) {
            resultDiv.append($('<h1>').text(`Secret Knock: ${data.answer}`));
            knockBtn.prop('disabled', true);
            return;
        }

        resultDiv.find('table').append($('<tr>')
            .append($('<td>').text(`${nextMessage}`))
            .append($('<td>').text(`${data.answer}`)))
    }

    function handleError(reason) {
        alert(`Error: ${reason.status} (${reason.statusText})`);
    }
})();