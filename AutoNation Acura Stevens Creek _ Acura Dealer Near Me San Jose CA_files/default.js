
if(!autonationTealiumProperties.utagOnly) {
	var utag_data = {};

	utag_data = (function (props, dl) {
		var utag_data = {}, // return this at the end of the IFFY

			// map over properties passed in from default.vm
			env = props.env,
			type = props.type,
			enableUtag = props.enableUtag,
			enableEventTesting = props.enableEventTesting,
			searchTerm = props.searchTerm,
			labels = props.labels,
			messages = props.messages,

			// helper functions
			isNoResultsPage = dl.page.pageInfo.pageName.indexOf('INVENTORY_LISTING_NO_RESULTS_AUTO') > -1,
			is404Page = dl.page.pageInfo.pageName.indexOf('404') > -1,

			page_load_time = new Date().getTime(),
			last_page_load_time;

		if ($.cookie('autonationTealium.pageLoadTime') === null) {
			$.cookie('autonationTealium.pageLoadTime', page_load_time, {path: '/'});
		}
		var time = {
			last_page_load_time: ($.cookie('autonationTealium.pageLoadTime') || page_load_time)
		}
		$.cookie('autonationTealium.pageLoadTime', page_load_time, {path: '/'});

		// map of errors that our sites can output
		// the numbers 1,2, etc. are arbitrary, Tealium needs a system to number the errors
		var errorMap = {
				'1': {
					logic: isNoResultsPage,
					messages: [labels.SORRY_NO_ITEMS_MATCHING_YOUR_REQUEST_WERE_FOUND],
					types: ['No Matching Results'],
					// utag_data: ['no_result:1']
				},
				'2': {
					logic: is404Page,
					messages: [
						labels['THIS_PAGE_IS_IN_THE_SHOP'],
						messages['404_VERBIAGE']
					],
					types: ['404 - Page Does Not Exist']
				}
			},

			// set an error based on the 'error' passed
			// 'error' should be one of the errors in errorMap
			setError = function (error) {
				var errorObject = errorMap[error];

				utag_data['error'] = [error];
				utag_data['error_message'] = errorObject.messages;
				utag_data['error_type'] = errorObject.types;

				// if we need to pass any other data with errors we can use this
				// see above for no_result:1
				// if(errorMap.utag_data) {
				// 	for(data in errorMap.utag_data) {
				// 		var item = errorMap.utag_data[data].split(':'),
				// 			key = item[0],
				// 			value = item[1];

				// 		utag_data[key] = value;
				// 	}
				// }
			},

			// go through all the errors in errorMap and if they match their associated logic set the rror
			setErrors = function () {
				var map = errorMap;

				for (error in map) {
					if (map[error].logic) {
						setError(error);
					}
				}
			},

			// test for a string to be empty, null, undefined, or 0
			vExists = function (str) {
				return str === undefined || str === null || str === '' || str === 0;
			},

			// get the elapsed time for the previous page
			getLastPageElapsedTime = function () {
				return (page_load_time - time.last_page_load_time);
			},

			// writes out utag categories
			writeCategories = function (setKeyArray) {
				utag_data['category_l1'] = setKeyArray[0] || '';
				utag_data['category_l2'] = setKeyArray[1] || '';
				utag_data['category_l3'] = setKeyArray[2] || '';
				utag_data['category_l4'] = setKeyArray[3] || '';
			},

			setCategories = function () {
				var paths = categories.paths,
					aliases = categories.aliases,
					sets = categorySets,
					currentPath = dl.page.pageInfo.pagePath,
					currentAlias = dl.page.pageInfo.pageName,
					setKey = paths[currentPath] || aliases[currentAlias],
					rules = categories.rules;

				if (sets[setKey]) {
					var setKeyArray = sets[setKey].split('|');
					writeCategories(setKeyArray);
				}

				// some pages (such as custom listing pages) do not have category associated with path or alias
				// looking through 'rules' for matching categories
				for (rule in rules) {
					var logic = rules[rule].logic;

					if (rules[rule].logic) {
						var category = rules[rule].category,
							setKeyArray = categorySets[category].split('|');
						writeCategories(setKeyArray);
					}
				}
			},

			// check if the page has a form that submits to /form/confirm.htm
			pageHasForm = function () {
				var forms = $('form'),
					foundForm = false;

				forms.each(function () {
					var action = $(this).attr('action');

					if (action && action.indexOf('/form/confirm.htm') > -1) {
						foundForm = true;
					}
				});

				return foundForm;
			},

			getQueryFacet = function (queryFacets, facet) {
				if (queryFacets !== undefined) {
					return queryFacets[facet] || '(not set)';
				}

				return '(not set)';
			};

		if (enableUtag) {
			categorySets = {
				'about': 'About Us|Other',
				'about-directions': 'home|SDP',
				'custom-model-detail': 'Research|PDP|Other',
				'custom-model-detail-lineup': 'Research|PDP|Model Lineup',
				'directions': 'Research|Find a Store|Directions',
				'error': 'Error',
				'finance-application': 'Finance|Application',
				'finance-calculator': 'Finance|Calculator',
				'finance-other': 'Finance|Other',
				'form-fill': 'Form|Fill',
				'form-submission': 'Form|Submission',
				'home': 'Home',
				'home-mlp': 'Home|MLP',
				'noresults': 'SRP|||',
				'sdp': 'Home|SDP',
				'service-repair': 'Service and Repair',
				'service-repair-parts-appointment': 'Service and Repair|Service|Appointment',
				'service-repair-parts-other': 'Service and Repair|Parts|Other',
				'service-repair-parts-specials': 'Service and Repair|Parts|Specials',
				'service-repair-service-other': 'Service and Repair|Service|Other',
				'service-repair-service-specials': 'Service and Repair|Service|Specials',
				'showroom': 'Research|PDP|Model Lineup',
				'showroom-detail': 'Research|PDP',
				'specials-offers': 'SpecialsOffers',
				'specials-offers-incentives': 'SpecialsOffers|Incentives',
				'srp': 'SRP',
				'vdp': 'VDP'
			}
			categories = {
				'paths': {
					'/about-us.htm': 'sdp',
					'/calculator/payment.htm': 'finance-calculator',
					'/carfinder/index.htm': 'form-fill',
					'/contact.htm': 'form-fill',
					'/dealership/about.htm': 'about-directions',
					'/dealership/directions.htm': 'about-directions',
					'/featured-vehicles/new.htm': 'specials-offers',
					'/FinancePreQualForm.htm': 'finance-application',
					'/financing/index.htm': 'finance-other',
					'/form/confirm.htm': 'form-submission',
					'/parts/contact-form.htm': 'service-repair-parts-other',
					'/parts/index.htm': 'service-repair-parts-other',
					'/privacy.htm': 'about',
					'/schedule-service-appointment.htm': 'service-repair-parts-appointment',
					'/service-menu.htm': 'service-repair-service-other',
					'/service/contact-form.htm': 'service-repair-parts-appointment',
					'/service/index.htm': 'service-repair',
					'/service/smart.htm': 'service-repair',
					'/ServiceApptForm.htm': 'service-repair-parts-appointment',
					'/sitemap.htm': 'about',
					'/smartcare.htm': 'home-mlp',
					'/specials/index.htm': 'specials-offers',
					'/specials/new.htm': 'specials-offers',
					'/specials/parts.htm': 'service-repair-parts-specials',
					'/specials/service.htm': 'service-repair-service-specials',
					'/specials/used.htm': 'specials-offers',
					'/tire-finder.htm': 'service-repair-parts-other',
					'/global-incentives/index.htm': 'specials-offers-incentives',
					'/all-new-2016-nissan-maxima-four-door-sports-car-price-msrp.htm': 'custom-model-detail',
					'/2016-nissan-titan-xd-detroit-auto-show.htm': 'custom-model-detail',
					'/nissan-reviews-future-models.htm': 'custom-model-detail',
					'/research/2016-nissan-model-details-information-specifications-autonation-nissan-southwest.htm': 'custom-model-detail-lineup',
					'/featured-vehicles/pre-owned.htm': 'specials-offers',
					'/carfinder/index.htm': 'form-fill',
					'/quickquote/index.htm': 'form-fill'
				},
				'aliases': {
					'404': 'error',
					'AUTO_BARGAIN_DETAILS': 'vdp',
					'AUTO_CERTIFIED_USED_DETAILS': 'vdp',
					'AUTO_NEW_DETAILS': 'vdp',
					'AUTO_USED_DETAILS': 'vdp',
					'INCENTIVES_SEARCH_DEFAULT': 'specials-offers',
					'INDEX': 'home',
					'INVENTORY_COMPARE_DEFAULT_AUTO': 'srp',
					'INVENTORY_FEATURED': 'srp',
					'INVENTORY_LISTING_DEFAULT_AUTO': 'srp',
					'INVENTORY_LISTING_NO_RESULTS_AUTO': 'noresults',
					'MYCARS_FAVORITES': 'srp',
					'SHOWROOM': 'showroom'
				},
				'rules': [
					{
						logic: dl.page.pageInfo.isVlp,
						category: 'srp'
					},
					{
						logic: new RegExp("\/showroom\/(?!index\.htm)").exec(dl.page.pageInfo.pagePath) !== null,
						category: 'showroom-detail'
					}
				]
			}

			// all pages
			// anything blank will be populated by Tealium
			var utag_data = {
				adwords_efd: '',
				browse_sequence: '',
				category_l1: '(not set)',
				category_l2: '',
				category_l3: '',
				category_l4: '',
				client_timezone: 'UTC ' + moment(dl.date.currentTime).tz('America/New_York').format('Z'),
				communication_id: '',
				contact_us_phone: dl.dealership.phone1 || '(not set)',
				cookie_id: '',
				cookies_enabled: '' + navigator.cookieEnabled,
				device_category: '',
				display_dimension_height: '',
				display_dimension_width: '',
				dma: '',
				eif: '',
				environment: '',
				error: [],
				error_message: [],
				error_type: '',
				event: '',
				first_utm_campaign: '',
				first_utm_content: '',
				first_utm_date: '',
				first_utm_medium: '',
				first_utm_source: '',
				first_utm_term: '',
				form_actual_name: '(not set)',
				form_factor: '',
				form_name: '(not set)',
				ga_account_id: '',
				gclid: '',
				host_name: '',
				inventory_type: '(not set)',
				ip_address: '(not set)',
				javascript_enabled: 'true',
				latitude: dl.user.userLatitude,
				lead_store_name: '(not set)',
				longitude: dl.user.userLongitude,
				manufacturer: '',
				market_path: '',
				page_id: dl.page.pageInfo.pagePath.split('/').pop(),
				page_language: dl.page.attributes.locale.charAt(0).toUpperCase() + dl.page.attributes.locale.charAt(1) || '(not set)',
				page_load_time: '', // need to figure this out
				page_name: '',
				path_name: '',
				pixel_names_ids: [],
				platform: '',
				returning_utm_campaign: '',
				returning_utm_content: '',
				returning_utm_date: '',
				returning_utm_medium: '',
				returning_utm_source: '',
				returning_utm_term: '',
				session_id: '',
				site_channel: '',
				site_vendor: '',
				time_elapsed: '' + getLastPageElapsedTime(),
				timestamp: '',
				vendor_lead_id: '', // not sure about this yet, formEventId might be something we can pass
				vin: '(not set)',
				visitor_type: '',
				wtk: '',
				zipcode: dl.user.userPostalCode
			};

			setErrors();
			setCategories();

			utag_data['results_per_page'] = dl.page.attributes.vehicleResultCount < dl.page.attributes.vehicleCountPerPage ? dl.page.attributes.vehicleResultCount : dl.page.attributes.vehicleCountPerPage;
			utag_data['results_page'] = dl.page.attributes.vehicleCurrentPage || '';
			utag_data['vehicle_results_count'] = dl.page.attributes.vehicleResultCount || '';

			if (dl.page.attributes.vehicleResultCount && !isNoResultsPage) {
				// vlp impression data
				var ids = [],
					names = [],
					brands = [],
					prices = [],
					positions = [],
					lists = [],
					colors = [],
					conditions = [];

				for (var i = 0; i < dl.vehicles.length; i++) {
					var item = dl.vehicles[i];
					ids.push(item.vin);
					names.push(item.modelYear + ' ' + item.make + ' ' + item.model + ' ' + item.bodyStyle + ' ' + item.trim);
					brands.push(item.make);
					prices.push(item.newOrUsed == 'new' ? item.msrp : item.internetPrice);
					colors.push(item.exteriorColor);
					positions.push('' + i);
					if (item.newOrUsed == 'new') {
						conditions.push('new');
					}
					else if (item.certified) {
						conditions.push('certified');
					}
					else {
						conditions.push('used');
					}
					lists.push('SRP');
				}
				utag_data['enh_impression_id'] = ids;
				utag_data['enh_impression_name'] = names;
				utag_data['enh_impression_brand'] = brands;
				utag_data['enh_impression_price'] = prices;
				utag_data['enh_impression_list'] = lists; // not sure what this is
				utag_data['enh_impression_position'] = positions;
				utag_data['enh_vehic_variant'] = colors;
				utag_data['enh_vehic_condition'] = conditions;

				utag_data['enh_vehic_list'] = utag_data['enh_impression_list'];
				utag_data['enh_vehic_position'] = utag_data['enh_impression_position'];
				// utag_data['enh_vehic_id'] = utag_data['enh_impression_id'];
				// utag_data['enh_vehic_name'] = utag_data['enh_impression_name'];
				// utag_data['enh_vehic_price'] = utag_data['enh_impression_price'];
				// utag_data['enh_vehic_brand'] = utag_data['enh_impression_brand'];
			}

			if (dl.page.pageInfo.isVlp) {
				var queryFacets = dl.page.queryFacets;

				utag_data['searches_views'] = '1';
				utag_data['sorted_by'] = dl.page.attributes.vehicleListingPageSort || '(not set)';
				utag_data['search_radius'] = getQueryFacet(queryFacets, 'geoRadius');
				utag_data['search_zip'] = getQueryFacet(queryFacets, 'geoZip');

				var queryFacet = getQueryFacet(queryFacets, 'compositeType');
				utag_data['search_condition'] = queryFacet === 'certified' ? 'cpo' : queryFacet;

				var queryFacet = getQueryFacet(queryFacets, 'odometer');
				utag_data['search_mileage_min'] = queryFacet !== '(not set)' ? queryFacet.split('-')[0] : '(not set)';
				utag_data['search_mileage_max'] = queryFacet !== '(not set)' ? queryFacet.split('-')[1] : '(not set)';

				utag_data['search_make'] = getQueryFacet(queryFacets, 'make');
				utag_data['search_make_year'] = getQueryFacet(queryFacets, 'year');
				utag_data['search_model'] = getQueryFacet(queryFacets, 'model');
				utag_data['search_bodystyle'] = getQueryFacet(queryFacets, 'bodyStyle');

				var queryFacet = getQueryFacet(queryFacets, 'gvOption');
				utag_data['search_features'] = queryFacet ? queryFacet.replace(/,/g, '|') : '(not set)';

				utag_data['search_price'] = getQueryFacet(queryFacets, 'internetPrice');
				utag_data['search_mpg'] = getQueryFacet(queryFacets, 'highwayFuelEconomy');
				utag_data['search_fueltype'] = getQueryFacet(queryFacets, 'normalFuelType');
				utag_data['search_transmission'] = getQueryFacet(queryFacets, 'normalTransmission');
				utag_data['search_drivetrain'] = getQueryFacet(queryFacets, 'normalDriveLine');
				utag_data['search_engines'] = getQueryFacet(queryFacets, 'engine');
				utag_data['search_exteriorcolor'] = getQueryFacet(queryFacets, 'normalExteriorColor');
				utag_data['search_keywords'] = getQueryFacet(queryFacets, 'search');

				utag_data['special_type'] = ''; // only applicable when search from special (email, link etc), not sure how this applies to VLP
				// need to look at URL parameters from specials going to the VLP

				utag_data['merchandising_id'] = ['']; // only applicable when search from special (email, link etc), see above
				// this for a specials page?

				utag_data['number_content_result'] = dl.page.attributes.vehicleResultCount;
			}

			if ((dl.page.queryFacets && dl.page.queryFacets.search) || searchTerm) {
				utag_data['site_search_term'] = dl.page.queryFacets.search || searchTerm;
			}

			if (dl.page.pageInfo.isVdp) {
				var vehicle = dl.vehicles[0];

				utag_data['enh_action'] = "detail"; // not sure what this is, or what it's for, does it change?
				utag_data['enh_vehic_id'] = [vehicle.vin]; // what is this vs. just vin???
				utag_data['enh_vehic_name'] = [vehicle.modelYear + ' ' + vehicle.make + ' ' + vehicle.model + ' ' + vehicle.bodyStyle + ' ' + vehicle.trim];
				utag_data['enh_vehic_price'] = [vehicle.newOrUsed == 'new' ? vehicle.msrp : vehicle.internetPrice]; // need to implement the price
				utag_data['enh_brand_name'] = [vehicle.make];
				utag_data['vin'] = vehicle.vin || '(not set)';
				utag_data['inventory_type'] = vehicle.inventoryType || '(not set)'; // what is the difference between this and condition?
				utag_data['condition'] = vehicle.inventoryType;
				utag_data['inventory_status'] = vehicle.status; // need to add this to data layer
				utag_data['enh_vehic_variant'] = [vehicle.exteriorColor];
				if (vehicle.inventoryType == 'new') {
					utag_data['enh_vehic_condition'] = ['new'];
				}
				else if (vehicle.certified) {
					utag_data['enh_vehic_condition'] = ['certified'];
				}
				else {
					utag_data['enh_vehic_condition'] = ['used'];
				}

				var anPricing = dl.anPricing || {
						price_msrp: '',
						price_invoice: '',
						price_manuf_incentive: '',
						price_an_savings: '',
						price_msrp_less_savings: '',
						price_other_specials: '',
						price_autonation: '',
						price_with_available_incentives: '',
						dealer_fee: ''
					}
				utag_data['price_msrp'] = anPricing.price_msrp || '';
				utag_data['price_invoice'] = anPricing.price_invoice || '';
				utag_data['price_manuf_incentive'] = anPricing.price_manuf_incentive || '';
				utag_data['price_an_savings'] = anPricing.price_an_savings || '';
				utag_data['price_msrp_less_savings'] = anPricing.price_msrp_less_savings || '';
				utag_data['price_other_specials'] = anPricing.price_other_specials || '';
				utag_data['price_autonation'] = anPricing.price_autonation || '';
				utag_data['price_with_available_incentives'] = anPricing.price_with_available_incentives || '';
				utag_data['dealer_fee'] = anPricing.dealer_fee || '';
				utag_data['make'] = dl.vehicles[0].make;
				utag_data['model'] = dl.vehicles[0].model;
				utag_data['trim'] = dl.vehicles[0].trim;
				utag_data['make_yr'] = dl.vehicles[0].modelYear;
				utag_data['mileage'] = dl.vehicles[0].odometer;
				utag_data['vdp_views'] = '1';
				utag_data['vdp_new_views'] = dl.vehicles[0].newOrUsed === 'new' ? '1' : '';
				utag_data['vdp_used_views'] = dl.vehicles[0].newOrUsed === 'used' ? '1' : '';
			}

			if (dl.page.pageInfo.isConfirm) {
				utag_data['event'] = 'Form Submit';
				utag_data['form_name'] = 'Form - Lead';
				utag_data['form_actual_name'] = dl.confirmation.formTitle; // Need to fix the velocity that gets this value to somehow pass the form title
				utag_data['form_start_source'] = dl.site.siteInfo.domain;
				utag_data['lead_first_name'] = ''; // under discussion w/ DDC folks
				utag_data['lead_last_name'] = ''; // under discussion w/ DDC folks
				utag_data['lead_email'] = ''; // under discussion w/ DDC folks
				utag_data['lead_phone'] = ''; // under discussion w/ DDC folks
				utag_data['lead_contact_method'] = dl.confirmation.preferredContact; // needs to be added to data layer
				utag_data['lead_cust_zip'] = ''; // under discussion w/ DDC folks
				utag_data['lead_vin'] = dl.confirmation.vin || '(not set)';
				utag_data['lead_inv_type'] = dl.confirmation.status;
				utag_data['lead_make'] = dl.confirmation.make;
				utag_data['lead_make_yr'] = dl.confirmation.year;
				utag_data['lead_make_model'] = dl.confirmation.model;
				utag_data['lead_hyperion'] = ''; // just the hyperion id in the third party tool? not sure what this is
				utag_data['lead_store_name'] = dl.confirmation.accountName || '(not set)';
				utag_data['lead_provider_id'] = ''; // not sure we have something for this yet
				utag_data['lead_reservation_id'] = ''; // not sure this is necessary
				utag_data['lead_appt_date'] = dl.confirmation.apptTime;  // needs to be added to data layer if we have this
				utag_data['lead_tradein_vin'] = dl.confirmation.tradeinVin; // needs to be added to data layer
				utag_data['lead_tradein_make'] = dl.confirmation.tradeinMake; // needs to be added to data layer
				utag_data['lead_tradein_model'] = dl.confirmation.tradeinModel; // needs to be added to data layer
				utag_data['lead_tradein_year'] = dl.confirmation.tradeinYear; // needs to be added to data layer
				utag_data['lead_tradein_range_quote'] = '';  // needs to be added to data layer if we have it
				utag_data['lead_tradein_value_certificate'] = ''; // don't believe we do anything like this
				utag_data['lead_submission'] = "1";  // on load of successful lead submission page
			}


			if ($.inArray("v9.widgets.directions.results.v1", dl.page.pageInfo.pageWidgets) !== -1) {
				var find_location_count = 1;
			}

			if (dl.page.attributes.specialsCategory) {
				utag_data['special_type'] = dl.page.attributes.specialsCategory;
			}

			if (isNoResultsPage) {
				utag_data['no_result'] = '1';
				utag_data['number_content_result'] = '0';
			}

			utag_data['form_load_page1'] = pageHasForm() ? '1' : '';
		}

		return utag_data;
	})(autonationTealiumProperties, window.DDC.dataLayer);
}
// var noEvents = true; // turns off events in TealiumiQA where event code is hosted, allows us to use eventTesting below

(function(a,b,c,d){
a='//tags.tiqcdn.com/utag/autonation/' + autonationTealiumProperties.type + '/' + autonationTealiumProperties.env + '/utag.js';
// a='/sites/a/autonationnissansouthwest2/components/utag.js';
b=document;c='script';d=b.createElement(c);d.src=a;d.type='text/java'+c;d.async=true;
a=b.getElementsByTagName(c)[0];a.parentNode.insertBefore(d,a);
})();