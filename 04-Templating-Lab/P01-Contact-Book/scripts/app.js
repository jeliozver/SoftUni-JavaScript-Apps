$(() => {
    const CONTEXT = {
        contacts: []
    };
    const LIST = $('#list').find('.content');
    const INFO = $('#details').find('.content');

    let contactsTemplate;
    let detailsTemplate;

    loadData();
    loadTemplates();

    async function loadData() {
        CONTEXT.contacts = await $.get('data/data.json');
    }

    async function loadTemplates() {
        const CONTACTS = await $.get('templates/contacts.hbs');
        const DETAILS = await $.get('templates/contactDetails.hbs');

        contactsTemplate = Handlebars.compile(CONTACTS);
        detailsTemplate = Handlebars.compile(DETAILS);

        LIST.empty();
        LIST.append(contactsTemplate(CONTEXT));

        attachEvents();
    }

    function attachEvents() {
        $('.contact').on('click', function () {
            $('.active').removeClass('active');
            let element = $(this);
            element.addClass('active');
            return loadDetails(element.attr('data-id'));
        });
    }

    function loadDetails(index) {
        INFO.empty();
        INFO.append(detailsTemplate(CONTEXT.contacts[index]));
    }
});