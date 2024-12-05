(async APILoader => {
    const API = await APILoader.create(document.currentScript);
    API.subscribe('page-load-v1', function(ev) {
        API.utils.getConfig().then(function(config) {
            var roadsterUrl = "https://cdn1.roadster.com/roadster_ddc_button.js?dpid=" + config.dealerId + "&amp;host=" + ev.payload.defaultDomain
            API.loadJS(roadsterUrl);
        });
    });
  })(window.DDC.APILoader);