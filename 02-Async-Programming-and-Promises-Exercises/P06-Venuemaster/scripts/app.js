(() => {
    // The service at the given address will respond
    // with valid information for dates "23-11", "24-11", "25-11", "26-11" and "27-11"
    const request = require('./requestLauncher.js');
    const Venue = require('./Venue.js');

    const dateInput = $('#venueDate');
    const getVenuesBtn = $('#getVenues');

    getVenuesBtn.on('click', (event) => {
        $('#venue-info').empty();
        event.preventDefault();

        let date = dateInput.val();
        let endpoint = `calendar?query=${date}`;

        request('POST', endpoint)
            .then(getVenues)
            .catch(handleError)
    });

    function getVenues(data) {
        for (let id of data) {
            request('GET', id)
                .then(displayVenue)
                .catch(handleError);
        }
    }

    function displayVenue(data) {
        let newVenue = new Venue(
            data._id,
            data.name,
            data.description,
            data.startingHour,
            data.price
        );

        newVenue.render('#venue-info');
    }

    function handleError(reason) {
        alert(`Error: ${reason.status} (${reason.statusText})`);
    }
})();