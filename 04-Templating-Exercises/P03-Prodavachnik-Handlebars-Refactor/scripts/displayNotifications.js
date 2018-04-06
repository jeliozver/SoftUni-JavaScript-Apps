function showInfo(message) {
    let infoBox = $('#infoBox');
    infoBox.text(message);
    infoBox.show();
    setTimeout(function () {
        $('#infoBox').fadeOut();
    }, 3000);
}

function showError(errorMsg) {
    let errorBox = $('#errorBox');
    errorBox.text("Error: " + errorMsg);
    errorBox.show();
}