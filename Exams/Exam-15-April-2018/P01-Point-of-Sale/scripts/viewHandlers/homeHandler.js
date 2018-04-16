HANDLERS.homeHandler = function (context) {
    context.isAuth = authService.isAuth();
    context.username = sessionStorage.getItem('username');

    if (authService.isAuth()) {
        crudService.getActiveReceipt().then(active => {
            if (active.length === 0) {
                crudService.createReceipt()
                    .then(() => {
                        context.redirect('#/home');
                    }).catch(helperService.handleError);
            } else {
                context.id = active[0]._id;
                crudService.getEntries(active[0]._id)
                    .then(entries => {
                        let total = 0;
                        for (let en of entries) {
                            en.subTotal = en.qty * en.price;
                            total += en.subTotal;
                        }

                        context.productCount = entries.length;
                        context.total = total;
                        context.entries = entries;
                        render();
                    }).catch(helperService.handleError);
            }
        }).catch(helperService.handleError);
    } else {
        render();
    }

    function render() {
        let partials = helperService.getCommonPartials();
        context.loadPartials(partials).then(function () {
            this.partial('./templates/home.hbs').then(() => {
                let subTotal = $('#sTotalPartial');
                let qty = $('#sQty');
                let price = $('#sPrice');

                qty.on('input', function () {
                    let test = Number(qty.val());
                    let test2 = Number(price.val());
                    if (!isNaN(test) && !isNaN(test2)) {
                        subTotal.text(test * test2);
                    }
                });

                price.on('input', function () {
                    let test = Number(qty.val());
                    let test2 = Number(price.val());
                    if (!isNaN(test) && !isNaN(test2)) {
                        subTotal.text(test * test2);
                    }
                });
            });
        });
    }
};