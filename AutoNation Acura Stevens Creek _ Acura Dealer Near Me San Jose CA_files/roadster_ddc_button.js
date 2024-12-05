
(function(WIAPI) {
  var dpid = 'autonationacurastevenscreek';
  var dealerHost = 'www.autonationacurastevenscreek.com';
  var scriptHost = '//cdn1.roadster.com';
  var expressHost = 'https://autonationacurastevenscreek.autonation.com';
  var enabled = true;
  var embedded = true;
  var newAccountIds = [];
  var usedAccountIds = [];
  var analytics = true;
  var shiftAnalytics = false;
  var buttonSelector = '.roadster-btn';
  var labels = {};
  var validVin = /^[A-HJ-NPR-Z0-9]{17}$/;
  if (''.length) {
    var bannerImageUrl = 'https://dealer-partner-assets.roadster.com/';
  }

  labels.en_US = {};
  labels.en_US.srpNew1Label = 'Calculate Payment';
  labels.en_US.srpNew2Label = '';
  labels.en_US.vdpNew1Label = 'Calculate Payment';
  labels.en_US.vdpNew2Label = '';
  labels.en_US.srpUsed1Label = 'Calculate Payment';
  labels.en_US.srpUsed2Label = '';
  labels.en_US.vdpUsed1Label = 'Calculate Payment';
  labels.en_US.vdpUsed2Label = '';
  var srpNew1Template = '';
  var srpNew2Template = '';
  var vdpNew1Template = '';
  var vdpNew2Template = '';
  var srpUsed1Template = '';
  var srpUsed2Template = '';
  var vdpUsed1Template = '';
  var vdpUsed2Template = '';
  var locales = ["en_US"];
  var locale = locales[0];
  var rdLocale = '';
  var ddcHomepageHtmlTemplate = '';

  var API = new WIAPI('roadster');
  window.roadster = window.roadster || {};

  var getButtonInfo = function(type, meta, isVdp) {
    var used = /used|cpo|certified/i.test(meta.inventoryType);
    var path = (used ? '/express/used/' : '/express/') + meta.vin;
    var labelKey, template;
    if (type == 'primary') {
      labelKey = used ? (isVdp ? 'vdpUsed1Label' : 'srpUsed1Label') : (isVdp ? 'vdpNew1Label' : 'srpNew1Label');
      template = used ? (isVdp ? vdpUsed1Template : srpUsed1Template) : (isVdp ? vdpNew1Template : srpNew1Template);
    } else {
      labelKey = used ? (isVdp ? 'vdpUsed2Label' : 'srpUsed2Label') : (isVdp ? 'vdpNew2Label' : 'srpNew2Label');
      template = used ? (isVdp ? vdpUsed2Template : srpUsed2Template) : (isVdp ? vdpNew2Template : srpNew2Template);
    }
    if (rdLocale) { path = path + '?locale=' + rdLocale; }
    return {label: labels[locale][labelKey], template: template, path: path};
  };


  var getStyle = function(template) {
    var match = (template || '').match(/style=['"]([^'"]*)['"]/);
    return match ? match[1] : null;
  };

  var getClasses = function(template, hasImage) {
    var extra = 'roadster-btn' + (hasImage ? ' border-0 p-0' : '');
    var match = (template || '').match(/class=['"]([^'"]*)['"]/);
    return (match && match[1]) ? (extra + ' ' + match[1]) : extra;
  };

  var getImage = function(template) {
    var match = (template || '').match(/<img.*src=['"]([^'"]*)['"]/);
    return match ? match[1] : null;
  };

  var getLink = function(template, path) {
    var match = (template || '').match(/href=['"]([\w:\/\.]+)['"]/);
    return match ? match[1] : (expressHost + path);
  };

  var getTarget = function(template) {
    var match = (template || '').match(/target=['"]([^'"]*)['"]/);
    return match ? match[1] : null;
  };

  var openFrame = function(event) {
    if (embedded && window.roadster.showFrame) {
      event.preventDefault();
      var button = this;
      var vin = button.dataset.vin;
      var zip = null;
      API.utils.getVehicleData().then(function (vehicleData) {
        var zip = undefined;
        if (vehicleData) {
          vehicleData.forEach(function (vehicle) {
            if (vehicle && vehicle.vin === vin && vehicle.address && vehicle.address.postalCode) {
              zip = vehicle.address.postalCode;
            }
          })
        }
        window.roadster.showFrame(event.originalEvent, vin, zip);
      });
    }
  };

  var preloadVin = function(vin, zip) {
    if (!window.roadster.vinToPreload && embedded) {
      loadScript('roadster_frame_embed.js');
    }
    window.roadster.vinToPreload = window.roadster.vinToPreload || vin;
    window.roadster.zipToPreload = window.roadster.zipToPreload || zip;
  };

  var addButton = function(type, meta, isVdp) {
    var accountIds = meta.inventoryType === 'new' ? newAccountIds : usedAccountIds;
    if (accountIds.length > 0 && accountIds.indexOf(meta.accountId) < 0 || !validVin.test(meta.vin)) {
      return;
    }
    var info = getButtonInfo(type, meta, isVdp);
    if (info.label) {
      var imageUrl = getImage(info.template);
      var button = {
        type: type,
        href: getLink(info.template, info.path),
        classes: getClasses(info.template, imageUrl),
        style: getStyle(info.template),
        target: getTarget(info.template),
        text: {},
        attributes: { 'data-vin': meta.vin }
      };
      if (shiftAnalytics && window.sd && typeof window.sd.getLinkerUrl === 'function') {
        try {
          button.href = window.sd.getLinkerUrl(button.href) || button.href;
        }
        catch {}
      }
      if (imageUrl) {
        button.imgSrc = imageUrl;
        button.imgAlt = {};
        button.imgAlt[locale] = info.label;
      }
      else {
        button.text[locale] = info.label;
      }
      if (embedded && button.classes.split(' ').indexOf(buttonSelector.replace(/\./, '')) >= 0) {
        button.onclick = openFrame;
      }
      preloadVin(meta.vin, meta.address.postalCode);
      return button;
    }
  };

  var addButtons = function(isVdp) {
    API.insertCallToAction('button', 'payment-calculator', function(meta) {
      return addButton('primary', meta, isVdp);
    });

    API.insertCallToAction('button', 'eprice', function(meta) {
      return addButton('default', meta, isVdp);
    });
  };

  var addImage = function(isUsed, url) {
    API.insert('primary-banner', function(elem, meta) {
      var img = document.createElement('img'),
        a = document.createElement('a');

      img.src = url;

      a.href = expressHost + '/inventory';
      if (isUsed) {
        a.href = a.href + '/used';
      }
      a.innerHTML = img.outerHTML;

      API.append(elem, a);
    });
  };

  var addHomepageHTML = function() {
    API.insert('primary-banner', function(elem, meta) {
      var content = document.createElement('div');
      content.innerHTML = ddcHomepageHtmlTemplate;

      API.append(elem, content);
    });
  }

  var loadScript = function(scriptName) {
    var embedUrl = scriptHost + '/' + scriptName + '?dpid=' + dpid + '&host=' + dealerHost;
    if (rdLocale) { embedUrl = embedUrl + '&locale=' + rdLocale; }
    API.loadJS(embedUrl);

  };

  if (enabled) {
    API.subscribe('page-load-v1', function(ev) {
      var isVdp = ev.payload.detailPage;
      var isUsed = ev.payload.pageName.indexOf('USED') !== -1;
      locale = ev.payload.locale;
      rdLocale = (locale == locales[0]) ? '' : locale.toLowerCase().replace(/_/, '-');

      if (ev.payload.searchPage || ev.payload.detailPage) {
        addButtons(isVdp);
        if (bannerImageUrl) {
          addImage(isUsed, bannerImageUrl);
        }
      } else if (ev.payload.indexPage && ddcHomepageHtmlTemplate) {
        addHomepageHTML();
      }
    });
  }

  if (analytics) {
    loadScript('roadster_dealer_analytics.js');
  }

})(window.DDC.API);
