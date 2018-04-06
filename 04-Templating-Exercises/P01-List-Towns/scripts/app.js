$(() => {
    const TOWNS_CONTAINER = $('#root');
    const TOWNS_INPUT = $('#towns');
    const TOWNS_BTN = $('#btnLoadTowns');

    const CONTEXT = {
        towns: []
    };

    attachEvents();

    function attachEvents() {
        TOWNS_BTN.on('click', getTownsNames);
    }

    function getTownsNames() {
        event.preventDefault();
        CONTEXT.towns = TOWNS_INPUT.val().split(', ');
        loadTowns();
    }

    function loadTowns() {
        const TOWNS = $('#towns-template').html();
        const TOWNS_TEMPLATE = Handlebars.compile(TOWNS);

        TOWNS_CONTAINER.empty();
        TOWNS_CONTAINER.append(TOWNS_TEMPLATE(CONTEXT));
    }
});