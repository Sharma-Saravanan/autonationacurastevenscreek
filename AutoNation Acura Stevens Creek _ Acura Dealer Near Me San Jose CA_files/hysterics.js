!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e(((t=t||self).DDC=t.DDC||{},t.DDC.Hysterics={}))}(this,(function(t){"use strict";const e=t=>(e,r)=>t(e,r);e.contextKey="no-op";var r=Object.freeze({__proto__:null,contextKey:"no-op",getWrapper:e});let o;"undefined"==typeof window||void 0===window.document?o=require("abort-controller"):"undefined"!=typeof AbortController&&(o=AbortController);const n=t=>{const e=t.abort;e&&e.controller&&e.controller.abort()},i=t=>{const e=t.abort;return e&&e.controller?e.controller.signal:null},s=t=>o?(e,r)=>{r.abort.controller=new o;const i=(async()=>t(e,r))();return i.cancel=()=>n(r),i}:e(t);s.contextKey="abort";var a=Object.freeze({__proto__:null,contextKey:"abort",abort:n,getAbortSignal:i,getWrapper:s});const c=t=>e=>t(...e);c.contextKey="contextTerminus";var u=Object.freeze({__proto__:null,contextKey:"contextTerminus",getWrapper:c});const p=(t,e,r)=>{t[e].options={...r,...t[e].options}};let l=window&&window.newrelic;l||(console.warn("Unable to locate the NewRelic browser agent - performance metrics will not be recorded for this application!"),l={noticeError:()=>{},addPageAction:()=>{}});const m={isNoticeable:t=>!0},f=(t,e,r)=>{if(!t.newRelic)return;const{metrics:o}=t.newRelic;if(!o)throw new Error("The New Relic wrapper must be ordered before any wrappers that append metrics!");o[e]=r},h=(t,e)=>(p(e,"newRelic",m),async(e,r)=>{const o={};r.newRelic.metrics=o;try{return await t(e,r)}catch(t){throw r.newRelic.options.isNoticeable(t)&&((...t)=>{l.noticeError(...t)})(t),o.error=!0,t.name&&(o["error.name"]=t.name),t.message&&(o["error.message"]=t.message),t}finally{((...t)=>{l.addPageAction(...t)})(r.newRelic.options.prefix||r.name,o)}});h.contextKey="newRelic";var y=Object.freeze({__proto__:null,contextKey:"newRelic",recordMetric:f,getWrapper:h});const _=t=>async(e,r)=>{const o=Date.now();try{return await t(e,r)}finally{const t=Date.now()-o;r.duration.elapsed=t,f(r,"".concat("duration",".elapsed"),t)}};_.contextKey="duration";var d=Object.freeze({__proto__:null,contextKey:"duration",getWrapper:_});class w extends Error{constructor(t,e,r=null){super();const{url:o,status:n,statusText:i}=t;this.status=n,this.statusText=i,this.url=o,this.message="".concat(n," ").concat(i," (").concat(o,") - ").concat(e),this.name="FetchHttpError".concat(n),this.upstreamError=r,Error.captureStackTrace?Error.captureStackTrace(this,w):this.stack=new Error(this.message).stack}}const T={responseBodyType:"json",validateResponse:async t=>{if(!t.ok){const{headers:e}=t;let r,o;try{const n=e.get("content-type");n&&n.includes("json")?(r=await t.json(),o=r.description||r.message||JSON.stringify(r)):o=await t.text()}catch(t){}throw new w(t,o,r)}}},b=t=>!t.status||429===t.status||5===Math.trunc(t.status/100),v=(t,e)=>{if(!fetch)throw new Error("No globally available `fetch` implementation could be found.");return p(e,"fetch",T),async(t,e)=>{const[r]=t,o={...e.fetch.options,signal:i(e)},{responseBodyType:n}=o;let s;f(e,"".concat("fetch",".url"),r);try{s=await fetch(r,o)}catch(t){if("AbortError"===t.name)return null;throw t}const{status:a}=s;return f(e,"".concat("fetch",".status"),s.status),204===a?null:(null!==o.validateResponse&&await o.validateResponse(s),null===n?s:s[n]())}};v.contextKey="fetch";var x=Object.freeze({__proto__:null,defaultIsRetryable:b,defaultCircuitBreakerErrorFilter:t=>!b(t),contextKey:"fetch",getWrapper:v});function g(t,e){"boolean"==typeof e&&(e={forever:e}),this._originalTimeouts=JSON.parse(JSON.stringify(t)),this._timeouts=t,this._options=e||{},this._maxRetryTime=e&&e.maxRetryTime||1/0,this._fn=null,this._errors=[],this._attempts=1,this._operationTimeout=null,this._operationTimeoutCb=null,this._timeout=null,this._operationStart=null,this._options.forever&&(this._cachedTimeouts=this._timeouts.slice(0))}var E=g;g.prototype.reset=function(){this._attempts=1,this._timeouts=this._originalTimeouts},g.prototype.stop=function(){this._timeout&&clearTimeout(this._timeout),this._timeouts=[],this._cachedTimeouts=null},g.prototype.retry=function(t){if(this._timeout&&clearTimeout(this._timeout),!t)return!1;var e=(new Date).getTime();if(t&&e-this._operationStart>=this._maxRetryTime)return this._errors.unshift(new Error("RetryOperation timeout occurred")),!1;this._errors.push(t);var r=this._timeouts.shift();if(void 0===r){if(!this._cachedTimeouts)return!1;this._errors.splice(this._errors.length-1,this._errors.length),this._timeouts=this._cachedTimeouts.slice(0),r=this._timeouts.shift()}var o=this,n=setTimeout((function(){o._attempts++,o._operationTimeoutCb&&(o._timeout=setTimeout((function(){o._operationTimeoutCb(o._attempts)}),o._operationTimeout),o._options.unref&&o._timeout.unref()),o._fn(o._attempts)}),r);return this._options.unref&&n.unref(),!0},g.prototype.attempt=function(t,e){this._fn=t,e&&(e.timeout&&(this._operationTimeout=e.timeout),e.cb&&(this._operationTimeoutCb=e.cb));var r=this;this._operationTimeoutCb&&(this._timeout=setTimeout((function(){r._operationTimeoutCb()}),r._operationTimeout)),this._operationStart=(new Date).getTime(),this._fn(this._attempts)},g.prototype.try=function(t){console.log("Using RetryOperation.try() is deprecated"),this.attempt(t)},g.prototype.start=function(t){console.log("Using RetryOperation.start() is deprecated"),this.attempt(t)},g.prototype.start=g.prototype.try,g.prototype.errors=function(){return this._errors},g.prototype.attempts=function(){return this._attempts},g.prototype.mainError=function(){if(0===this._errors.length)return null;for(var t={},e=null,r=0,o=0;o<this._errors.length;o++){var n=this._errors[o],i=n.message,s=(t[i]||0)+1;t[i]=s,s>=r&&(e=n,r=s)}return e};var R=function(t,e){return t(e={exports:{}},e.exports),e.exports}((function(t,e){e.operation=function(t){var r=e.timeouts(t);return new E(r,{forever:t&&t.forever,unref:t&&t.unref,maxRetryTime:t&&t.maxRetryTime})},e.timeouts=function(t){if(t instanceof Array)return[].concat(t);var e={retries:10,factor:2,minTimeout:1e3,maxTimeout:1/0,randomize:!1};for(var r in t)e[r]=t[r];if(e.minTimeout>e.maxTimeout)throw new Error("minTimeout is greater than maxTimeout");for(var o=[],n=0;n<e.retries;n++)o.push(this.createTimeout(n,e));return t&&t.forever&&!o.length&&o.push(this.createTimeout(n,e)),o.sort((function(t,e){return t-e})),o},e.createTimeout=function(t,e){var r=e.randomize?Math.random()+1:1,o=Math.round(r*e.minTimeout*Math.pow(e.factor,t));return o=Math.min(o,e.maxTimeout)},e.wrap=function(t,r,o){if(r instanceof Array&&(o=r,r=null),!o)for(var n in o=[],t)"function"==typeof t[n]&&o.push(n);for(var i=0;i<o.length;i++){var s=o[i],a=t[s];t[s]=function(o){var n=e.operation(r),i=Array.prototype.slice.call(arguments,1),s=i.pop();i.push((function(t){n.retry(t)||(t&&(arguments[0]=n.mainError()),s.apply(this,arguments))})),n.attempt((function(){o.apply(t,i)}))}.bind(t,a),t[s].options=r}}})),K=(R.operation,R.timeouts,R.createTimeout,R.wrap,R);var O=function(t,e){return new Promise((function(r,o){var n=e||{};"randomize"in n||(n.randomize=!0);var i=K.operation(n);function s(t){o(t||new Error("Aborted"))}function a(t,e){t.bail?s(t):i.retry(t)?n.onRetry&&n.onRetry(t,e):o(i.mainError())}i.attempt((function(e){var o;try{o=t(s,e)}catch(t){return void a(t,e)}Promise.resolve(o).then(r).catch((function(t){a(t,e)}))}))}))};const C={retries:1,minTimeout:30,isRetryable:t=>!0},j=(t,e)=>(p(e,"retry",C),async(e,r)=>{let o=0;try{return await O(async(n,i)=>{o=i;try{return await t(e,r)}catch(t){const{isRetryable:e}=r.retry.options;if(!await e(t))return n(t),null;throw t}},r.retry.options)}finally{r.retry.attempts=o,f(r,"".concat("retry",".attempts"),o)}});j.contextKey="retry";var z=Object.freeze({__proto__:null,contextKey:"retry",getWrapper:j});class A extends Error{constructor(t){super(t),this.name="TimeoutError"}}const D=(t,e,r)=>new Promise((o,n)=>{if("number"!=typeof e||e<0)throw new TypeError("Expected `milliseconds` to be a positive number");if(e===1/0)return void o(t);const i=setTimeout(()=>{if("function"==typeof r){try{o(r())}catch(t){n(t)}return}const i="string"==typeof r?r:"Promise timed out after ".concat(e," milliseconds"),s=r instanceof Error?r:new A(i);"function"==typeof t.cancel&&t.cancel(),n(s)},e);((t,e)=>{e=e||(()=>{}),t.then(t=>new Promise(t=>{t(e())}).then(()=>t),t=>new Promise(t=>{t(e())}).then(()=>{throw t}))})(t.then(o,n),()=>{clearTimeout(i)})});var k=D,W=D,P=A;k.default=W,k.TimeoutError=P;const S={timeout:600},N=(t,e)=>(p(e,"timeout",S),async(e,r)=>{const{timeout:o}=r.timeout.options;return k(t(e,r),o)});N.contextKey="timeout";var B=Object.freeze({__proto__:null,contextKey:"timeout",getWrapper:N});const M={abort:a,circuitBreaker:r,contextTerminus:u,duration:d,fetch:x,newRelic:y,retry:z,timeout:B},F=[y,d,r,z,B,a,u],J=(t=!0)=>t?F:F.filter(t=>t!==u),U=(t,e,r)=>{const o={...t};return r.forEach(r=>{const{contextKey:n}=r;o[n]={...t[n]},o[n].options={...o[n].options,...e[n]}}),o},H=(t,e,r={},o=J())=>{const n=U({name:t},r||{},o);let i=e;return o.slice().reverse().forEach(t=>{i=t.getWrapper(i,n)}),async(t=[],e={})=>{if(!Array.isArray(t))throw new Error("Function arguments must be provided as an array");const r=U(n,e,o);return i(t,r)}};t.getDefaultWrappers=J,t.hysteriCall=H,t.hysteriFetch=(t,e={},r=[...J(!1),M.fetch])=>{if(r[r.length-1]!==M.fetch)throw new Error("The wrappers array argument must end with the fetch wrapper!");const o={...e,[M.retry.contextKey]:{isRetryable:M.fetch.defaultIsRetryable,...e?e[M.retry.contextKey]:{}},[M.circuitBreaker.contextKey]:{errorFilter:M.fetch.defaultCircuitBreakerErrorFilter,...e?e[M.circuitBreaker.contextKey]:{}}},n=H(t,null,o,r);return async(t,e={},r={})=>{const o={...r,[M.fetch.contextKey]:{...e||{},...r?r[M.fetch.contextKey]:{}}};return n([t],o)}},t.wrappers=M,Object.defineProperty(t,"__esModule",{value:!0})}));
//# sourceMappingURL=hysterics.js.map
