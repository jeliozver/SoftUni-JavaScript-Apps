function attachEvents() {
    const locationInput = $('#location');
    const submitBtn = $('#submit');
    const currentDiv = $('#current');
    const upcomingDiv = $('#upcoming');
    const forecastDiv = $('#forecast');

    const baseUrl = 'https://judgetests.firebaseio.com/';
    const symbols = {
        'Sunny': "\u2600", // ☀
        'Partly sunny': "\u26C5", // ⛅
        'Overcast': "\u2601", // ☁
        'Rain': "\u2602", // ☂
        'Degrees': "\u00B0", // °
    };

    let location, code;

    submitBtn.on('click', function () {
        code = undefined;
        location = locationInput.val();

        $.ajax({
            method: 'GET',
            url: baseUrl + 'locations/.json',
            success: findLocation,
            error: handleError,
            complete: () => requestData()
        });

        function requestData() {
            if (typeof code === 'undefined') {
                handleError();
                return;
            }

            request(`forecast/today/${code}.json`)
                .then(displayToday)
                .catch(handleError);

            request(`forecast/upcoming/${code}.json`)
                .then(displayForecast)
                .catch(handleError);
        }
    });

    function request(endpoint) {
        return $.ajax({
            method: 'GET',
            url: baseUrl + endpoint
        });
    }

    function findLocation(data) {
        for (let loc of data) {
            if (loc.name === location) {
                code = loc.code;
                break;
            }
        }
    }

    function displayToday(data) {
        forecastDiv.css('display', 'block');
        currentDiv.empty();
        currentDiv.append($('<div class="label">Current conditions</div>'));
        currentDiv.append($('<span>')
            .addClass('condition symbol')
            .text(`${symbols[data.forecast.condition]}`));

        let spanContainer = $('<span>').addClass('condition');
        spanContainer.append($('<span>')
            .addClass('forecast-data')
            .text(`${data.name}`));
        spanContainer.append($('<span>')
            .addClass('forecast-data')
            .text(`${data.forecast.low}${symbols.Degrees}/${data.forecast.high}${symbols.Degrees}`));
        spanContainer.append($('<span>')
            .addClass('forecast-data')
            .text(`${data.forecast.condition}`));

        currentDiv.append(spanContainer);
    }

    function displayForecast(data) {
        forecastDiv.css('display', 'block');
        upcomingDiv.empty();
        upcomingDiv.append($('<div class="label">Three-day forecast</div>'));
        for (let fore of data.forecast) {
            let spanContainer = $('<span>').addClass('upcoming');
            spanContainer.append($('<span>')
                .addClass('symbol')
                .text(`${symbols[fore.condition]}`));
            spanContainer.append($('<span>')
                .addClass('forecast-data')
                .text(`${fore.low}${symbols.Degrees}/${fore.high}${symbols.Degrees}`));
            spanContainer.append($('<span>')
                .addClass('forecast-data')
                .text(`${fore.condition}`));

            upcomingDiv.append(spanContainer);
        }
    }

    function handleError() {
        forecastDiv.text('Error').css('display', 'block');
    }
}

attachEvents();