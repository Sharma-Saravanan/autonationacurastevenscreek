(async (APILoader) => {
	// Note: for this script I try to use the following terms consistantly:
	// A Conversion or Tag refers to the PAIR of both Tag ID and Conversion Label, eg AW-123456/asdfn-awenndd
	// A Tag ID is just the first half of a Conversion or Tag, eg AW-123456
	// A Conversion Label is the second half, eg asdfn-awenndd

	// Define main variables

	const API = await APILoader.create();
	const {
		allPagesConversions,
		confirmPageConversions,
		customDataLayer,
		ddcAdditionalTags,
		pageSpecificTagging,
		srpConversions,
		vdpConversions,
		enhancedConversions
	} = await API.utils.getConfig();

	const urlParams = API.utils.getUrlParams();
	const formEventId = urlParams?.formEventId;

	const { pageName, detailPage, searchPage } = await API.utils.getPageData();
	const currentDataLayer = customDataLayer || 'dataLayer';
	const confirmPage = !!pageName.includes('CONFIRM');

	const allPagesConversionList = [allPagesConversions, ddcAdditionalTags].filter(Boolean).join(',');

	let vin;
	let stockNumber;
	if (detailPage) {
		[{ vin, stockNumber }] = await API.utils.getVehicleData();
	}

	// Initate GTAG function
	window[currentDataLayer] = window[currentDataLayer] || [];
	function gtag() {
		// eslint-disable-next-line prefer-rest-params
		window[currentDataLayer].push(arguments);
	}
	gtag('js', new Date());

	//  ********************************************************   ****************  ********************************************************
	//  ********************************************************   Helper functions  ********************************************************
	//  ********************************************************   ****************  ********************************************************

	function objIsEmpty(obj) {
		if (
			obj &&
			Object.keys(obj).length === 0 &&
			obj.constructor === Object
		) {
			return true;
		}
		return false;
	}

	// removes duplicate values from a list, returns updated list
	function removeDupes(list) {
		const set = new Set(list);
		const newArr = Array.from(set);
		return newArr;
	}

	// input: "AW-1234555, G-1241245/asdfn-aw3enndd, AW-100101010,AW-100101010,AW-100101010"
	// output: ['AW-1234555','G-1241245/asdfn-aw3enndd','AW-100101010']
	// removes duplicate values and spaces, splits on the delimiter, retuns a list
	function cleanData(strList, delim = ',') {
		if (strList.length === 0) {
			return [];
		}
		const arr = strList.replaceAll(' ', '').split(delim); // TODO this might cause issues with phone numbers with spaces (e.g. (333) 444-5555) )
		return removeDupes(arr);
	}

	// Creates object for the conversion event.
	// Creates a list of tag ids and conversion labels for the send_to key. Ex. send_to: "AW-123453231/Itd-DSLonfe933,AW-123453231/SSd-3dfDnfe933"
	// Includes specific data for confirm and details pages.
	function buildConversionEventObj(tags) {
		const eventObj = {};

		eventObj.send_to = tags.toString();
		if (confirmPage) {
			eventObj.transaction_id = formEventId;
		} else if (detailPage) {
			eventObj.dynx_itemid = vin;
			eventObj.dynx_itemid2 = stockNumber;
			eventObj.dynx_pagetype = 'offerDetail';
		}
		return eventObj;
	}

	// cleans data, removes dupes, and returns an organized object with data broken up by data type
	// input:
	// 'AW-123456/asdfn-awenndd,AW-123456/asdfn-awenndd, AW-1233456/asdfn-aw3enndd,
	// AW-12322456/asdfn-aw222enndd,AW-12322456,AW-12322456/asdfn-aw222enndd/555-555-5555'
	//
	// output:
	// {
	// 	"tag0": {
	// 		"tagId": "AW-123456",
	// 		"conversionLabel": "asdfn-awenndd"
	// 	},
	//     ...
	// 	},
	// 	"tag4": {
	// 		"tagId": "AW-12322456",
	// 		"conversionLabel": "asdfn-aw222enndd",
	// 		"phoneNumber": "555-555-5555"
	// 	}
	// }
	function splitData(str) {
		const obj = {};
		if (str === '') {
			return obj;
		}
		const strList = cleanData(str);
		strList.forEach((conversionData, index) => {
			const data = conversionData.split('/');
			obj[`tag${index}`] = {};
			if (data.length === 3) {
				const [tagId, conversionLabel, phoneNumber] = data;
				obj[`tag${index}`].tagId = tagId;
				obj[`tag${index}`].conversionLabel = conversionLabel;
				obj[`tag${index}`].phoneNumber = phoneNumber;
			} else if (data.length === 2) {
				const [tagId, conversionLabel] = data;
				obj[`tag${index}`].tagId = tagId;
				obj[`tag${index}`].conversionLabel = conversionLabel;
			} else if (data.length === 1) {
				const [tagId] = data;
				obj[`tag${index}`].tagId = tagId;
			} else {
				API.log(
					`Invalid converison data: ${conversionData} should always contain between 1 and 3
					values of the form TAG_ID/CONVERSION_LABEL/PHONE_NUMBER.`
				);
			}
		});

		return obj;
	}

	// Gets list of all tagIds from tagData object
	// input: {"confirmPages":{"tag0":{"tagId":"AW-123456","conversionLabel":"asdfn-awenndd"}},
	// 		   "CUSTOM_PAGE":{"tag1":{"tagId":"AW-12322456","conversionLabel":"asdfn-aw222enndd","phoneNumber":"555-555-5555"}}}
	// output: ["AW-123456", "AW-12322456"]
	function fullTagList(tagData) {
		const tagList = [];
		Object.keys(tagData).forEach((page) => {
			Object.keys(tagData[page]).forEach((tag) => {
				tagList.push(tagData[page][tag]?.tagId);
			});
		});
		return removeDupes(tagList);
	}

	// Formats tagId and conversionLabel from sendToData.conversionEvent list
	// input: [{tagId: 'AW-22222', conversionLabel: '22222-awenndd'},{tagId: 'AW-123456', conversionLabel: 'asdfn-awenndd'}]
	// output: ['AW-22222/22222-awenndd','AW-123456/asdfn-awenndd']
	function buildTagIdLabel(tagList) {
		const fullTags = [];
		tagList.forEach((tagObj) => {
			if (tagObj.tagId && tagObj.conversionLabel) {
				fullTags.push(`${tagObj.tagId}/${tagObj.conversionLabel}`);
			}
		});
		return removeDupes(fullTags);
	}
	// takes the tagData object and distributes values across the dataToSend object appropriately
	// input: {"tag0":{"tagId":"AW-12322456","conversionLabel":"asdfn-aw222enndd","phoneNumber":"555-555-5555"},
	// 		   "tag1":{"tagId":"AW-8888888","conversionLabel":"asdfn-aw222enndd"}}
	// ouput: Updates dataToSend with appropriate values
	function distributeData(tagObjs, dataToSend) {
		Object.keys(tagObjs).forEach((tag) => {
			if (tagObjs[tag]?.conversionLabel && tagObjs[tag]?.phoneNumber) {
				dataToSend.configWithPhone.push(tagObjs[tag]);
			}
			if (tagObjs[tag]?.conversionLabel) {
				dataToSend.conversionEvent.push(tagObjs[tag]);
			}
		});
	}

	// Creates initial tagData object, page Aliases from pageSpecificTagging gets added later
	function buildConfigObj() {
		const tagData = {
			allPagesTags: splitData(allPagesConversionList),
			confirmPageTags: splitData(confirmPageConversions),
			vdpTags: splitData(vdpConversions),
			srpTags: splitData(srpConversions),
		};
		return tagData;
	}

	function loadGtagScript(tags) {
		// only fires for the first tag, the subsequent scripts will be fired by the gtag('config') events
		if (tags?.length > 0) {
			const firstTag = tags[0];
			API.loadJS(
				`https://www.googletagmanager.com/gtag/js?id=${firstTag}&l=${currentDataLayer}`
			);
		}
	}

	function fireDefaultConfig(tagIds) {
		tagIds.forEach((tagId) => {
			if (enhancedConversions) gtag('config', tagId, {'allow_enhanced_conversions': true});
			else gtag('config', tagId);
		});
	}

	function fireConversionEvent(tagObjs) {
		const tagStrs = buildTagIdLabel(tagObjs);
		const conversionObj = buildConversionEventObj(tagStrs);
		gtag('event', 'conversion', conversionObj);
	}

	function firePhoneConfig(tagObjs) {
		const firedTags = [];
		tagObjs.forEach((tag) => {
			const { tagId, conversionLabel, phoneNumber } = tag;
			const strVersion = `${tagId}${conversionLabel}${phoneNumber}`;
			// ensures same tag isn't fired twice
			if (!firedTags.includes(strVersion)) {
				gtag(
					'config',
					`${tagId}${conversionLabel ? `/${conversionLabel}` : ''}`,
					{
						phone_conversion_number: phoneNumber,
					}
				);
			}
			firedTags.push(strVersion);
		});
	}

	// US920673 - implemented for ws-tagging ga4
	// Adds window objects for ga4
	function addGa4(tagList) {
		const measurementIds = [];
		tagList.forEach((tagId) => {
			if (tagId.startsWith('G-')) {
				measurementIds.push(tagId);
			}
		});
		window.asc_datalayer = window.asc_datalayer || {};
		window.asc_datalayer.measurement_ids =
			window.asc_datalayer.measurement_ids || [];
		window.asc_datalayer.measurement_ids = [
			...window.asc_datalayer.measurement_ids,
			...measurementIds,
		];
		window.dispatchEvent(new CustomEvent('googleAdwordsConversionIdsReady', {detail: measurementIds}));
	}

	//  ********************************************************   ********************   ********************************************************
	//  ********************************************************   Helper functions end   ********************************************************
	//  ********************************************************   ********************   ********************************************************

	// keeps track of the different tags that need to be fired based on the current page
	// Examples of how this data will be used:
	// defaultConfig:   gtag('config', 'AW-11274515166');
	// conversionEvent: gtag('event', 'conversion', {'send_to': 'AW-11274515166/Of10CPuQv9YYEN7ljYAq'});
	// configWithPhone: gtag('config', 'AW-11274515166/juWsCNvlvtYYEN7ljYAq', {'phone_conversion_number': '(866) 933-3723'});
	const dataToSend = {
		defaultConfig: [], // ex: ['G-1233333','AW-1231231','UA-1231223']
		conversionEvent: [], // ex: [{tagId: 'AW-22222', conversionLabel: '22222-awenndd'}, ...]
		configWithPhone: [], // ex: [{tagId: 'AW-22222', conversionLabel: '22222-awenndd', phoneNumber : '555-555-5555'}, ...]
	};

	// creates JSON style object with pageSets or page Alias as top level keys
	// ex: {allPages: {tag0: {tagId:'AW-12233', conversionLabel:'asdddfaasdf'}, ... }, ...}
	const tagData = buildConfigObj();

	// If page specific logic is present break up data by page alias and add it to the tagData obj
	if (pageSpecificTagging) {
		const localPageData = cleanData(pageSpecificTagging, '|');
		localPageData.forEach((pageData) => {
			let pageAlias = '';
			let dataStr = '';
			[pageAlias, dataStr] = pageData.split(':');
			tagData[pageAlias] = splitData(dataStr);
		});
	}

	const onlyTags = fullTagList(tagData); // creates list of all tags in all configs
	dataToSend.defaultConfig.push(...onlyTags); // Every tag Id should have a default config event on all pages

	Object.keys(tagData).forEach((pageSet) => {
		// checks if current page has page specific data to load
		if (pageSet === pageName) {
			distributeData(tagData[pageSet], dataToSend);
		} else if (
			pageSet === 'allPagesTags' &&
			!objIsEmpty(tagData[pageSet])
		) {
			distributeData(tagData[pageSet], dataToSend);
		} else if (
			pageSet === 'confirmPageTags' &&
			confirmPage &&
			!objIsEmpty(tagData[pageSet])
		) {
			distributeData(tagData[pageSet], dataToSend);
		} else if (
			pageSet === 'vdpTags' &&
			detailPage &&
			!objIsEmpty(tagData[pageSet])
		) {
			distributeData(tagData[pageSet], dataToSend);
		} else if (
			pageSet === 'srpTags' &&
			searchPage &&
			!objIsEmpty(tagData[pageSet])
		) {
			distributeData(tagData[pageSet], dataToSend);
		}
	});

	// At this point the dataToSend object should have all relavant data for the page

	if (dataToSend.defaultConfig.length > 0) {
		const cleanedList = removeDupes(dataToSend.defaultConfig);
		loadGtagScript(cleanedList);
		fireDefaultConfig(cleanedList);
		addGa4(cleanedList);
	}

	if (dataToSend.conversionEvent.length > 0) {
		fireConversionEvent(dataToSend.conversionEvent);
	}

	if (dataToSend.configWithPhone.length > 0) {
		firePhoneConfig(dataToSend.configWithPhone);
	}

	if(enhancedConversions && confirmPage) {
		const hashedPhone = window.DDC.dataLayer?.confirmation?.phone || ''
		const hashedEmailLowerCase = window.DDC.dataLayer?.confirmation?.emailLowerCase || ''
		const userData = {}
		if (hashedEmailLowerCase) { // Phone number must be provided in conjunction with email, or full name and address
			userData.sha256_email_address = hashedEmailLowerCase;
			if (hashedPhone) userData.sha256_phone_number = hashedPhone;
			gtag('set', 'user_data', userData);
		}
	}
})(window.DDC.APILoader);
