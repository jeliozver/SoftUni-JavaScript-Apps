function getInfo() {
    const idInput = $('#stopId');
    const stopName = $('#stopName');
    const buses = $('#buses');
    const baseUrl = 'https://judgetests.firebaseio.com/businfo/';
    // The webhost will respond with valid data to IDs 1287, 1308, 1327 and 2334.

    let req = {
        method: 'GET',
        url: baseUrl + idInput.val() + '.json',
        success: handleSuccess,
        error: handleError
    };

    $.ajax(req);

    function handleSuccess(res) {
        buses.html('');

        if (res.name !== undefined && res.name !== '') {
            if (typeof res.buses === 'object') {
                for (let key in res.buses) {
                    stopName.text(res.name);
                    if (res.buses.hasOwnProperty(key)) {
                        let newLi = $('<li>').text(`Bus ${key} arrives in ${res.buses[key]} minutes`);
                        buses.append(newLi);
                    }
                }
            } else {
                handleError();
            }
        } else {
            handleError();
        }
    }

    function handleError(error) {
        buses.html('');
        stopName.text('Error');
    }
}