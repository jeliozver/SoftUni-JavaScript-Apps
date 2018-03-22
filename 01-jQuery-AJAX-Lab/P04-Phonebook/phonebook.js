$(() => {
    const phonebook = $('#phonebook');
    const loadBtn = $('#btnLoad');
    const nameInput = $('#person');
    const phoneInput = $('#phone');
    const createBtn = $('#btnCreate');
    const baseUrl = "https://phonebooklab-e9ebd.firebaseio.com/phonebook";
    // change baseUrl to your own firebase project to test add and delete

    let getContactsReq = {
        method: 'GET',
        url: baseUrl + '.json',
        success: displayContacts,
        error: handleError
    };

    let createContactReq = {
        method: 'POST',
        url: baseUrl + '.json',
        data: {},
        success: loadContacts,
        error: handleError,
        complete: () => createBtn.prop('disabled', false)
    };

    let deleteContactReq = {
        method: 'DELETE',
        url: '',
        success: loadContacts,
        error: handleError
    };

    loadBtn.on('click', loadContacts);
    createBtn.on('click', createContact);

    function loadContacts() {
        $.ajax(getContactsReq);
    }

    function displayContacts(res) {
        phonebook.html('');
        let contacts = Object.keys(res);

        for (let contact of contacts) {
            let delBtn = $('<button>Delete</button>').on('click', () => deleteContact(contact));
            let newLi = $('<li>').text(`${res[contact].name}: ${res[contact].phone} `);

            newLi.append(delBtn);
            phonebook.append(newLi);
        }
    }

    function createContact() {
        if (nameInput.val() === '' || phoneInput.val() === '') {
            return;
        }

        createBtn.prop('disabled', true);

        let obj = {
            name: nameInput.val(),
            phone: phoneInput.val()
        };

        createContactReq.data = JSON.stringify(obj);
        $.ajax(createContactReq);

        nameInput.val('');
        phoneInput.val('');
    }

    function deleteContact(contact) {
        deleteContactReq.url = baseUrl + '/' + contact + '.json';
        $.ajax(deleteContactReq);
    }

    function handleError(error) {
        alert(error.statusText);
    }
});