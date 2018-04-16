let crudService = (() => {
    const APPDATA_MODULE = 'appdata';
    const AUTH = 'kinvey';
    const RECEIPTS_ENTITY = 'receipts/';
    const ENTRIES_ENTITY = 'entries/';

    function getActiveQuery() {
        return `receipts?query={"_acl.creator":"${authService.getUserId()}","active":true}`;
    }

    function getEntriesQuery(id) {
        return `entries?query={"receiptId":"${id}"}`;
    }

    function getMyReceiptsQuery() {
        return `receipts?query={"_acl.creator":"${authService.getUserId()}","active":false}`;
    }

    function getActiveReceipt() {
        return requestService.get(APPDATA_MODULE, getActiveQuery(), AUTH);
    }

    function getMyReceipts() {
        return requestService.get(APPDATA_MODULE, getMyReceiptsQuery(), AUTH);
    }

    function createReceipt() {
        let body = {
            active: true,
            productCount: 0,
            total: 0
        };
        return requestService.post(APPDATA_MODULE, RECEIPTS_ENTITY, AUTH, body);
    }

    function checkoutReceipt(id, productCount, total) {
        let body = {
            active: false,
            productCount: productCount,
            total: total
        };

        return requestService.update(APPDATA_MODULE, RECEIPTS_ENTITY + id, AUTH, body);
    }

    function getEntries(id) {
        return requestService.get(APPDATA_MODULE, getEntriesQuery(id), AUTH);
    }

    function getReceiptDetails(id) {
        return requestService.get(APPDATA_MODULE, getEntriesQuery(id), AUTH);
    }

    function createEntry(recId, type, qty, price) {
        let body = {
            receiptId: recId,
            type: type,
            qty: qty,
            price: price
        };
        return requestService.post(APPDATA_MODULE, ENTRIES_ENTITY, AUTH, body);
    }

    function deleteEntry(id) {
        return requestService.remove(APPDATA_MODULE, ENTRIES_ENTITY + id, AUTH);
    }


    return {
        getActiveReceipt,
        createReceipt,
        getMyReceipts,
        checkoutReceipt,
        getEntries,
        createEntry,
        deleteEntry,
        getReceiptDetails
    };
})();