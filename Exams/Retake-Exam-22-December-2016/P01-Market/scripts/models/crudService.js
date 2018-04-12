let crudService = (() => {
    const APPDATA_MODULE = 'appdata';
    const USER_MODULE = 'user';
    const AUTH = 'kinvey';
    const PRODUCTS_ENTITY = 'products/';

    function getProducts() {
        return requestService.get(APPDATA_MODULE, PRODUCTS_ENTITY, AUTH);
    }

    function getUser() {
        return requestService.get(USER_MODULE, authService.getUserId(), AUTH);
    }

    function purchaseProduct(body) {
        return requestService.update(USER_MODULE, authService.getUserId(), AUTH, body);
    }

    return {
        getProducts,
        getUser,
        purchaseProduct
    };
})();