function init() {
    ajaxDB.indexedDB.open();    
    ahowAllItems();
}

function addAjaxRequest(xhr) {
    ajaxDB.indexedDB.addAjaxRequest(xhr);
    
}

function manageAjaxRequests(xhr_item) {
    console.log("Received xhr item, going to send");
    console.log(xhr_item)
    
    //xhr_item.send();
}

function ahowAllItems(){
     ajaxDB.indexedDB.getAllAjaxRequests();    
}

