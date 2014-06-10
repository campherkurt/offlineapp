var ajaxDB = {};
ajaxDB.indexedDB = {};

ajaxDB.indexedDB.db = null;
/*ajaxDB.indexedDB.onerror = function(e) {
    console.log(e);
}
*/
ajaxDB.indexedDB.open = function() {
    console.log("Starting the open()");
    var version = 1;
    var request = indexedDB.open('ajax_requests', version);
    
    request.onupgradeneeded = function(e) {
        var db = e.target.result;
        console.log(e.target);
        console.log(ajaxDB.indexedBD);
        e.target.transaction.onerror = ajaxDB.indexedDB.onerror;    
        if (db.objectStoreNames.contains("ajax_requests")) {
            console.log("Found a DB, deleting it");
            db.deleteObjectStore("ajax_requests");
        }
        
        console.log("Creating new db");
        var store = db.createObjectStore("ajax_requests", 
            {keyPath:"timeStamp"} // Keypath is the prop that makes the object unique. Must be present on each stored object.
        );
    };

    request.onsuccess = function(e) {
        ajaxDB.indexedDB.db = e.target.result;
        //ajaxDB.indexedDB.getAllAjaxRequests();
    }    
    request.onerror = ajaxDB.indexedDB.onerror;

}

ajaxDB.indexedDB.addAjaxRequest = function(xhr) {
    console.log("About to add a xhr object");
    console.log(xhr)
    var db = ajaxDB.indexedDB.db;
    var trans = db.transaction(["ajax_requests"], "readwrite");
    var store = trans.objectStore("ajax_requests");

    var request = store.put({
        "xhr": xhr,
        "timeStamp": new Date().getTime()
    });
    console.log("XHR  Object added");
    
    request.onsuccess = function(e) {
        console.log('yay it worked');
        ajaxDB.indexedDB.getAllAjaxRequests();    
    }; 
    request.onerror = function(e) {
        console.log(e.value);    
    };
};

ajaxDB.indexedDB.getAllAjaxRequests = function() {
    console.log("About to return all objects");
    var db = ajaxDB.indexedDB.db;
    var trans = db.transaction(['ajax_requests'], "readwrite");
    var store = trans.objectStore("ajax_requests");

    //Get everything
    var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = store.openCursor(keyRange);

    cursorRequest.onsuccess = function(e) {
       var result = e.target.result;
       if(!!result == false) {
           return;
       }     
       manageAjaxRequests(result.value);
       console.log("Returning now hey... YAY");
       result.continue;
    };
    cursorRequest.onerror = ajaxDB.indexedDB.onerror;
};

