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

function attachMenuLinksEvents() {
    $("#linkHome").on('click', loadHomeTemplate);

    if (sessionStorage.getItem('authToken') !== null) {
        $("#linkListAds").on('click', listAds);
        $("#linkCreateAd").on('click', loadCreateTemplate);
        $("#linkLogout").on('click', logoutUser);
    } else {
        $("#linkLogin").on('click', loadLoginTemplate);
        $("#linkRegister").on('click', loadRegisterTemplate);
    }

    $("a").on('click', function (event) {
        event.preventDefault();
    });
}

function attachLoginEvent() {
    $("#buttonLoginUser").on('click', function (event) {
        event.preventDefault();
        loginUser();
    });
}

function attachRegisterEvent() {
    $("#buttonRegisterUser").on('click', function (event) {
        event.preventDefault();
        registerUser();
    });
}

function attachCreateEvent() {
    $("#buttonCreateAd").on('click', function (event) {
        event.preventDefault();
        createAd();
    });
}

function attachEditEvent() {
    $("#buttonEditAd").on('click', function (event) {
        event.preventDefault();
        editAd();
    });
}

function attachViewEditDeleteEvents() {
    $(".details").on('click', function (event) {
        event.preventDefault();
        let id = $(this)
            .parent()
            .parent()
            .attr('data-id');
        getSingleAd(id);
    });

    $(".edit").on('click', function (event) {
        event.preventDefault();
        let container = $(this)
            .parent()
            .parent();

        let data = {
            _id: container.attr('data-id'),
            publisher: container.find('.publisher').text(),
            title: container.find('.ttl').text(),
            description: container.find('.description').text(),
            date: container.find('.date').text(),
            price: container.find('.price').text(),
            image: container.find('.img').text()
        };

        loadAdForEdit(data);
    });

    $(".delete").on('click', function (event) {
        event.preventDefault();
        let id = $(this)
            .parent()
            .parent()
            .attr('data-id');
        deleteAd(id);
    });
}

function attachBackBtnEvent() {
    $("#buttonBack").on('click', function (event) {
        event.preventDefault();
        displayAds();
    });
}