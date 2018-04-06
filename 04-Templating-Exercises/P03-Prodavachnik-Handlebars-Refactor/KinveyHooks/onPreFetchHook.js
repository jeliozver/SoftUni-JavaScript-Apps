function onPreFetch(request, response, modules) {
    if (request.hasOwnProperty('entityId')) {
        var collectionAccess = modules.collectionAccess;
        var myID = collectionAccess.objectID(request.entityId);
        var ads = collectionAccess.collection("ads");

        ads.findAndModify({"_id": myID},[],{$inc: {"views": 1}},
            function (err, result) {
                if (err) {
                    response.error(err);
                } else {
                    response.continue();
                }
            });
    } else {
        response.continue();
    }
}