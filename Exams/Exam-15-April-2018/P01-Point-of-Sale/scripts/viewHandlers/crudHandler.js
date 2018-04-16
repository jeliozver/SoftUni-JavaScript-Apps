HANDLERS.createEntryHandler = function (context) {
    let type = context.params.type;
    let qty = Number(context.params.qty);
    let price = Number(context.params.price);
    let receiptId = $('#recId').val();

    if (helperService.validateEntity(type, qty, price)) {
        crudService.createEntry(receiptId, type, qty, price)
            .then(() => {
                helperService.showInfo('Entry added');
                context.redirect('#/home');
            }).catch(helperService.handleError);
    }
};

HANDLERS.deleteEntryHandler = function (context) {
    let id = context.params.id.slice(1);
    crudService.deleteEntry(id).then(() => {
        helperService.showInfo('Entry removed');
        context.redirect('#/home');
    }).catch(helperService.handleError);
};

HANDLERS.checkoutHandler = function (context) {
    let id = context.params.receiptId;
    let productCount = Number(context.params.productCount);
    let total = Number(context.params.total);

    if (productCount <= 0) {
        helperService.showError('Cannot checkout an empty receipt!')
    } else {
        crudService.checkoutReceipt(id, productCount, total).then(() => {
            helperService.showInfo('Receipt checked out');
            crudService.createReceipt().then(() => {
                context.redirect('#/home');
            }).catch(helperService.handleError);
        }).catch(helperService.handleError);
    }
};

HANDLERS.listReceiptsHandler = function (context) {
    context.username = sessionStorage.getItem('username');
    crudService.getMyReceipts().then(res => {
        for (let rec of res) {
            rec.date = helperService.formatDate(rec._kmd.lmt);
        }

        context.receipts = res;
        render();

    }).catch(helperService.handleError);

    function render() {
        let partials = helperService.getCommonPartials();
        partials.receipt = './templates/receipt.hbs';
        context.loadPartials(partials).then(function () {
            this.partial('./templates/viewReceipts.hbs');
        });
    }
};

HANDLERS.getReceiptDetails = function (context) {
    context.username = sessionStorage.getItem('username');
    let id = context.params.id.slice(1);
    crudService.getReceiptDetails(id).then(res => {
        for (let en of res) {
            en.subTotal = en.qty * en.price;
        }
        context.receipts = res;
        render();
    }).catch(helperService.handleError);

    function render() {
        let partials = helperService.getCommonPartials();
        partials.entryDetails = './templates/entryDetails.hbs';
        context.loadPartials(partials).then(function () {
            this.partial('./templates/viewReceiptDetails.hbs');
        });
    }
};