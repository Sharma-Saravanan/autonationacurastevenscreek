// The functionality in this file is what Epsilon calls the 'Web Service', AKA event65
// The stuff done by our backend team called 'pixall-syndication-epsilon' in GHE is the 'event API' AKA event64

// This controls two web integrations:
// Epsilon PartnerSync Web Service (relates to AutoNation)
// Epsilon PartnerSync Web Service v2: volvo
(async APILoader => {
	const API = await APILoader.create();
	API.log(": Running epsilon-partnersync-web-service");
	const { detailPage } = await API.utils.getPageData();

	const config = await API.utils.getConfig() || {};

	const {
		dtmcid = '',
		dtmcmagic = '',
		dtmfid101 = '',
		dtmfid104 = '',
		dtmfid106 = '',
		dtmfid107 = ''
	} = config;

	let dtmtoken = '';
	let dtmtokensc = '';

	const cookieList = document.cookie.split('; ').map(item => item.split('='));
	const dtmTokenItem = cookieList.find(item => item[0] === 'dtm_token');
	const dtmTokenScItem = cookieList.find(item => item[0] === 'dtm_token_sc');

	dtmtoken = dtmTokenItem ? dtmTokenItem[1] : '';
	dtmtokensc = dtmTokenScItem ? dtmTokenScItem [1] : '';

	const getCookieValue = (name) => (
		document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
	);

	// Once Pixall.getVisitorId() is called this variable will have the cookie
	let pxaIdFromFunction;
	let epsilonNRResult = 'COOKIE_OBTAINED';

	const getVisitorId = new Promise((resolve, reject) => {
		const timeoutMs = 5000; // adjust based on client feedback if it times out too often
		const timeout = setTimeout(() => {
			reject({
				message: `No Pixall visitorId (cookie) found after ${timeoutMs}`,
				name: 'NO_PIXALL_TIMEOUT'
			});
		}, timeoutMs);
		const interval = setInterval(() => {
			try {
				// wait for these things to exist to rule out timing issues
				if(typeof Pixall !== 'undefined' && typeof Pixall.getVisitorId !== 'undefined') {
					clearInterval(interval);
					clearTimeout(timeout);
					resolve(Pixall.getVisitorId());
				}
			} catch(e) {
				reject(e);
			}
		}, 10);
	});

	const getDtmFid = () => {
		const dtmFidList101 = dtmfid101.split(',');
		const dtmFidList104 = dtmfid104.split(',');
		const dtmFidList106 = dtmfid106.split(',');
		const dtmFidList107 = dtmfid107.split(',');
		
		if(dtmFidList104.indexOf(DDC.siteSettings.pageAlias) > -1) {
			return '104';
		}

		if(dtmfid101 === '.*' || dtmFidList101.indexOf(DDC.siteSettings.pageAlias) > -1) {
			return dtmfid101 === '.*' && detailPage ? '104' : '101';
		}

		if(dtmFidList107.indexOf(DDC.siteSettings.pageAlias) > -1) {
			return '107';
		}

		if(dtmfid106 === '.*' || dtmFidList106.indexOf(DDC.siteSettings.pageAlias) > -1) {
			return '106';
		}

		return '';
	};

	try {
		// just for troubleshooting, we don't use this because it isn't always the same as the Pixall page hit visitorId (v)
		// this await though ensures we wait for the Pixall script to have been loaded
		// we could also write something that resolves once window.Pixall is available
		pxaIdFromFunction = await getVisitorId;
	} catch(error) {
		pxaIdFromFunction = 'NO_VISITORID_OBTAINED_FROM_FUNCTION';
		epsilonNRResult = error.name;
		epsilonNRResultMessage = error.message;
		epsilonNRResultStack = error.stack;
		API.log(error.message);
	}

	const abcCookieValue = getCookieValue('abc'); // just for troubleshooting
	const pxaIdCookieValue = getCookieValue('pxa_id') || 'NO_VISITORID_OBTAINED_FROM_COOKIE';
	const dtmCookieId = pxaIdFromFunction;

	const cachebuster = DDC.dataLayer.page.pageViewId;

	const activeParams = [
		`dtm_cid=${dtmcid}`,
		`dtm_cmagic=${dtmcmagic}`,
		`dtm_fid=${getDtmFid()}`,
		`dtm_cookie_id=${dtmCookieId}`,
		`dtmc_loc=${encodeURIComponent(document.location.href)}`,
		`dtm_token=${dtmtoken}`,
		`dtm_token_sc=${dtmtokensc}`,
		`cachebuster=${cachebuster}`
	].filter( param => {
		return !!param.split('=')[1];
	});

	if(window.newrelic) {
		newrelic.addPageAction('epsilonPartnerSyncWebService', {
			abcCookieValue,
			activeParams: activeParams.join('&'),
			cachebuster,
			pxaIdCookieValue,
			pxaIdFromFunction,
			dtmCookieId,
			epsilonParterSyncResult: epsilonNRResult,
			...(typeof epsilonNRResultMessage !== 'undefined' && {epsilonParterSyncResultMessage: epsilonNRResultMessage}),
			...(typeof epsilonNRResultStack !== 'undefined' && {epsilonParterSyncResultStack: epsilonNRResultStack}),
			epsilonPartnerSyncWebServiceVersion: 9 // increment if changing/adding reporting properties so you can query against whatever you just added
		});
	}

	fetch(`https://login.dotomi.com/profile/visit/json/ust/ws?${activeParams.join('&')}`, { credentials: 'include' } )
		.then(function(response) {
			if (response.ok)
				return response.json();
			else
				throw new Error("Could not reach the API: " + response.statusText);
		}).then(function(data) {
		if(data.response_code === 0){
			const referrerLimitedPixels = data.referrer_limited_pixels;
			const otherPixels = data.other_pixels;
			for (const pixelURL of referrerLimitedPixels) {
				var img = new Image(1, 1);
				img.className = 'cnvr-pixel';
				img.style.cssText = 'display:none';
				img.setAttribute('referrerPolicy', 'same-origin');
				img.referrerPolicy = 'same-origin';
				img.src = pixelURL;
				img.alt = '';
			}
			for (const pixelURL of otherPixels) {
				var img = new Image(1, 1);
				img.className = 'cnvr-pixel';
				img.style.cssText = 'display:none';
				img.src = pixelURL;
				img.alt = '';
			}
		} else {
			throw new Error(`: Event API request to Epsilon FAIL : code(${data.response_code}) message(${data.response_message})`);
		}
	}).catch(function(error) {
		API.log(error.message);
	});
})(window.DDC.APILoader);
