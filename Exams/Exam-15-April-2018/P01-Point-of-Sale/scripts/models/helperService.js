let helperService = (() => {
    function attachNotificationsEvents() {
        $("#infoBox, #errorBox").on('click', function () {
            $(this).fadeOut();
        });

        $(document).on({
            ajaxStart: function () {
                $("#loadingBox").show();
            },
            ajaxStop: function () {
                $("#loadingBox").hide();
            }
        });
    }

    function handleError(reason) {
        let errorMsg = JSON.stringify(reason);
        if (reason.readyState === 0)
            errorMsg = "Cannot connect due to network error.";
        if (reason.responseJSON && reason.responseJSON.description)
            errorMsg = reason.responseJSON.description;
        showError(errorMsg);
    }

    function showInfo(message) {
        let infoBox = $('#infoBox');
        infoBox.find('span').text(message);
        infoBox.show();
        setTimeout(() => infoBox.fadeOut(), 3000);
    }

    function showError(message) {
        let errorBox = $('#errorBox');
        errorBox.find('span').text(message);
        errorBox.show();
    }

    function validateInput(username, password) {
        if (username.length < 5) {
            showError('Username must be at least 5 characters long!');
            return false;
        }

        if (password.length === 0) {
            showError('Password field should not be empty!');
            return false;
        }

        return true;
    }

    function validateEntity(type, qty, price) {
        if (type === '') {
            showError('Name must not be empty!');
            return false;
        }

        if (isNaN(qty) || qty === '') {
            showError('Quantity must be a number!');
            return false;
        }

        if (isNaN(price) || price === '') {
            showError('Price must be a number!');
            return false;
        }

        return true;
    }

    function formatDate(dateISO8601) {
        let date = new Date(dateISO8601);
        if (Number.isNaN(date.getDate()))
            return '';
        return date.getFullYear() + '-' + padZeros(date.getMonth() + 1) +
            "-" + date.getDate() + ' ' + date.getHours() + ':' +
            padZeros(date.getMinutes());

        function padZeros(num) {
            return ('0' + num).slice(-2);
        }
    }

    function getCommonPartials() {
        return {
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs',
            viewRegisterLogin: './templates/viewRegisterLogin.hbs',
            entry: './templates/entry.hbs'
        };
    }

    return {
        handleError,
        showInfo,
        showError,
        attachNotificationsEvents,
        validateInput,
        validateEntity,
        getCommonPartials,
        formatDate
    };
})();