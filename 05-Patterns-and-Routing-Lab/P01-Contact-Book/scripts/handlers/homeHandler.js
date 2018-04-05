HANDLERS.homeHandler = function (context) {
    context.isAuth = auth.isAuth();

    $.get('./data/data.json')
        .then(contacts => {

            context.contacts = contacts;
            context.loadPartials({
                header: './templates/common/header.hbs',
                footer: './templates/common/footer.hbs',
                navigation: './templates/common/navigation.hbs',
                contactsPage: './templates/contacts/contactsPage.hbs',
                contact: './templates/contacts/contact.hbs',
                contactDetails: './templates/contacts/contactDetails.hbs',
                listContacts: './templates/contacts/listContacts.hbs',
                loginForm: './templates/forms/loginForm.hbs'
            }).then(function () {
                context.partials = this.partials;
                render();
            });
        })
        .catch(console.error);

    function render() {
        context.partial('./templates/home.hbs')
            .then(attachEvents)
    }

    function attachEvents() {
        $('.contact').on('click', function () {
            let element = $(this);
            context.selected = context.contacts[element.attr('data-id')];
            render();
        });
    }
};