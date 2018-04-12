HANDLERS.shopHandler = function (context) {
    context.username = authService.getUsername();
    crudService.getProducts()
        .then(res => {
            for (let pr of res) {
                pr.price = pr.price.toFixed(2);
            }
            context.products = res;
            let partials = helperService.getCommonPartials();
            partials.product = './templates/product.hbs';
            context.loadPartials(partials).then(function () {
                this.partial('./templates/viewShop.hbs');
            });
        }).catch(helperService.handleError);

};

HANDLERS.purchaseHandler = function (context) {
    let stats = context.params.stats
        .split(':')
        .filter(e => e !== '');

    let productId = stats[0];
    let product = {
        name: stats[1],
        description: stats[2],
        price: stats[3]
    };

    crudService.getUser().then(res => {
        if (res.cart.hasOwnProperty(productId)) {
            let old = res.cart[productId].quantity;
            res.cart[productId].quantity = old + 1;
        } else {
            res.cart[productId] = {
                quantity: 1,
                product: product
            }
        }

        crudService.purchaseProduct(res).then(() => {
            helperService.showInfo('Product purchased.');
            context.redirect('#/cart');
        }).catch(requestService.handleError);

    }).catch(requestService.handleError);
};

HANDLERS.cartHandler = function (context) {
    context.username = authService.getUsername();

    crudService.getUser().then(res => {
        let cart = res.cart;
        let products = [];
        for (let entry in cart) {
            if (cart.hasOwnProperty(entry)) {
                let totalPrice = Number(cart[entry].quantity * cart[entry].product.price);
                let product = {
                    name: cart[entry].product.name,
                    description: cart[entry].product.description,
                    quantity: cart[entry].quantity,
                    price: totalPrice.toFixed(2),
                    _id: entry,
                };

                products.push(product);
            }
        }

        context.products = products;
        let partials = helperService.getCommonPartials();
        partials.cartItem = './templates/cartItem.hbs';
        context.loadPartials(partials).then(function () {
            this.partial('./templates/viewCart.hbs');
        });

    }).catch(helperService.handleError);
};

HANDLERS.discardHandler = function (context) {
    let id = context.params.id.slice(1);

    crudService.getUser().then(res => {
        if (res.cart.hasOwnProperty(id)) {
            delete res.cart[id];
            crudService.purchaseProduct(res).then(() => {
                helperService.showInfo('Product discarded.');
                context.redirect('#/cart');
            }).catch(requestService.handleError);
        } else {
            helperService.showError('Product is not in the cart!');
        }
    }).catch(requestService.handleError);
};

