//init();


Offline.options = {
    checkOnLoad: true, 
    interceptRequests: true,
    reconnect: {
        // How many seconds should we wait before rechecking.
        initialDelay: 3,

        // How long should we wait between retries.
        delay: (1.5)
    },     
    checks: {xhr: {url: '/offline/index-test.html', timeout:1500}},
    requests: true
};
function runAjax() {
    var ajax_options = {
        method: 'POST',
        url: '/offline/ajax-test.php',
        async: true,
        post_data: "j=asdasd&k=123"
       // dataType: 'json',
    }

    if (1==1){  //Offline.state === 'down') {
        console.log('No connection, adding xhr to ajax controller');
        var ajaxManager = new AjaxManager();
        ajaxManager.addAjaxItem(ajax_options);
    }
    else {
        $.ajax({
           // add ajax stuff here yay.
           // combine the options above with a CB. 
           // Some kind of object appending thing.
        });
    }
}
