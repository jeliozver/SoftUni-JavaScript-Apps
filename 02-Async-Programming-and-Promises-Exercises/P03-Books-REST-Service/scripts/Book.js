const request = require('./requestLauncher.js');

class Book {
    constructor(id, title, author, isbn, tags) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.tags = tags;
        this._inputs = this._createInputs();
        this._book = this._createBook();
    }

    render(selector) {
        $(selector).append(this._book);
    }

    _createInputs() {
        return {
            title: $('<input type="text" class="title"/>').val(`${this.title}`),
            author: $('<input type="text" class="author"/>').val(`${this.author}`),
            isbn: $('<input type="text" class="isbn"/>').val(`${this.isbn}`),
            tags: $('<textarea class="tags">').val(`${this.tags}`),
        }
    }

    _createBook() {
        let container = $('<div>')
            .addClass('book')
            .attr('book-id', `${this.id}`);
        let updateBtn = $('<button>Update</button>')
            .addClass('update')
            .on('click', this._sendPutRequest.bind(this));
        let delBtn = $('<button>Delete</button>')
            .addClass('delete')
            .on('click', this._sendDeleteRequest.bind(this));

        container.append('<label>Title</label>');
        container.append(this._inputs.title);
        container.append('<label>Author</label>');
        container.append(this._inputs.author);
        container.append('<label>ISBN</label>');
        container.append(this._inputs.isbn);
        container.append('<label>Tags</label>');
        container.append(this._inputs.tags);

        container.append(updateBtn);
        container.append(delBtn);

        return container;
    }

    _sendPutRequest() {
        // Send PUT request, using the data from the input fields (from the current instance) as body
        let body = {
            "title": `${this._inputs.title.val()}`,
            "author": `${this._inputs.author.val()}`,
            "isbn": `${this._inputs.isbn.val()}`,
            "tags": `${this._inputs.tags.val()}`
        };

        request('PUT', this.id, body)
            .then()
            .catch(this._handleError);
    }

    _sendDeleteRequest() {
        // Send DELETE request, using the id from the current instance as endpoint
        // and remove the current instance from the document
        request('DELETE', this.id, {})
            .then(() => $(this._book.remove()))
            .catch(this._handleError);
    }

    _handleError(reason) {
        // Display error with status and message
        alert(`Error: ${reason.status} (${reason.statusText})`);
    }
}

module.exports = Book;