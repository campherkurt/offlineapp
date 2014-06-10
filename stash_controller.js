function AjaxManager() {
    this.prefix = "amarula_consumer__"
};

AjaxManager.prototype.addAjaxItem = function(xhr) {
    var date = new Date();
    var uniqueDateId = date.valueOf();
    stash.set(this.prefix + uniqueDateId.toString(), xhr);
};

AjaxManager.prototype.cutItem = function(item) {
    stash.cut(item);
};

AjaxManager.prototype.getAllItems = function() {
    var items = stash.getAll();
    var our_items = [];
    for(var inx in items) {
        if (inx.search(this.prefix) > -1) { 
            our_items.push(inx);
        }
    }
    return our_items;
};

AjaxManager.prototype.successCallback = function(data) {
        var ax = new AjaxManager();
        ax.cutItem(this.stash_key);
};

AjaxManager.prototype.errorCallback = function(jqXHR, textStatus, errorThrown) {
        console.log(textStatus);   
        console.log(errorThrown);   
};

AjaxManager.prototype.syncAllAjaxItems = function() {
    var items = this.getAllItems();
    var that = this;
    items.forEach( function(key){
        var options = $.extend({}, stash.get(key), {success:that.successCallback, error:that.errorCallback});
        options.stash_key = key;
        $.ajax(options);
      
    });   
   
};



