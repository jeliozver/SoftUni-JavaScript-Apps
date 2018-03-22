function solve() {
    const infoDiv = $('#info').find('span');
    const departBtn = $('#depart');
    const arriveBtn = $('#arrive');
    const baseUrl = 'https://judgetests.firebaseio.com/schedule/';
    let nextStopId = 'depot';

    let req = {
        method: 'GET',
        url: '',
        success: handleSuccess,
        error: handleError
    };

    function depart() {
        departBtn.prop('disabled', true);
        arriveBtn.prop('disabled', false);
        sendRequest();
    }

    function arrive() {
        departBtn.prop('disabled', false);
        arriveBtn.prop('disabled', true);
        sendRequest();
    }

    function sendRequest() {
        req.url = baseUrl + nextStopId + '.json';
        $.ajax(req);
    }

    function handleSuccess(res) {
        let busStopName = res.name;
        if (departBtn.prop('disabled') === true) {
            infoDiv.text(`Next stop ${busStopName}`);
        } else {
            nextStopId = res.next;
            infoDiv.text(`Arriving at ${busStopName}`);
        }
    }

    function handleError() {
        infoDiv.text('Error');
        departBtn.prop('disabled', true);
        arriveBtn.prop('disabled', true);
    }

    return {
        depart,
        arrive
    };
}

let result = solve();