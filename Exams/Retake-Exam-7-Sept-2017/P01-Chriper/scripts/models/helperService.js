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

    function calcTime(dateIsoFormat) {
        let diff = new Date - (new Date(dateIsoFormat));
        diff = Math.floor(diff / 60000);
        if (diff < 1) return 'less than a minute';
        if (diff < 60) return diff + ' minute' + pluralize(diff);
        diff = Math.floor(diff / 60);
        if (diff < 24) return diff + ' hour' + pluralize(diff);
        diff = Math.floor(diff / 24);
        if (diff < 30) return diff + ' day' + pluralize(diff);
        diff = Math.floor(diff / 30);
        if (diff < 12) return diff + ' month' + pluralize(diff);
        diff = Math.floor(diff / 12);
        return diff + ' year' + pluralize(diff);
        function pluralize(value) {
            if (value !== 1) return 's';
            else return '';
        }
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

    function getCommonPartials() {
        return {
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs',
            menu: './templates/common/menu.hbs',
            loginView: './templates/common/loginView.hbs'
        };
    }

    return {
        handleError,
        showInfo,
        showError,
        attachNotificationsEvents,
        calcTime,
        validateInput,
        getCommonPartials
    };
})();