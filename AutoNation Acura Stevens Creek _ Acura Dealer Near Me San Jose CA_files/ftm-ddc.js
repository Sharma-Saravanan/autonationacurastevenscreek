(function (window) {
    try {
        window.fluency = window.fluency || {};

        var trackFunction = function (type, input) {
            if (type === 'remarketing' && input && !Array.isArray(input) && typeof input === 'object') {
                Object.keys(input).forEach(function(prop){
                    var val = (typeof input[prop] === 'object') ? JSON.stringify(input[prop]) : input[prop];
                    fetch('https://ftm.fluencyinc.co/trackTagParameter?key='+encodeURIComponent(prop)+'&value='+encodeURIComponent(val));
                });
            }
        };
        var partnerTrackFunction = function (type, payload) {
            if (JSON.stringify) {
                try {
                    var tracked = type + '-' + JSON.stringify(payload);
                    if (window.fluency.partnerTrackDedup.indexOf(tracked) > -1) {
                                                return;
                    } else {
                        window.fluency.partnerTrackDedup.push(tracked);
                    }
                } catch (e) {}
            }

                            fbq('trackSingle', '1556334518188325', type, payload);
            
                            var googleMerged = Object.assign({event: payload.ftmName, eventCategory: type, eventAction: payload.ftmCategory }, payload);
                dataLayer.push(googleMerged);
            
                    };

        window.fluency.track = window.fluency.track || trackFunction;
        window.fluency.partnerTrack = window.fluency.partnerTrack || partnerTrackFunction;
        window.fluency.partnerTrackDedup = window.fluency.partnerTrackDedup || [];

        window.fluency.trackingids = window.fluency.trackingids || {};
                    window.fluency.trackingids["Facebook"] = 1556334518188325;
                                    window.fluency.trackingids["Google Ads"] = 11139902459;
                            } catch (e) {}
})(window);

(function(w,d) {
    var n = d.createElement('script');
    n.src = "https://www.googletagmanager.com/gtag/js?id=AW-11139902459";
    n.async = 1;
    n.onload = function() {
        w.dataLayer = w.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'AW-11139902459');
    };
    var s = d.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(n,s);
})(window,document);




!function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
        n.callMethod ?
                n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
}(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

!function(f) {
    if (f.fbq && f.fbq.instance) {
        if (f.fbq.instance.pixelsById && f.fbq.instance.pixelsById[1556334518188325] && f.fbq.instance.pixelsById[1556334518188325].eventCount > 0) {
                        return;
        }
        if (f.fbq.instance.configsLoaded && f.fbq.instance.configsLoaded[1556334518188325] === true) {
                        return;
        }
    }
        f.fbq('init', '1556334518188325');

            if ( window.DDC && window.DDC.dataLayer && window.DDC.dataLayer.page) {
            f.fbq('track', 'PageView', {}, {eventID: window.DDC.dataLayer.page.pageViewId});
        } else {
            f.fbq('trackSingle', '1556334518188325', 'PageView');
        }
    

}(window)



