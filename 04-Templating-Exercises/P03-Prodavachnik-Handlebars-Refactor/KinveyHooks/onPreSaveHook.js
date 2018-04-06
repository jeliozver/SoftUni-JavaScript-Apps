function onPreSave(request, response, modules) {
    if (request.method === 'POST') {
        if (!request.body.hasOwnProperty('username')) {
            request.body.views = 0;
        }
        // Continue with the execution of the request
        response.continue();
    } else {
        var collectionAccess = modules.collectionAccess;
        var myID = collectionAccess.objectID(request.entityId);
        var ads = collectionAccess.collection("ads");

        ads.findOne({"_id": myID}, [], function (err, result) {
            // Will wait for the callback and then continue with the execution of the request
            if (err) {
                response.error(err);
            }
            request.body.views = result.views;
            response.continue();
        });
    }
}