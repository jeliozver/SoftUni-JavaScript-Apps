$(() => {
    const ALL_CATS = $('#allCats');
    const CONTEXT = {
        cats: window.cats
    };

    renderCatTemplate();

    function renderCatTemplate() {
        const CATS = $('#cat-template').html();
        const CATS_TEMPLATE = Handlebars.compile(CATS);
        ALL_CATS.empty();
        ALL_CATS.append(CATS_TEMPLATE(CONTEXT));
        attachEvents();
    }

    function attachEvents() {
        ALL_CATS.find('button').on('click', function () {
            let element = $(this);
            if (element.text() === 'Show status code') {
                element.text('Hide status code');
                element.next().show();
            } else {
                element.text('Show status code');
                element.next().hide();
            }
        });
    }
});