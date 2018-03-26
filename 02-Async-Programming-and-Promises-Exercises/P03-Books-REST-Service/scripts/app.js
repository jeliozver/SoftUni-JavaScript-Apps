(() => {
    const Book = require('./Book.js');
    const request = require('./requestLauncher.js');

    const books = $('#books');
    const submitForm = $('#submitForm');
    const submitBtn = $('#submitBtn');

    const titleInput = submitForm.find('input.title');
    const authorInput = submitForm.find('input.author');
    const isbnInput = submitForm.find('input.isbn');
    const tags = submitForm.find('textarea.tags');

    request('GET', '', {})
        .then(displayBooks)
        .catch(handleError);

    submitBtn.on('click', () => {
        let body = {
            title: titleInput.val(),
            author: authorInput.val(),
            isbn: isbnInput.val(),
            tags: tags.val()
        };

        request('POST', '', body)
            .then(displayNewBook)
            .catch(handleError)
    });

    function createBookAndRender(book) {
        let newBook = new Book(
            book._id,
            book.title,
            book.author,
            book.isbn,
            book.tags
        );

        newBook.render(books);
    }

    function displayBooks(data) {
        for (let book of data) {
            createBookAndRender(book);
        }
    }

    function displayNewBook(data) {
        createBookAndRender(data);
        titleInput.val('');
        authorInput.val('');
        isbnInput.val('');
        tags.val('');
    }

    function handleError(reason) {
        // Display error with status and message
        alert(`Error: ${reason.status} (${reason.statusText})`);
    }
})();