(function rda() {
  if (window.roadsterAnalyticsVersion == 1) {return;}
  window.roadsterAnalyticsVersion = 1;
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    (function(i,s,o,g,r,a,m){i['GoogleAnalytics4Object']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.googletagmanager.com/gtag/js?id=G-LVZE3KRGN0','ga4');

  var uu, agent, agentEmail, customer, referrer, landing, instore, inShowroom;
  try {
    var user_values = JSON.parse(decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)rd_user\s*\=\s*([^;]*).*$)|^.*$/, "$1")));
    uu = user_values.distinct_id;
  }
  catch(err) {
    uu = document.cookie.replace(/(?:(?:^|.*;\s*)rda_uu\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  }
  finally {
    if (!uu) {
      uu = 'rdu' + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 8);
      var now = new Date();
      var future = new Date(now.getFullYear() + 1, now.getMonth(), 1);
      var hostName = window.location.hostname;
      var domain = hostName.substring(hostName.lastIndexOf(".", hostName.lastIndexOf(".") - 1) + 1);
      if (domain && domain.startsWith('com.')) {
        // When .com is not the last in the domain name (i.e. .com.pe)
        domain = hostName.substring(hostName.lastIndexOf(".", hostName.lastIndexOf(".com") - 1) + 1);
      }
      document.cookie = 'rda_uu=' + uu + '; expires=' + future.toUTCString() + '; domain=' + domain;
    }
  }

  try {
    var analytics_values = JSON.parse(decodeURIComponent(document.cookie.replace(/(?:(?:^|.*;\s*)rd_analytics\s*\=\s*([^;]*).*$)|^.*$/, "$1")));
    agent =       analytics_values.agent        || '--NOT-SET--';
    // agentEmail =  analytics_values.agentEmail   || '--NOT-SET--';
    customer =    '--NOT-SET--';
    landing =     analytics_values.landing      || '--NOT-SET--';
    referrer =    analytics_values.referrer == null ? '--NOT-SET--' : analytics_values.referrer;   // Can be '' (blank)
    instore =     analytics_values.instore      || false;
    inShowroom =  analytics_values.inShowroom   || false;
  }
  catch(err) {
    agent       = '--NOT-SET--';
    // agentEmail  = '--NOT-SET--';
    customer    = '--NOT-SET--';
    landing     = '--NOT-SET--';
    referrer    = '--NOT-SET--';
    instore     = false;
    inShowroom  = false;
  }

  var locale = 'en-us' || '--NOT-SET--';

  var generatedTime = '2024-12-05 04:56:44 +0000'

  var siteAllCrossDomains = 'autonationacurastevenscreek.com,autonationacurastevenscreek.autonation.com';
  var siteAllCrossDomainsList = siteAllCrossDomains ? siteAllCrossDomains.split(',') : '';

  var gaCrossDomainReferrer =  _rdGetCrossDomainReferrer(siteAllCrossDomainsList);
  var rdSessionId = _rdGetSessionId();

  // New roadster GA2 account


  var rdGAIds = [];
      rdGAIds.push('UA-48510706-12');

    rdGAIds.push('UA-48510706-4');

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'R-pageview',
      'roadster_dpid' : 'autonationacurastevenscreek', // Kept for backward compatibility
      'dpid' : 'autonationacurastevenscreek',
      'distinct_id': uu,
      'property': 'dealer',
      'pageName': 'Dealer Page',
      'agent_uid': agent,
      // 'agent_email': agentEmail,
      'cust_uid': customer,
      'in_store': instore,
      'in_showroom': inShowroom,
      'embedded': false,
      'referrer': referrer,
      'landing': landing,
      'rd_gaid': 'UA-48510706-12',
      'rd_ga_ids': rdGAIds,
      'rd_ga_via_gtm_mode': true,
      'rd_page_context': '--NOT-SET--',
      'rd_session_id': rdSessionId,
      'site_dealer': 'www.autonationacurastevenscreek.com',
      'site_express': 'autonationacurastevenscreek.autonation.com',
      'site_all_cross_domains': siteAllCrossDomains,
      'locale': locale,
      'timestamp_utc': '2024-12-05 04:56:44 UTC',
      'timestamp_local': '2024-12-04 20:56:44 -0800',
      'rd_original_location': document.location.protocol + '//' + document.location.hostname + document.location.pathname + document.location.search,
      'shift_retailer_id': '',
    });

    // enable GA4 events + cross domain links (_gl query param)
      function gtag(){window.dataLayer.push(arguments);}
      gtag('set', 'linker', {'domains': ['autonationacurastevenscreek.autonation.com']});
      gtag('js', new Date());
        gtag('config', 'G-LVZE3KRGN0', { 'send_page_view': false });
        gtag('config', 'G-GY7P36ESTT', { 'send_page_view': false, 'groups': 'roadster' });
    
    // Google Tag Manager
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-P8QBWVM');
    // End Google Tag Manager


  function _rdGetCrossDomainReferrer(websiteHosts) {
    var docReferrer = document.referrer;
    var hname = new RegExp('https?://([^/:]+)').exec(docReferrer);
    if (hname && websiteHosts) {
      for (var i = websiteHosts.length; i--;) {
        if (websiteHosts[i]) {
          var websiteHost = websiteHosts[i];
          if (new RegExp(websiteHost + '$').test(hname[1])) {
            return null;
          }
        }
      }
    }
    return docReferrer == '' ? null : docReferrer;
  }

  // From: https://www.simoahava.com/analytics/improve-data-collection-with-four-custom-dimensions/#3-session-id
  function _rdGetGAClientId(gaId) {
    if (window.ga) {
      try {
        let trackers = window.ga.getAll();
        let ii, len;
        for (ii = 0, len = trackers.length; ii < len; ii += 1) {
          if (trackers[ii].get('trackingId') === gaId) {
            return trackers[ii].get('clientId');
          }
        }
        return '';
      }
      catch(e) {
        return '';
      }
    }
    return '';
  }

  function _rdGetSessionId() {
    return new Date().getTime() + '.' + Math.random().toString(36).substring(5);
  }

})();
