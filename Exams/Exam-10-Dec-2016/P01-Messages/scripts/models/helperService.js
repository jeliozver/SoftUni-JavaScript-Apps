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

    function formatDate(dateISO8601) {
        let date = new Date(dateISO8601);
        if (Number.isNaN(date.getDate()))
            return '';
        return date.getDate() + '.' + padZeros(date.getMonth() + 1) +
            "." + date.getFullYear() + ' ' + date.getHours() + ':' +
            padZeros(date.getMinutes()) + ':' + padZeros(date.getSeconds());

        function padZeros(num) {
            return ('0' + num).slice(-2);
        }
    }

    function formatSender(name, username) {
        if (!name)
            return username;
        else
            return username + ' (' + name + ')';
    }

    function getCommonPartials() {
        return {
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs'
        };
    }

    return {
        handleError,
        showInfo,
        showError,
        formatDate,
        formatSender,
        attachNotificationsEvents,
        getCommonPartials
    };
})();