const request = require('./requestLauncher.js');

class Venue {
    constructor(id, name, description, startingHour, price) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.startingHour = startingHour;
        this.price = Number(price);
        this._element = this._createElement();
    }

    render(selector) {
        $(selector).append(this._element);
    }

    _createElement() {
        let container = $('<div>')
            .addClass('venue')
            .attr('id', `${this.id}`);

        let detailsDiv = $('<div>')
            .addClass('venue-details')
            .css('display', 'none');

        let table = $('<table>');
        let select = $('<select>').addClass('quantity');
        for (let i = 1; i <= 5; i++) {
            select.append($(`<option value="${i}">${i}</option>`));
        }

        let purchaseBtn = $('<input class="purchase" type="button" value="Purchase">')
            .on('click', (event) => {
                event.preventDefault();
                let value = select.find('option:selected').val();
                this._createConfirmation(value);
            });

        container.append($(`<span class="venue-name"><input class="info" type="button" value="More info">${this.name}</span>`)
            .on('click', (event) => {
                event.preventDefault();
                if (detailsDiv.css('display') === 'none') {
                    detailsDiv.css('display', 'block');
                } else {
                    detailsDiv.css('display', 'none');
                }
            }));

        table.append('<tr><th>Ticket Price</th><th>Quantity</th><th></th></tr>');
        table.append($('<tr>')
            .append(`<td class="venue-price">${this.price} lv</td>`)
            .append($('<td>').append(select))
            .append($('<td>').append(purchaseBtn)));

        detailsDiv.append(table);
        detailsDiv.append('<span class="head">Venue description:</span>');
        detailsDiv.append(`<p class="description">${this.description}</p>`);
        detailsDiv.append(`<p class="description">Starting time: ${this.startingHour}</p>`);

        container.append(detailsDiv);

        return container
    }

    _createConfirmation(value) {
        let infoDiv = $('<div>')
            .addClass('purchase-info');
        infoDiv.append(`<span>${this.name}</span>`);
        infoDiv.append(`<span>${value} x ${this.price}</span>`);
        infoDiv.append(`<span>Total: ${value * this.price} lv</span>`);
        infoDiv.append($('<input type="button" value="Confirm">').on('click', (event) => {
            event.preventDefault();
            this._sendTicketRequest(value);

        }));

        $('#venue-info')
            .empty()
            .append('<span class="head">Confirm purchase</span>')
            .append(infoDiv);
    }

    _sendTicketRequest(quantity) {
        let endpoint = `purchase?venue=${this.id}&qty=${quantity}`;
        request('POST', endpoint)
            .then(this._printTicket)
            .catch(this._handleError);

    }

    _printTicket(data) {
        $('#venue-info').html(data.html);
    }

    _handleError(reason) {
        alert(`Error: ${reason.status} (${reason.statusText})`);
    }
}

module.exports = Venue;