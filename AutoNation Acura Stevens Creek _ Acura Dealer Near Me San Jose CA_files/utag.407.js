//tealium universal tag - utag.407 ut4.0.202411141844, Copyright 2024 Tealium.com Inc. All Rights Reserved.
try{(function(id,loader){var u={"id":id};utag.o[loader].sender[id]=u;if(utag.ut===undefined){utag.ut={};}
var match=/ut\d\.(\d*)\..*/.exec(utag.cfg.v);if(utag.ut.loader===undefined||!match||parseInt(match[1])<41){u.loader=function(o,a,b,c,l,m){utag.DB(o);a=document;if(o.type=="iframe"){m=a.getElementById(o.id);if(m&&m.tagName=="IFRAME"){b=m;}else{b=a.createElement("iframe");}o.attrs=o.attrs||{};utag.ut.merge(o.attrs,{"height":"1","width":"1","style":"display:none"},0);}else if(o.type=="img"){utag.DB("Attach img: "+o.src);b=new Image();}else{b=a.createElement("script");b.language="javascript";b.type="text/javascript";b.async=1;b.charset="utf-8";}if(o.id){b.id=o.id;}for(l in utag.loader.GV(o.attrs)){b.setAttribute(l,o.attrs[l]);}b.setAttribute("src",o.src);if(typeof o.cb=="function"){if(b.addEventListener){b.addEventListener("load",function(){o.cb();},false);}else{b.onreadystatechange=function(){if(this.readyState=="complete"||this.readyState=="loaded"){this.onreadystatechange=null;o.cb();}};}}if(o.type!="img"&&!m){l=o.loc||"head";c=a.getElementsByTagName(l)[0];if(c){utag.DB("Attach to "+l+": "+o.src);if(l=="script"){c.parentNode.insertBefore(b,c);}else{c.appendChild(b);}}}};}else{u.loader=utag.ut.loader;}
if(utag.ut.typeOf===undefined){u.typeOf=function(e){return({}).toString.call(e).match(/\s([a-zA-Z]+)/)[1].toLowerCase();};}else{u.typeOf=utag.ut.typeOf;}
u.ev={"view":1,"link":1};u.toBoolean=function(val){val=val||"";return val===true||val.toLowerCase()==="true"||val.toLowerCase()==="on";};u.clearEmptyKeys=function(object){for(var key in object){if(object[key]===""||object[key]===undefined){delete object[key];}}
return object;};u.isEmptyObject=function(o,a){for(a in o){if(utag.ut.hasOwn(o,a))return false;}
return true;};u.hasgtagjs=function(){window.gtagRename=window.gtagRename||"ga_t"||"gtag";if(utag.ut.gtagScriptRequested){return true;}
var i,s=document.getElementsByTagName("script");for(i=0;i<s.length;i++){if(s[i].src&&s[i].src.indexOf("gtag/js")>=0&&(s[i].id&&s[i].id.indexOf("utag")>-1)){return true;}}
var data_layer_name=""||"dataLayer";window[data_layer_name]=window[data_layer_name]||[];if(typeof window[window.gtagRename]!=="function"){window[window.gtagRename]=function(){window[data_layer_name].push(arguments);};if(u.data.cross_track_domains!==""){window[window.gtagRename]("set","linker",{domains:u.data.cross_track_domains.split(","),accept_incoming:true});}
window[window.gtagRename]("js",new Date());}
return false;};u.isScriptRequestedInit=false;u.scriptRequestedInit=function(){if(u.isScriptRequestedInit){return}
u.scriptrequested=u.hasgtagjs();u.o=window[window.gtagRename];u.isScriptRequestedInit=true;}
u.map_func=function(arr,obj,item){var i=arr.shift();obj[i]=obj[i]||{};if(arr.length>0){u.map_func(arr,obj[i],item);}else{obj[i]=item;}};u.sites={"ecomm":{"required":["prodid"],"params":["prodid","pagetype","totalvalue","category","pvalue","quantity"],"valuerules":["product","cart","purchase"]},"hotel":{"required":["hotelid"],"params":["hotelid","pagetype","checkoutdate","totalvalue"],"valuerules":["cart","purchase"]},"edu":{"required":["pid"],"params":["pid","plocid","pagetype"]},"flight":{"required":["originid","destid"],"params":["originid","destid","pagetype","totalvalue","startdate","enddate"],"valuerules":["cart","purchase"]},"hrental":{"required":["id"],"params":["id","pagetype","startdate","enddate","totalvalue"],"valuerules":["conversionintent","conversion"]},"job":{"required":["id"],"params":["id","locid","pagetype","totalvalue"],"valuerules":["conversionintent","conversion"]},"local":{"required":["id"],"params":["id","pagetype","totalvalue"],"valuerules":["conversionintent","conversion"]},"listing":{"required":["id"],"params":["id","pagetype","totalvalue"],"valuerules":["conversionintent","conversion"]},"travel":{"required":["destid"],"params":["destid","originid","pagetype","startdate","enddate","totalvalue"],"valuerules":["conversionintent","conversion"]},"dynx":{"required":["itemid"],"params":["itemid","itemid2","pagetype","totalvalue"],"valuerules":["conversionintent"]}};u.checkRequired=function(siteName,site){var i,valid=false;if(!u.data[siteName]){return valid;}
for(i=0;i<site.required.length;i++){valid=u.data[siteName][site.required[i]]?true:false;}
return valid;};u.getValue=function(paramName,siteName,site){var i;for(i=0;i<site.valuerules.length;i++){if(u.data.pagetype&&u.data.pagetype===site.valuerules[i]){return u.data[siteName][paramName]||u.data.order_subtotal;}}};u.getParams=function(){var siteName,g={},i;for(siteName in u.sites){var site=u.sites[siteName];if(!u.data[siteName]){continue;}
if(u.checkRequired(siteName,site)){for(i=0;i<site.params.length;i++){if(site.params[i]==="totalvalue"){g[siteName+"_"+site.params[i]]=u.getValue(site.params[i],siteName,site);}else if(site.params[i]==="pagetype"){g[siteName+"_"+site.params[i]]=u.data.pagetype;}else{g[siteName+"_"+site.params[i]]=u.data[siteName][site.params[i]];}}}}
return u.clearEmptyKeys(g);};u.getRemarketingItems=function(){var i,item={},items=[],rmkt=u.data.rmkt,len=0,verticalName,vertical,paramName;if(u.data.product_id.length>0&&!rmkt.retail){rmkt.retail={};rmkt.retail.id=u.data.product_id;}
for(verticalName in rmkt){if(!u.isEmptyObject(rmkt[verticalName])){vertical=rmkt[verticalName];if(verticalName.match(/retail|education|hotel_rental|jobs|local|real_estate|custom/i)&&vertical.id){len=vertical.id.length;}else if(verticalName.match(/flights|travel/i)&&vertical.destination){len=vertical.destination.length;}
for(i=0;i<len;i++){item={};for(paramName in vertical){if(vertical[paramName][i]){item[paramName]=vertical[paramName][i];}}
if(!u.isEmptyObject(item)){item.google_business_vertical=verticalName;items.push(item);}}}}
return items;};u.getItems=function(len){var item={},i,j,items=[],nextLoop=false;items=u.getRemarketingItems();if(u.data.conversion_label){len=len||u.data.product_id.length;for(i=0;i<len;i++){item={};for(j=0;j<items.length;j++){if(items[j].id===u.data.product_id[i]){items[j].price=(u.data.product_unit_price[i]?u.data.product_unit_price[i]:"");items[j].quantity=(u.data.product_quantity[i]?u.data.product_quantity[i]:"");nextLoop=true;break;}}
if(nextLoop){nextLoop=false;continue;}
item.id=u.data.product_id[i];item.price=(u.data.product_unit_price[i]?u.data.product_unit_price[i]:"");item.quantity=(u.data.product_quantity[i]?u.data.product_quantity[i]:"");items.push(item);}}
return items;};u.map={"adwords_conversion_id":"conversion_id"};u.extend=[function(a,b,c,d,e,f,g){if(1){d=b['store_name'];if(typeof d=='undefined')return;c=[{'autonation acura south bay':'AW-404162997'},{'autonation honda valencia':'AW-404162985'},{'autonation ford torrance':'AW-404220352'},{'mercedes-benz of stevens creek':'AW-404162970'},{'autonation honda fremont':'AW-404220343'},{'autonation honda roseville':'AW-404220340'},{'autonation acura stevens creek':'AW-404231624'},{'autonation chrysler dodge jeep ram roseville':'AW-404162982'},{'mercedes-benz of san jose':'AW-404163012'},{'autonation honda 104':'AW-404220349'},{'autonation buick gmc park meadows':'AW-404162976'},{'autonation chrysler jeep broadway':'AW-404162964'},{'autonation chrysler jeep west':'AW-404220328'},{'autonation subaru west':'AW-404220325'},{'autonation ford littleton':'AW-404231582'},{'bmw of buena park':'AW-590798945'},{'bmw of mountain view':'AW-590738481'},{'bmw of bellevue':'AW-590798201'},{'bmw of delray beach':'AW-404231618'},{'bmw of mt. kisco':'AW-404231579'},{'laurel bmw of westmont':'AW-404231576'},{'mercedes-benz of coconut creek':'AW-404231615'},{'mercedes-benz of delray':'AW-404220310'},{'mercedes-benz of fort lauderdale':'AW-404231573'},{'mercedes-benz of hunt valley':'AW-404231570'},{'mercedes-benz of marietta':'AW-404220301'},{'mercedes-benz of miami':'AW-404220313'},{'mercedes-benz of naperville':'AW-404231561'},{'mercedes-benz of north orlando':'AW-404220298'},{'mercedes-benz of orlando':'AW-404162955'},{'mercedes-benz of pembroke pines':'AW-404220295'},{'mercedes-benz of pompano':'AW-404220292'},{'mercedes-benz of sarasota':'AW-404220289'},{'mercedes-benz of wesley chapel':'AW-404231420'},{'mercedes-benz of westmont':'AW-404231417'},{'autonation toyota weston':'AW-404231567'},{'autonation toyota las vegas':'AW-385768154'},{'autonation toyota fort myers':'AW-385704804'},{'autonation toyota tempe':'AW-385768145'},{'autonation toyota arapahoe':'AW-385704807'},{'autonation toyota thornton road':'AW-385768130'},{'autonation toyota libertyville':'AW-385768151'},{'autonation toyota mall of georgia':'AW-385768142'},{'autonation toyota spokane valley':'AW-385758865'},{'autonation toyota pinellas park':'AW-385758868'},{'autonation toyota corpus christi':'AW-385767998'},{'autonation toyota gulf freeway':'AW-385767989'},{'autonation toyota cerritos':'AW-385768136'},{'autonation toyota irvine':'AW-385704771'},{'autonation toyota buena park':'AW-385758847'},{'autonation toyota south austin':'AW-385767986'},{'autonation toyota hayward':'AW-385704795'},{'autonation toyota leesburg':'AW-385767983'}];var m=false;for(e=0;e<c.length;e++){for(f in utag.loader.GV(c[e])){if(d==f){b['adwords_conversion_id']=c[e][f];m=true};};if(m)break};}},function(a,b,c,d,e,f,g){if(1){d=b['dom.url'];if(typeof d=='undefined')return;c=[{'autonationusa.com/service-offer-toyota-weston.htm':'AW-404231567'},{'autonationusa.com/service-offer-toyota-las-vegas.htm':'AW-385768154'},{'autonationusa.com/service-offer-toyota-fort-meyers.htm':'AW-385704804'},{'autonationusa.com/service-offer-toyota-tempe.htm':'AW-385768145'},{'autonationusa.com/service-offer-toyota-arapahoe.htm':'AW-385704807'},{'autonationusa.com/service-offer-toyota-thornton-road.htm':'AW-385768130'},{'autonationusa.com/service-offer-toyota-liberyville.htm':'AW-385768151'},{'autonationusa.com/service-offer-toyota-mall-of-georgia.htm':'AW-385768142'},{'autonationusa.com/service-offer-toyota-spokane-valley.htm':'AW-385758865'},{'autonationusa.com/service-offer-toyota-pinellas-park.htm':'AW-385758868'},{'autonationusa.com/service-offer-toyota-corpus-christi.htm':'AW-385767998'},{'autonationusa.com/service-offer-toyota-gulf-freeway.htm':'AW-385767989'},{'autonationusa.com/service-offer-toyota-cerritos.htm':'AW-385768136'},{'autonationusa.com/service-offer-toyota-irvine.htm':'AW-385704771'},{'autonationusa.com/service-offer-toyota-buena-park.htm':'AW-385758847'},{'autonationusa.com/service-offer-toyota-south-austin.htm':'AW-385767986'},{'autonationusa.com/service-offer-toyota-hayward.htm':'AW-385704795'},{'autonationusa.com/service-offer-toyota-leesburg.htm':'AW-385767983'}];var m=false;for(e=0;e<c.length;e++){for(f in utag.loader.GV(c[e])){if(d.toString().indexOf(f)>-1){b['adwords_conversion_id']=c[e][f];m=true};};if(m)break};}}];u.send=function(a,b){if(u.ev[a]||u.ev.all!==undefined){utag.DB("send:407");utag.DB(b);var c,d,e,f,h,i,j;u.data={"base_url":"https://www.googletagmanager.com/gtag/js","conversion_id":"","conversion_label":"","conversion_value":"","pagetype":"home","remarketing":"true","data_layer_name":"","product_id":[],"product_category":[],"product_quantity":[],"product_unit_price":[],"product_discount":[],"rmkt":{},"config":{allow_enhanced_conversions:u.toBoolean("")},"event_data":{"items":[]},cross_track_domains:"",user_data:{},"event":[],"custom":{},transaction_id:'',user_id:''};for(c=0;c<u.extend.length;c++){try{d=u.extend[c](a,b);if(d==false)return}catch(e){}};utag.DB("send:407:EXTENSIONS");utag.DB(b);c=[];for(d in utag.loader.GV(u.map)){if(b[d]!==undefined&&b[d]!==""){e=u.map[d].split(",");for(f=0;f<e.length;f++){u.map_func(e[f].split("."),u.data,b[d]);}}else{h=d.split(":");if(h.length===2&&b[h[0]]===h[1]){if(u.map[d]){u.data.event=u.data.event.concat(u.map[d].split(","));}}}}
utag.DB("send:407:MAPPINGS");utag.DB(u.data);u.scriptRequestedInit();u.data.order_id=u.data.order_id||b._corder||u.data.transaction_id||"";u.data.order_subtotal=u.data.conversion_value||u.data.order_subtotal||b._csubtotal||"";u.data.order_currency=u.data.conversion_currency||u.data.order_currency||b._ccurrency||"";if(u.data.product_id.length===0&&b._cprod!==undefined){u.data.product_id=b._cprod.slice(0);}
if(u.data.product_category.length===0&&b._ccat!==undefined){u.data.product_category=b._ccat.slice(0);}
if(u.data.product_quantity.length===0&&b._cquan!==undefined){u.data.product_quantity=b._cquan.slice(0);}
if(u.data.product_unit_price.length===0&&b._cprice!==undefined){u.data.product_unit_price=b._cprice.slice(0);}
if(u.data.product_discount.length===0&&b._cpdisc!==undefined){u.data.product_discount=b._cpdisc.slice(0);}
if(u.data.event.length===0&&b._cevent!==undefined){u.data.event=(u.typeOf(b._cevent)==="array")?b._cevent.slice(0):[b._cevent];}
if(typeof(u.data.conversion_id)==="string"&&u.data.conversion_id!==""){u.data.conversion_id=u.data.conversion_id.replace(/\s/g,"").split(",");}
if(typeof(u.data.conversion_label)==="string"&&u.data.conversion_label!==""){u.data.conversion_label=u.data.conversion_label.replace(/\s/g,"").split(",");}
if(typeof(u.data.conversion_cookie_prefix)==="string"&&u.data.conversion_cookie_prefix!==""){u.data.conversion_cookie_prefix=u.data.conversion_cookie_prefix.replace(/\s/g,"").split(",");}
if(u.data.order_currency!==u.data.order_currency.toUpperCase()){u.data.order_currency=u.data.order_currency.toUpperCase();utag.DB("Currency not supplied in uppercase - automatically converting");}
if(!u.data.conversion_id){utag.DB(u.id+": Tag not fired: Required attribute not populated");return;}
if(u.data.gtag_enable_tcf_support){window["gtag_enable_tcf_support"]=u.toBoolean(u.data.gtag_enable_tcf_support);}
u.o("set",{"developer_id.dYmQxMT":true});for(i=0;i<u.data.conversion_id.length;i++){if(!/^[a-zA-Z]{2}-/.test(u.data.conversion_id[i])){u.data.conversion_id[i]="AW-"+u.data.conversion_id[i];}}
u.data.base_url+="?id="+u.data.conversion_id[0];if(u.data.data_layer_name){u.data.base_url=u.data.base_url+"&l="+u.data.data_layer_name;}
for(i=0;i<u.data.conversion_id.length;i++){if(u.data.conversion_cookie_prefix&&u.data.conversion_cookie_prefix[i]){u.data.config.conversion_cookie_prefix=u.data.conversion_cookie_prefix[i];}
u.o("config",u.data.conversion_id[i],u.data.config);}
if(u.data.config.allow_enhanced_conversions){u.o('set','user_data',u.data.user_data);}
u.data.event_data=u.getParams();u.data.event_data.items=u.getItems();u.data.event_data.user_id=u.data.user_id;utag.ut.merge(u.data.event_data,u.data.custom,1);if(u.data.conversion_label){u.data.event_data.send_to=[];for(i=0;i<u.data.conversion_id.length;i++){u.data.event_data.send_to.push(u.data.conversion_id[i]+"/"+(u.data.conversion_label[i]||u.data.conversion_label[0]));}
if(u.data.order_subtotal){u.data.event_data.value=u.data.order_subtotal;u.data.event_data.currency=u.data.order_currency;}
u.data.event_data.transaction_id=u.data.order_id;u.data.event_data.aw_merchant_id=u.data.aw_merchant_id;u.data.event_data.aw_feed_country=u.data.aw_feed_country;u.data.event_data.aw_feed_language=u.data.aw_feed_language;u.data.event_data.discount=0;for(j=0;j<u.data.product_discount.length;j++){u.data.event_data.discount+=isNaN(parseFloat(u.data.product_discount[j]))?0:parseFloat(u.data.product_discount[j]);}
var containsConversion=false;for(i=0;i<u.data.event.length;i++){if(u.data.event[i]==="conversion"||u.data.event[i]==="purchase"){containsConversion=true;}}
if(!containsConversion&&!u.data.event.length){u.data.event.push("conversion");}}
if(u.toBoolean(u.data.remarketing)){if(!u.data.event.length){u.data.event_data.send_to=u.data.conversion_id;u.data.event.push("page_view");}}
for(i=0;i<u.data.event.length;i++){if(!u.data.event_data.send_to){u.data.event_data.send_to=u.data.conversion_id;}
utag.ut.merge(u.data.event_data,u.data[u.data.event[i]],1);u.o("event",u.data.event[i],u.clearEmptyKeys(u.data.event_data));}
if(!u.hasgtagjs()){u.scriptrequested=true;utag.ut.gtagScriptRequested=true;u.loader({"type":"script","src":u.data.base_url,"cb":null,"loc":"script","id":"utag_407","attrs":{}});}
utag.DB("send:407:COMPLETE");}};utag.o[loader].loader.LOAD(id);}("407","autonation.dealerdotcomoem"));}catch(error){utag.DB(error);}
