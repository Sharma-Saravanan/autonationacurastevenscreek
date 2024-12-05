(async (w,o) => {
	const API = await w.DDC.APILoader.create();
	const {defaultDomain} = await API.utils.getPageData();
	const {orbeeSid} = await API.utils.getConfig();
	const ids = orbeeSid.split(',')
	
	ids.forEach(id => {
		w.orbObject = w.orbObject || o;
		if (!w[o]) {
			w[o] = function() {
				return (w[o].q = w[o].q || []).push(arguments)
			};
			w[o].q = w[o].q || [];
		}
		API.loadJS(`//scripts.orb.ee/tms.js?sid=${id}%3A${defaultDomain.toLowerCase().replace('www.','')}`);
	});

})(window, 'orb');