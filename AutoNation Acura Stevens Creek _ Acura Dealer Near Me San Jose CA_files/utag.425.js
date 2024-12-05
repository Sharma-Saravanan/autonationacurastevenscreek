//tealium universal tag - utag.425 ut4.0.202411141844, Copyright 2024 Tealium.com Inc. All Rights Reserved.
try{(function(id,loader){var u={"id":id};utag.o[loader].sender[id]=u;if(utag.ut===undefined){utag.ut={};}
if(utag.ut.loader===undefined){u.loader=function(o){var b,c,l,a=document;if(o.type==="iframe"){b=a.createElement("iframe");o.attrs=o.attrs||{"height":"1","width":"1","style":"display:none"};for(l in utag.loader.GV(o.attrs)){b.setAttribute(l,o.attrs[l]);}b.setAttribute("src",o.src);}else if(o.type=="img"){utag.DB("Attach img: "+o.src);b=new Image();b.src=o.src;return;}else{b=a.createElement("script");b.language="javascript";b.type="text/javascript";b.async=1;b.charset="utf-8";for(l in utag.loader.GV(o.attrs)){b[l]=o.attrs[l];}b.src=o.src;}if(o.id){b.id=o.id};if(typeof o.cb=="function"){if(b.addEventListener){b.addEventListener("load",function(){o.cb()},false);}else{b.onreadystatechange=function(){if(this.readyState=='complete'||this.readyState=='loaded'){this.onreadystatechange=null;o.cb()}};}}l=o.loc||"head";c=a.getElementsByTagName(l)[0];if(c){utag.DB("Attach to "+l+": "+o.src);if(l=="script"){c.parentNode.insertBefore(b,c);}else{c.appendChild(b)}}}}else{u.loader=utag.ut.loader;}
u.encode=function(a,b){b="";try{b=encodeURIComponent(a)}catch(e){utag.DB(e);}if(b==""){b=escape(a);}return b}
u.ev={"view":1,"link":1};u.scriptrequested=false;u.rp=function(a,b){if(typeof a!=="undefined"&&a.indexOf("@@")>0){a=a.replace(/@@([^@]+)@@/g,function(m,d){if(b[d]){return u.encode(b[d]);}else{return"";}});}
return a;};u.map={"category_l1":"breadcrumb_1","category_l2":"breadcrumb_2","category_l3":"breadcrumb_3","category_l4":"breadcrumb_4","condition":"vehicle_condition","search_condition":"vehicle_condition","make":"vehicle_make","search_make":"vehicle_make","dma":"Site_DMA","cp.utag_main_v_id":"dtm_user_id","model":"vehicle_model","search_model":"vehicle_model","trim":"vehicle_trim","search_exteriorcolor":"vehicle_color","js_page.location.hostname":"Site_Domain","vin":"vehicle_vin","make_yr":"vehicle_model_year","search_make_year":"vehicle_model_year","hyperion_id":"dealer_id","store_name":"dealer_name","bodystyle":"vehicle_body_style","search_bodystyle":"vehicle_body_style","enh_transaction_id":"dtmc_transaction_id","order_type":"dtmc_conv_type","phone_click_condition":"vehicle_condition","chat_click_condition":"vehicle_condition","phone_click":"vehicle_make","phone_click_year":"vehicle_model_year","phone_click_model":"vehicle_model","phone_click_trim":"vehicle_trim","phone_click_vin":"vehicle_vin","search_price":"vehicle_price","enh_vehic_price":"vehicle_price","lead_make":"vehicle_make","lead_make_yr":"vehicle_model_year","lead_make_model":"vehicle_model","enh_impression_id":"vehicle_vin","ut.profile":"site_group","ga_account_id":"ID_GA","gclid":"ID_Adwords","aid":"compass_aid","lead_inv_type":"vehicle_condition","search_trim":"vehicle_trim","price_msrp":"vehicle_price_msrp"};u.extend=[function(a,b){try{if(b['dom.url'].toString().toLowerCase()=='www.autonationusa.com'.toLowerCase()){if(b["ut.event"]==="view"){var dtm_config={dtm_user_id:b.tealium_visitor_id||"",dtm_email_hash:b.hashed_email||"",dtmc_transaction_id:b.enh_transaction_id||"",breadcrumb_1:b.category_l1||"",breadcrumb_2:b.category_l2||"",breadcrumb_3:b.category_l3||"",breadcrumb_4:b.category_l4||"",vehicle_make:b.make||b.search_make||"",vehicle_model:b.model||b.search_model||"",vehicle_trim:b.trim||"",vehicle_color:b.search_exteriorcolor||"",vehicle_model_year:b.make_yr||b.search_make_year||"",vehicle_body_style:b.bodystyle||b.search_bodystyle||"",vehicle_condition:b.condition||b.search_condition||"",vehicle_price:b.enh_vehic_price||b.search_price||"",vehicle_vin:b.vin||"",dealer_id:b.hyperion_id||"",dealer_name:b.store_name||""};}else if(b["ut.event"]==="link"){var dtm_config={dtm_user_id:b.tealium_visitor_id||"",dtm_email_hash:b.hashed_email||"",dealer_id:b.hyperion_id||"",dtmc_transaction_id:b.enh_transaction_id||"",site_group:b.site_vendor||"",vehicle_condition:b.condition||b.search_condition||"",compass_aid:b.aid||""};}}}catch(e){utag.DB(e)}}];u.send=function(a,b){if(u.ev[a]||u.ev.all!==undefined){var c,d,e,f;u.data={"qsp_delim":"&"||"&","kvp_delim":"="||"=","qs_delim":"?"||"?","tag_type":"script","base_url":"login.dotomi.com/profile/visit/js/1_0","secure_base_url":"","static_params":"dtm_cid=61525&dtm_cmagic=087b34&dtm_fid=@@dtm_fid@@&dtm_promo_id=@@dtm_promo_id@@","cachebust":"enabled","cachevar":"cachebuster"||"_rnd","requestscriptonce":"disabled","attribute":{}};for(c=0;c<u.extend.length;c++){try{d=u.extend[c](a,b);if(d==false)return}catch(e){}};utag.DB("send:425:EXTENSIONS");utag.DB(b);c=[];for(d in utag.loader.GV(u.map)){if(typeof b[d]!=="undefined"&&b[d]!==""){e=u.map[d].split(",");for(f=0;f<e.length;f++){if(e[f].indexOf("attribute.")===0){u.data.attribute[e[f].split(".")[1]]=b[d];}else if(!u.data.hasOwnProperty(e[f])){c.push(e[f]+"##kvp_delim##"+u.encode(b[d]));}
u.data[e[f]]=b[d];}}}
if(!u.data.base_url){if(!u.data.secure_base_url){utag.DB("Error: No Base URL or Secure HTTPS Override Provided.");return;}else{u.data.base_url=u.data.secure_base_url;utag.DB("No Base URL provided, using Secure HTTPS Override.");}}
u.data.secure_base_url=u.data.secure_base_url||u.data.base_url;u.data.url=(location.protocol==="https:"?u.data.secure_base_url:u.data.base_url);if(u.data.url.indexOf("http")!==0&&u.data.url.indexOf("/")!==0){u.data.url=location.protocol+"//"+u.data.url;}
if(u.data.static_params){c.push(u.data.static_params);}
var cb_check=new RegExp("(\\"+u.data.qs_delim+"|"+u.data.qsp_delim+")"+u.data.cachevar+"=");if(u.data.cachebust==="enabled"&&!cb_check.test(u.data.url)){c.push([u.data.cachevar,Math.random()].join(u.data.kvp_delim));}
if(c.length>0){if(u.data.url.indexOf(u.data.qs_delim)<0){u.data.url+=u.data.qs_delim;}else if(u.data.url.indexOf(u.data.qs_delim)!==(u.data.url.length-1)){u.data.url+=u.data.qsp_delim;}}
u.data.url=u.rp(u.data.url,b)+u.rp(c.join(u.data.qsp_delim),b);u.data.url=u.data.url.replace(/##kvp_delim##/g,u.data.kvp_delim);u.callback=u.callback||function(){};if(u.data.requestscriptonce==="enabled"&&u.data.tag_type==="script"){if(!u.scriptrequested){u.scriptrequested=true;u.loader({"type":u.data.tag_type,"src":u.data.url,"loc":"script","id":"utag_425","cb":u.callback,"attrs":u.data.attribute});}else{u.callback();}}else{u.loader({"type":u.data.tag_type,"src":u.data.url,"loc":"script","id":"utag_425","cb":u.callback,"attrs":u.data.attribute});}
utag.DB("send:425:COMPLETE");}};utag.o[loader].loader.LOAD(id);}("425","autonation.dealerdotcomoem"));}catch(error){utag.DB(error);}
