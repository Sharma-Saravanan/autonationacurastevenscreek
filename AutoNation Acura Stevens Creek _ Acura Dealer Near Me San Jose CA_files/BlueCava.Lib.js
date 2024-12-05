var BlueCava = {
    Lib: {

        _acceptableDomains: ["//sync.graph.bluecava.com", "//clients.bluecava.com", "//sdk.clients.bluecava.com", "//test.clients.mybluecava.com", "//qa.edge.mybluecava.com", "//localhost:61838"],

        _cbDelegate: null,

        GetEventOrigin: function (event) {
            if (typeof event.origin !== "undefined")
                return event.origin;

            // since pre-Opera browsers do not support event.origin, we must check different property
            if (typeof event.uri !== "undefined")
                return event.uri;

            return null;
        },

        IsAcceptableOrigin: function (origin) {
            for (var i = 0; i < this._acceptableDomains.length; i++)
                if (this._acceptableDomains[i] === origin)
                    return true;

            return false;
        },

        StripProtocol: function (s) {
            // strip protocol
            var i = s.indexOf("://");
            if (i >= 0) {
                // if the protocol is found, remove everything after the trailing slash
                // we'll be left with the domain
                var j = s.indexOf("/", i + 3);

                if (j >= 0)
                    return s.substring(i + 1, j);
                else
                    return s.substring(i + 1);
            }

            return s;
        },

        HandleMessage: function (event) {
            if ((event.type === "message" || event.type == "onmessage")) {
                try {
                    if (BlueCava.Lib.IsAcceptableOrigin(BlueCava.Lib.StripProtocol(BlueCava.Lib.GetEventOrigin(event)))) {
                        if (typeof _cbDelegate !== "undefined") {
                            _cbDelegate(event.data);
                        }
                    }

                } catch (e) {
                    // if the message is not from an expected domain or the message handler not defined, do nothing
                }
            }
            return;
        },

        OnDeviceFound: function (fn) {
            _cbDelegate = fn;
        }
    }
};
// Initialization of the message handling
if (window.addEventListener) {
    window.addEventListener("message", BlueCava.Lib.HandleMessage, false);
}
else if (window.attachEvent) {
    window.attachEvent("onmessage", BlueCava.Lib.HandleMessage);
}