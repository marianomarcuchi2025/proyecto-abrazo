(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const H=globalThis,V=H.ShadowRoot&&(H.ShadyCSS===void 0||H.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,K=Symbol(),J=new WeakMap;let ht=class{constructor(t,e,o){if(this._$cssResult$=!0,o!==K)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(V&&t===void 0){const o=e!==void 0&&e.length===1;o&&(t=J.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),o&&J.set(e,t))}return t}toString(){return this.cssText}};const bt=s=>new ht(typeof s=="string"?s:s+"",void 0,K),yt=(s,...t)=>{const e=s.length===1?s[0]:t.reduce((o,i,r)=>o+(a=>{if(a._$cssResult$===!0)return a.cssText;if(typeof a=="number")return a;throw Error("Value passed to 'css' function must be a 'css' function result: "+a+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[r+1],s[0]);return new ht(e,s,K)},vt=(s,t)=>{if(V)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const o=document.createElement("style"),i=H.litNonce;i!==void 0&&o.setAttribute("nonce",i),o.textContent=e.cssText,s.appendChild(o)}},W=V?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(const o of t.cssRules)e+=o.cssText;return bt(e)})(s):s;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:$t,defineProperty:_t,getOwnPropertyDescriptor:xt,getOwnPropertyNames:At,getOwnPropertySymbols:wt,getPrototypeOf:St}=Object,_=globalThis,F=_.trustedTypes,Ct=F?F.emptyScript:"",Et=_.reactiveElementPolyfillSupport,M=(s,t)=>s,q={toAttribute(s,t){switch(t){case Boolean:s=s?Ct:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},B=(s,t)=>!$t(s,t),Y={attribute:!0,type:String,converter:q,reflect:!1,useDefault:!1,hasChanged:B};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),_.litPropertyMetadata??(_.litPropertyMetadata=new WeakMap);let S=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const o=Symbol(),i=this.getPropertyDescriptor(t,o,e);i!==void 0&&_t(this.prototype,t,i)}}static getPropertyDescriptor(t,e,o){const{get:i,set:r}=xt(this.prototype,t)??{get(){return this[e]},set(a){this[e]=a}};return{get:i,set(a){const c=i?.call(this);r?.call(this,a),this.requestUpdate(t,c,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Y}static _$Ei(){if(this.hasOwnProperty(M("elementProperties")))return;const t=St(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(M("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(M("properties"))){const e=this.properties,o=[...At(e),...wt(e)];for(const i of o)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[o,i]of e)this.elementProperties.set(o,i)}this._$Eh=new Map;for(const[e,o]of this.elementProperties){const i=this._$Eu(e,o);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const o=new Set(t.flat(1/0).reverse());for(const i of o)e.unshift(W(i))}else t!==void 0&&e.push(W(t));return e}static _$Eu(t,e){const o=e.attribute;return o===!1?void 0:typeof o=="string"?o:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const o of e.keys())this.hasOwnProperty(o)&&(t.set(o,this[o]),delete this[o]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return vt(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,o){this._$AK(t,o)}_$ET(t,e){const o=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,o);if(i!==void 0&&o.reflect===!0){const r=(o.converter?.toAttribute!==void 0?o.converter:q).toAttribute(e,o.type);this._$Em=t,r==null?this.removeAttribute(i):this.setAttribute(i,r),this._$Em=null}}_$AK(t,e){const o=this.constructor,i=o._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const r=o.getPropertyOptions(i),a=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:q;this._$Em=i;const c=a.fromAttribute(e,r.type);this[i]=c??this._$Ej?.get(i)??c,this._$Em=null}}requestUpdate(t,e,o,i=!1,r){if(t!==void 0){const a=this.constructor;if(i===!1&&(r=this[t]),o??(o=a.getPropertyOptions(t)),!((o.hasChanged??B)(r,e)||o.useDefault&&o.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,o))))return;this.C(t,e,o)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(t,e,{useDefault:o,reflect:i,wrapped:r},a){o&&!(this._$Ej??(this._$Ej=new Map)).has(t)&&(this._$Ej.set(t,a??e??this[t]),r!==!0||a!==void 0)||(this._$AL.has(t)||(this.hasUpdated||o||(e=void 0),this._$AL.set(t,e)),i===!0&&this._$Em!==t&&(this._$Eq??(this._$Eq=new Set)).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[i,r]of this._$Ep)this[i]=r;this._$Ep=void 0}const o=this.constructor.elementProperties;if(o.size>0)for(const[i,r]of o){const{wrapped:a}=r,c=this[i];a!==!0||this._$AL.has(i)||c===void 0||this.C(i,void 0,r,c)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(o=>o.hostUpdate?.()),this.update(e)):this._$EM()}catch(o){throw t=!1,this._$EM(),o}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(t){}firstUpdated(t){}};S.elementStyles=[],S.shadowRootOptions={mode:"open"},S[M("elementProperties")]=new Map,S[M("finalized")]=new Map,Et?.({ReactiveElement:S}),(_.reactiveElementVersions??(_.reactiveElementVersions=[])).push("2.1.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const O=globalThis,Z=s=>s,L=O.trustedTypes,X=L?L.createPolicy("lit-html",{createHTML:s=>s}):void 0,ut="$lit$",$=`lit$${Math.random().toFixed(9).slice(2)}$`,pt="?"+$,kt=`<${pt}>`,w=document,R=()=>w.createComment(""),T=s=>s===null||typeof s!="object"&&typeof s!="function",Q=Array.isArray,Pt=s=>Q(s)||typeof s?.[Symbol.iterator]=="function",G=`[ 	
\f\r]`,P=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,tt=/-->/g,et=/>/g,x=RegExp(`>|${G}(?:([^\\s"'>=/]+)(${G}*=${G}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ot=/'/g,it=/"/g,ft=/^(?:script|style|textarea|title)$/i,Mt=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),y=Mt(1),E=Symbol.for("lit-noChange"),h=Symbol.for("lit-nothing"),st=new WeakMap,A=w.createTreeWalker(w,129);function mt(s,t){if(!Q(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return X!==void 0?X.createHTML(t):t}const Ot=(s,t)=>{const e=s.length-1,o=[];let i,r=t===2?"<svg>":t===3?"<math>":"",a=P;for(let c=0;c<e;c++){const n=s[c];let d,u,l=-1,b=0;for(;b<n.length&&(a.lastIndex=b,u=a.exec(n),u!==null);)b=a.lastIndex,a===P?u[1]==="!--"?a=tt:u[1]!==void 0?a=et:u[2]!==void 0?(ft.test(u[2])&&(i=RegExp("</"+u[2],"g")),a=x):u[3]!==void 0&&(a=x):a===x?u[0]===">"?(a=i??P,l=-1):u[1]===void 0?l=-2:(l=a.lastIndex-u[2].length,d=u[1],a=u[3]===void 0?x:u[3]==='"'?it:ot):a===it||a===ot?a=x:a===tt||a===et?a=P:(a=x,i=void 0);const v=a===x&&s[c+1].startsWith("/>")?" ":"";r+=a===P?n+kt:l>=0?(o.push(d),n.slice(0,l)+ut+n.slice(l)+$+v):n+$+(l===-2?c:v)}return[mt(s,r+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),o]};class U{constructor({strings:t,_$litType$:e},o){let i;this.parts=[];let r=0,a=0;const c=t.length-1,n=this.parts,[d,u]=Ot(t,e);if(this.el=U.createElement(d,o),A.currentNode=this.el.content,e===2||e===3){const l=this.el.content.firstChild;l.replaceWith(...l.childNodes)}for(;(i=A.nextNode())!==null&&n.length<c;){if(i.nodeType===1){if(i.hasAttributes())for(const l of i.getAttributeNames())if(l.endsWith(ut)){const b=u[a++],v=i.getAttribute(l).split($),z=/([.?@])?(.*)/.exec(b);n.push({type:1,index:r,name:z[2],strings:v,ctor:z[1]==="."?Nt:z[1]==="?"?Rt:z[1]==="@"?Tt:D}),i.removeAttribute(l)}else l.startsWith($)&&(n.push({type:6,index:r}),i.removeAttribute(l));if(ft.test(i.tagName)){const l=i.textContent.split($),b=l.length-1;if(b>0){i.textContent=L?L.emptyScript:"";for(let v=0;v<b;v++)i.append(l[v],R()),A.nextNode(),n.push({type:2,index:++r});i.append(l[b],R())}}}else if(i.nodeType===8)if(i.data===pt)n.push({type:2,index:r});else{let l=-1;for(;(l=i.data.indexOf($,l+1))!==-1;)n.push({type:7,index:r}),l+=$.length-1}r++}}static createElement(t,e){const o=w.createElement("template");return o.innerHTML=t,o}}function k(s,t,e=s,o){if(t===E)return t;let i=o!==void 0?e._$Co?.[o]:e._$Cl;const r=T(t)?void 0:t._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(s),i._$AT(s,e,o)),o!==void 0?(e._$Co??(e._$Co=[]))[o]=i:e._$Cl=i),i!==void 0&&(t=k(s,i._$AS(s,t.values),i,o)),t}class It{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:o}=this._$AD,i=(t?.creationScope??w).importNode(e,!0);A.currentNode=i;let r=A.nextNode(),a=0,c=0,n=o[0];for(;n!==void 0;){if(a===n.index){let d;n.type===2?d=new j(r,r.nextSibling,this,t):n.type===1?d=new n.ctor(r,n.name,n.strings,this,t):n.type===6&&(d=new Ut(r,this,t)),this._$AV.push(d),n=o[++c]}a!==n?.index&&(r=A.nextNode(),a++)}return A.currentNode=w,i}p(t){let e=0;for(const o of this._$AV)o!==void 0&&(o.strings!==void 0?(o._$AI(t,o,e),e+=o.strings.length-2):o._$AI(t[e])),e++}}class j{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,o,i){this.type=2,this._$AH=h,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=o,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=k(this,t,e),T(t)?t===h||t==null||t===""?(this._$AH!==h&&this._$AR(),this._$AH=h):t!==this._$AH&&t!==E&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Pt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==h&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(w.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:o}=t,i=typeof o=="number"?this._$AC(t):(o.el===void 0&&(o.el=U.createElement(mt(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===i)this._$AH.p(e);else{const r=new It(i,this),a=r.u(this.options);r.p(e),this.T(a),this._$AH=r}}_$AC(t){let e=st.get(t.strings);return e===void 0&&st.set(t.strings,e=new U(t)),e}k(t){Q(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let o,i=0;for(const r of t)i===e.length?e.push(o=new j(this.O(R()),this.O(R()),this,this.options)):o=e[i],o._$AI(r),i++;i<e.length&&(this._$AR(o&&o._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const o=Z(t).nextSibling;Z(t).remove(),t=o}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}}class D{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,o,i,r){this.type=1,this._$AH=h,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,o.length>2||o[0]!==""||o[1]!==""?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=h}_$AI(t,e=this,o,i){const r=this.strings;let a=!1;if(r===void 0)t=k(this,t,e,0),a=!T(t)||t!==this._$AH&&t!==E,a&&(this._$AH=t);else{const c=t;let n,d;for(t=r[0],n=0;n<r.length-1;n++)d=k(this,c[o+n],e,n),d===E&&(d=this._$AH[n]),a||(a=!T(d)||d!==this._$AH[n]),d===h?t=h:t!==h&&(t+=(d??"")+r[n+1]),this._$AH[n]=d}a&&!i&&this.j(t)}j(t){t===h?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Nt extends D{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===h?void 0:t}}class Rt extends D{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==h)}}class Tt extends D{constructor(t,e,o,i,r){super(t,e,o,i,r),this.type=5}_$AI(t,e=this){if((t=k(this,t,e,0)??h)===E)return;const o=this._$AH,i=t===h&&o!==h||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,r=t!==h&&(o===h||i);i&&this.element.removeEventListener(this.name,this,o),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class Ut{constructor(t,e,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){k(this,t)}}const jt=O.litHtmlPolyfillSupport;jt?.(U,j),(O.litHtmlVersions??(O.litHtmlVersions=[])).push("3.3.3");const zt=(s,t,e)=>{const o=e?.renderBefore??t;let i=o._$litPart$;if(i===void 0){const r=e?.renderBefore??null;o._$litPart$=i=new j(t.insertBefore(R(),r),r,void 0,e??{})}return i._$AI(s),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const I=globalThis;class N extends S{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=zt(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return E}}N._$litElement$=!0,N.finalized=!0,I.litElementHydrateSupport?.({LitElement:N});const Ht=I.litElementPolyfillSupport;Ht?.({LitElement:N});(I.litElementVersions??(I.litElementVersions=[])).push("4.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const qt=s=>(t,e)=>{e!==void 0?e.addInitializer(()=>{customElements.define(s,t)}):customElements.define(s,t)};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Lt={attribute:!0,type:String,converter:q,reflect:!1,hasChanged:B},Dt=(s=Lt,t,e)=>{const{kind:o,metadata:i}=e;let r=globalThis.litPropertyMetadata.get(i);if(r===void 0&&globalThis.litPropertyMetadata.set(i,r=new Map),o==="setter"&&((s=Object.create(s)).wrapped=!0),r.set(e.name,s),o==="accessor"){const{name:a}=e;return{set(c){const n=t.get.call(this);t.set.call(this,c),this.requestUpdate(a,n,s,!0,c)},init(c){return c!==void 0&&this.C(a,void 0,s,c),c}}}if(o==="setter"){const{name:a}=e;return function(c){const n=this[a];t.call(this,c),this.requestUpdate(a,n,s,!0,c)}}throw Error("Unsupported decorator location: "+o)};function Gt(s){return(t,e)=>typeof e=="object"?Dt(s,t,e):((o,i,r)=>{const a=i.hasOwnProperty(r);return i.constructor.createProperty(r,o),a?Object.getOwnPropertyDescriptor(i,r):void 0})(s,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function m(s){return Gt({...s,state:!0,attribute:!1})}class Vt{async getItem(t){return localStorage.getItem(t)}async setItem(t,e){try{localStorage.setItem(t,e)}catch(o){console.error("[BrowserStorage] Storage lleno o no disponible",o)}}async removeItem(t){localStorage.removeItem(t)}}const rt="__abrazo_master_key";class Kt{constructor(t){this.baseStorage=t,this.keyPromise=null}async getItem(t){const e=await this.baseStorage.getItem(t);if(!e)return null;try{const o=nt(e),i=o.slice(0,12),r=o.slice(12),a=await this.getKey(),c=await crypto.subtle.decrypt({name:"AES-GCM",iv:i},a,r);return new TextDecoder().decode(c)}catch(o){return console.error("[SecureStorage] No se pudo desencriptar",t,o),null}}async setItem(t,e){try{const o=await this.getKey(),i=crypto.getRandomValues(new Uint8Array(12)),r=await crypto.subtle.encrypt({name:"AES-GCM",iv:i},o,new TextEncoder().encode(e)),a=new Uint8Array(i.length+r.byteLength);a.set(i,0),a.set(new Uint8Array(r),i.length),await this.baseStorage.setItem(t,at(a))}catch(o){console.error("[SecureStorage] Error cifrando",t,o)}}async removeItem(t){await this.baseStorage.removeItem(t)}getKey(){return this.keyPromise||(this.keyPromise=this.loadOrCreateKey()),this.keyPromise}async loadOrCreateKey(){const t=await this.baseStorage.getItem(rt);if(t){const i=nt(t);return crypto.subtle.importKey("raw",i,{name:"AES-GCM"},!1,["encrypt","decrypt"])}const e=await crypto.subtle.generateKey({name:"AES-GCM",length:256},!0,["encrypt","decrypt"]),o=await crypto.subtle.exportKey("raw",e);return await this.baseStorage.setItem(rt,at(new Uint8Array(o))),e}}function at(s){let t="";for(let e=0;e<s.length;e++)t+=String.fromCharCode(s[e]);return btoa(t)}function nt(s){const t=atob(s),e=new Uint8Array(t.length);for(let o=0;o<t.length;o++)e[o]=t.charCodeAt(o);return e}class g{constructor(){this.events={}}static getInstance(){return g.instance||(g.instance=new g),g.instance}on(t,e){this.events[t]||(this.events[t]=[]),this.events[t].push(e)}off(t,e){this.events[t]&&(this.events[t]=this.events[t].filter(o=>o!==e))}dispatch(t,e){if(this.events[t])for(const o of this.events[t])o(e)}}class C{constructor(){const t=typeof navigator<"u"?navigator:void 0,e=t?.deviceMemory??2,o=t?.hardwareConcurrency??2;e<=2||o<=2?this.tier="low":e>=6&&o>=6?this.tier="high":this.tier="mid"}static getInstance(){return C.instance||(C.instance=new C),C.instance}}class Bt{constructor(t,e){this.storage=t,this.apiKey=e,this.queue=[],this.isOnline=typeof navigator<"u"&&typeof navigator.onLine=="boolean"?navigator.onLine:!0,typeof window<"u"&&(window.addEventListener("online",()=>{this.isOnline=!0,this.flushQueue()}),window.addEventListener("offline",()=>{this.isOnline=!1})),this.ready=this.loadQueue().then(()=>{if(this.isOnline)return this.flushQueue()})}headers(){const t={"Content-Type":"application/json"};return this.apiKey&&(t.Authorization=`Bearer ${this.apiKey}`),t}async request(t,e,o){if(await this.ready,!this.isOnline)return this.queue.push({url:t,body:e,meta:o}),await this.saveQueue(),!1;try{const i=await fetch(t,{method:"POST",headers:this.headers(),body:JSON.stringify(e)});if(!i.ok)throw new Error(`Server respondió ${i.status}`);return!0}catch{return this.queue.push({url:t,body:e,meta:o}),await this.saveQueue(),!1}}async flushQueue(){if(this.queue.length===0)return;const t=C.getInstance().tier==="low"?3:15,e=this.queue.splice(0,t);for(let o=0;o<e.length;o++){const i=e[o];try{const r=await fetch(i.url,{method:"POST",headers:this.headers(),body:JSON.stringify(i.body)});if(!r.ok)throw new Error(`Server respondió ${r.status}`);g.getInstance().dispatch("network.entregado-tarde",{url:i.url,body:i.body,meta:i.meta})}catch{this.queue.unshift(...e.slice(o));break}}await this.saveQueue()}async saveQueue(){await this.storage.setItem("network-queue",JSON.stringify(this.queue))}async loadQueue(){try{const t=await this.storage.getItem("network-queue");this.queue=t?JSON.parse(t):[]}catch{this.queue=[]}}}const ct=100,Qt=30;class Jt{constructor(t,e="semaforo-historial"){this.storage=t,this.storageKey=e,this.historial=[],this.ready=this.cargarHistorial()}async registrar(t,e){await this.ready;const o={estado:t,timestamp:Date.now(),contexto:e};return this.historial.push(o),this.historial.length>ct&&this.historial.shift(),await this.guardarLocalmente(),g.getInstance().dispatch("semaforo.cambio",o),o}async obtenerHistorial(t){if(await this.ready,!t)return[...this.historial];const e=Date.now()-t*864e5;return this.historial.filter(o=>o.timestamp>e)}async guardarLocalmente(){const t=Date.now()-Qt*864e5,e=this.historial.filter(o=>o.timestamp>t);await this.storage.setItem(this.storageKey,JSON.stringify(e))}async cargarHistorial(){try{const t=await this.storage.getItem(this.storageKey),e=t?JSON.parse(t):[];this.historial=Array.isArray(e)?e.slice(-ct):[]}catch{this.historial=[]}}}const lt=[{texto:"Toma aire por la nariz",duracionMs:4e3,circuloGrande:!0},{texto:"Aguanta el aire",duracionMs:2e3,circuloGrande:!0},{texto:"Suelta el aire despacio",duracionMs:6e3,circuloGrande:!1}];function Wt(s){if(!Number.isInteger(s)||s<0)throw new RangeError("faseEnPaso: el paso debe ser un entero >= 0");return lt[s%lt.length]}const Ft=3e4;class Yt{constructor(t,e="/api/alertas-emergencia",o){this.storage=t,this.alertUrl=e,this.lastActivated=0,this.lastConfirmado=!1,this.protocolo=null,this.enviando=null,this.network=new Bt(t,o),this.ready=this.cargarProtocolo(),g.getInstance().on("semaforo.cambio",i=>{i?.estado==="rojo"&&console.log("[Emergencia] Semáforo en rojo detectado. No se activa la alerta automáticamente: se requiere confirmación explícita del usuario en el modal.")}),g.getInstance().on("network.entregado-tarde",i=>{if(i?.meta?.tipo!=="alerta-emergencia")return;this.lastConfirmado=!0;const r=i.meta.contactos??[];g.getInstance().dispatch("emergencia.confirmado-tarde",{contactos:r})})}async configurarProtocolo(t){await this.ready,this.protocolo=t,await this.storage.setItem("emergencia-protocolo",JSON.stringify(t))}async tieneProtocoloConfigurado(){return await this.ready,!!this.protocolo&&this.protocolo.contactos.length>0}async obtenerProtocolo(){return await this.ready,this.protocolo}async activar(){if(await this.ready,this.enviando)return this.enviando;const t=Date.now();if(this.lastConfirmado&&t-this.lastActivated<Ft)return{canal:"cooldown",confirmado:!0};if(!this.protocolo||this.protocolo.contactos.length===0)return{canal:"sin-configurar",confirmado:!1};const e=this.protocolo.contactos,o=this.protocolo.mensajeSMS;this.lastActivated=t,this.enviando=this.enviarAhora(e,o,t);try{return await this.enviando}finally{this.enviando=null}}async enviarAhora(t,e,o){const i=await this.network.request(this.alertUrl,{contactos:t.map(r=>({nombre:r.nombre,telefono:r.telefono})),timestamp:o},{tipo:"alerta-emergencia",contactos:t});this.lastConfirmado=i;for(const r of t){const a=e.replace("{nombre}",r.nombre);this.intentarCanalesDirectos(r.telefono,a)}return{canal:"red",confirmado:i}}intentarCanalesDirectos(t,e){if(!(typeof window>"u")){try{window.location.href=`sms:${t}?body=${encodeURIComponent(e)}`}catch(o){console.warn("[Emergencia] No se pudo abrir la app de SMS",o)}if(typeof navigator<"u"&&navigator.onLine)try{window.open(`https://wa.me/${t}?text=${encodeURIComponent(e)}`,"_blank")}catch(o){console.warn("[Emergencia] No se pudo abrir WhatsApp",o)}}}async cargarProtocolo(){try{const t=await this.storage.getItem("emergencia-protocolo");this.protocolo=t?JSON.parse(t):null}catch{this.protocolo=null}}}const gt=[{id:"hambre",texto:"Tengo hambre",arasaacId:35559},{id:"sed",texto:"Tengo sed",arasaacId:7273},{id:"dolor",texto:"Me duele",arasaacId:2367},{id:"cansado",texto:"Estoy cansado/a",arasaacId:35537},{id:"bano",texto:"Necesito ir al baño",arasaacId:6929},{id:"solo",texto:"Necesito estar solo/a",arasaacId:7253}];function dt(s){return`https://api.arasaac.org/v1/pictograms/${s}`}function Zt(s){return gt.find(t=>t.id===s)}var Xt=Object.defineProperty,te=Object.getOwnPropertyDescriptor,f=(s,t,e,o)=>{for(var i=o>1?void 0:o?te(t,e):t,r=s.length-1,a;r>=0;r--)(a=s[r])&&(i=(o?a(t,e,i):a(i))||i);return o&&i&&Xt(t,e,i),i};let p=class extends N{constructor(){super(),this.vista="principal",this.feedbackMsg="",this.showEmergencyConfirm=!1,this.tieneContacto=!1,this.nombresGuardados=[],this.nombreContacto="",this.telefonoContacto="",this.nombreContacto2="",this.telefonoContacto2="",this.vibracionActivada=!1,this.textoRespiracion="",this.circuloGrande=!1,this.simboloSeleccionadoId=null,this.onConfirmacionTardia=e=>{const o=e.contactos.map(i=>i.nombre).join(" y ");this.feedbackMsg=`Aviso a ${o||"tu adulto"} confirmado (se envió apenas volvió la conexión).`,this._vibrar([100,50,200])};const s=new Kt(new Vt),t=void 0;this.semaforo=new Jt(s),this.emergencia=new Yt(s,void 0,t)}connectedCallback(){super.connectedCallback(),this.vibracionActivada=localStorage.getItem("abrazo-pref-vibracion")==="1",this.emergencia.obtenerProtocolo().then(s=>{s&&s.contactos.length>0&&(this.tieneContacto=!0,this.nombresGuardados=s.contactos.map(t=>t.nombre),this.nombreContacto=s.contactos[0].nombre,this.telefonoContacto=s.contactos[0].telefono,s.contactos[1]&&(this.nombreContacto2=s.contactos[1].nombre,this.telefonoContacto2=s.contactos[1].telefono))}),g.getInstance().on("emergencia.confirmado-tarde",this.onConfirmacionTardia)}disconnectedCallback(){super.disconnectedCallback(),this._detenerRespiracion(),g.getInstance().off("emergencia.confirmado-tarde",this.onConfirmacionTardia)}render(){return y`
      <div class="contenedor">
        <div class="header-row">
          <button
            class="boton-config"
            aria-label="Ajustes (para un adulto)"
            @click=${()=>this._cambiarVista(this.vista==="ajustes"?"principal":"ajustes")}
          >
            ⚙️
          </button>
        </div>

        <div class="titulo">🫂 Abrazo</div>

        ${!this.tieneContacto&&this.vista==="principal"?y`<div class="aviso-sin-config">
              Falta elegir a quién avisar. Pide a un adulto que toque el botón ⚙️ de arriba.
            </div>`:""}

        ${this.vista==="principal"?this._renderPrincipal():""}
        ${this.vista==="ajustes"?this._renderAjustes():""}
        ${this.vista==="calma"?this._renderCalma():""}
        ${this.vista==="necesidad"?this._renderNecesidad():""}

        <div class="feedback" role="status" aria-live="polite">${this.feedbackMsg}</div>

        ${this.showEmergencyConfirm?y`
              <div class="modal-overlay" @click=${this._cancelarEmergencia}>
                <div class="modal-content" @click=${s=>s.stopPropagation()}>
                  <p>¿Quieres avisar a ${this.nombresGuardados.join(" y ")||"tu adulto"}?</p>
                  <button class="confirm-btn" @click=${this._pedirAbrazo}>Sí, avisar</button>
                  <button class="cancel-btn" @click=${this._cancelarEmergencia}>No, volver</button>
                </div>
              </div>
            `:""}
      </div>
    `}_renderPrincipal(){return y`
      <button class="boton-principal boton-abrazo" @click=${this._confirmarEmergencia}>
        <span class="icono">🫂</span> Necesito un abrazo
      </button>

      <button class="boton-principal" @click=${()=>this._cambiarVista("calma")}>
        <span class="icono">🌬️</span> Ayúdame a calmarme
      </button>

      <button class="boton-principal" @click=${()=>this._cambiarVista("necesidad")}>
        <span class="icono">💬</span> Quiero decir algo
      </button>

      <div class="semaforo" role="group" aria-label="¿Cómo te sientes?">
        <div class="opcion-semaforo">
          <button
            class="boton-semaforo"
            style="background: var(--verde-suave)"
            aria-label="Me siento bien"
            @click=${()=>this._registrar("verde")}
          >
            🙂
          </button>
          <span class="etiqueta-semaforo">Bien</span>
        </div>
        <div class="opcion-semaforo">
          <button
            class="boton-semaforo"
            style="background: var(--amarillo-suave)"
            aria-label="Me siento más o menos"
            @click=${()=>this._registrar("amarillo")}
          >
            😐
          </button>
          <span class="etiqueta-semaforo">Más o menos</span>
        </div>
        <div class="opcion-semaforo">
          <button
            class="boton-semaforo"
            style="background: var(--rojo-suave)"
            aria-label="Me siento mal"
            @click=${()=>this._registrar("rojo")}
          >
            🙁
          </button>
          <span class="etiqueta-semaforo">Mal</span>
        </div>
      </div>
    `}_renderAjustes(){return y`
      <div class="form-config">
        <p style="margin: 0; font-weight: 600;">Ajustes (para un adulto)</p>
        <label for="nombre">¿A quién avisamos si el niño pide un abrazo?</label>
        <input
          id="nombre"
          type="text"
          placeholder="Nombre (ej: Mamá)"
          .value=${this.nombreContacto}
          @input=${s=>this.nombreContacto=s.target.value}
        />
        <input
          type="tel"
          placeholder="Teléfono (ej: 5491122334455)"
          .value=${this.telefonoContacto}
          @input=${s=>this.telefonoContacto=s.target.value}
        />

        <hr class="separador-config" />
        <p class="subtitulo-config">
          Segundo contacto (opcional). Si se completa, también recibe el aviso.
        </p>
        <input
          type="text"
          placeholder="Nombre (opcional)"
          .value=${this.nombreContacto2}
          @input=${s=>this.nombreContacto2=s.target.value}
        />
        <input
          type="tel"
          placeholder="Teléfono (opcional)"
          .value=${this.telefonoContacto2}
          @input=${s=>this.telefonoContacto2=s.target.value}
        />

        <hr class="separador-config" />
        <label class="fila-check">
          <input
            type="checkbox"
            .checked=${this.vibracionActivada}
            @change=${s=>this._toggleVibracion(s.target.checked)}
          />
          Vibración al tocar botones (apagada por defecto)
        </label>
        <button class="guardar-btn" @click=${this._guardarContacto}>Guardar</button>
        <button class="cancel-btn" @click=${()=>this._cambiarVista("principal")}>Volver</button>
      </div>
    `}_renderCalma(){return y`
      <div class="pantalla-calma">
        <div class="circulo-respiracion ${this.circuloGrande?"grande":""}"></div>
        <div class="texto-respiracion" role="status" aria-live="polite">${this.textoRespiracion}</div>
        <button class="cancel-btn" style="width: 100%;" @click=${()=>this._cambiarVista("principal")}>
          Volver
        </button>
      </div>
    `}_renderNecesidad(){const s=this.simboloSeleccionadoId?Zt(this.simboloSeleccionadoId):void 0;return s?y`
        <div class="pantalla-necesidad-detalle">
          <img
            class="imagen-simbolo-grande"
            src=${dt(s.arasaacId)}
            alt=${s.texto}
          />
          <div class="texto-simbolo-grande">${s.texto}</div>
          <button
            class="cancel-btn"
            style="width: 100%;"
            @click=${()=>this.simboloSeleccionadoId=null}
          >
            Volver a los símbolos
          </button>
        </div>
      `:y`
      <div class="grilla-simbolos" role="group" aria-label="¿Qué necesitás decir?">
        ${gt.map(t=>y`
            <button
              class="boton-simbolo"
              @click=${()=>this.simboloSeleccionadoId=t.id}
            >
              <img
                class="imagen-simbolo"
                src=${dt(t.arasaacId)}
                alt=${t.texto}
              />
              <span class="texto-simbolo">${t.texto}</span>
            </button>
          `)}
      </div>
      <p class="atribucion-arasaac">
        Símbolos: ARASAAC (arasaac.org), autor Sergio Palao, © Gobierno de Aragón — CC BY-NC-SA.
        Necesitan conexión a internet para cargar.
      </p>
      <button class="cancel-btn" style="width: 100%;" @click=${()=>this._cambiarVista("principal")}>
        Volver
      </button>
    `}_cambiarVista(s){this._detenerRespiracion(),this.feedbackMsg="",this.simboloSeleccionadoId=null,this.vista=s,s==="calma"&&this._iniciarRespiracion()}_iniciarRespiracion(){let s=0;const t=()=>{const e=Wt(s);this.textoRespiracion=e.texto,this.circuloGrande=e.circuloGrande,s++,this.timerRespiracion=window.setTimeout(t,e.duracionMs)};t()}_detenerRespiracion(){this.timerRespiracion!==void 0&&(clearTimeout(this.timerRespiracion),this.timerRespiracion=void 0),this.textoRespiracion="",this.circuloGrande=!1}_toggleVibracion(s){this.vibracionActivada=s,localStorage.setItem("abrazo-pref-vibracion",s?"1":"0")}async _guardarContacto(){const s=this.nombreContacto.trim(),t=this.telefonoContacto.trim();if(!s||!t){this.feedbackMsg="Falta completar el nombre y el teléfono del primer contacto.";return}const e=[{nombre:s,telefono:t,relacion:"contacto principal"}],o=this.nombreContacto2.trim(),i=this.telefonoContacto2.trim();if(o||i){if(!o||!i){this.feedbackMsg="El segundo contacto necesita nombre Y teléfono, o dejar ambos vacíos.";return}e.push({nombre:o,telefono:i,relacion:"contacto secundario"})}await this.emergencia.configurarProtocolo({contactos:e,mensajeSMS:"Hola {nombre}. Te aviso desde la app Abrazo: necesito que vengas."}),this.tieneContacto=!0,this.nombresGuardados=e.map(r=>r.nombre),this._cambiarVista("principal"),this.feedbackMsg=`Guardado. Si el niño toca "Necesito un abrazo", el aviso llega a ${this.nombresGuardados.join(" y ")}.`}_vibrar(s){this.vibracionActivada&&navigator.vibrate&&navigator.vibrate(s)}_confirmarEmergencia(){if(this._vibrar(50),!this.tieneContacto){this.feedbackMsg="Todavía no hay nadie configurado para avisar.";return}this.showEmergencyConfirm=!0}_cancelarEmergencia(){this.showEmergencyConfirm=!1}async _pedirAbrazo(){this.showEmergencyConfirm=!1,this.feedbackMsg="Enviando el aviso...",await this.updateComplete;const s=await this.emergencia.activar(),t=this.nombresGuardados.join(" y ")||"tu adulto";s.canal==="cooldown"?this.feedbackMsg=`El aviso ya fue enviado a ${t} hace un momento.`:s.canal==="sin-configurar"?this.feedbackMsg="Falta elegir a quién avisar. Pide a un adulto que toque el botón ⚙️.":s.confirmado?this.feedbackMsg=`Aviso enviado a ${t}.`:this.feedbackMsg="No se pudo enviar el aviso todavía (se reintentará solo apenas haya conexión). Puedes tocar el botón otra vez, o buscar a un adulto cerca.",this._vibrar([100,50,200])}async _registrar(s){await this.semaforo.registrar(s),s==="rojo"?this.feedbackMsg="Guardado: te sientes mal.":s==="amarillo"?this.feedbackMsg="Guardado: te sientes más o menos.":this.feedbackMsg="Guardado: te sientes bien.",this._vibrar(30)}};p.styles=yt`
    :host {
      display: block;
      font-family: system-ui, -apple-system, sans-serif;
      /* Paleta de baja saturación a propósito (guía: colores simples y calmados) */
      --verde-suave: #b9d8b7;
      --amarillo-suave: #f0dfae;
      --rojo-suave: #eab8b6;
      --texto: #2f3437;
      --texto-suave: #5c6468;
      color: var(--texto);
    }
    .contenedor {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 24px;
      max-width: 420px;
      margin: 0 auto;
      min-height: 100vh;
      box-sizing: border-box;
      justify-content: center;
      background: #fbfaf7;
    }
    .header-row {
      display: flex;
      justify-content: flex-end;
      margin-bottom: -8px;
    }
    .boton-config {
      background: transparent;
      border: none;
      font-size: 1.3rem;
      cursor: pointer;
      padding: 8px;
    }
    .titulo {
      font-size: 1.8rem;
      text-align: center;
      margin-bottom: 4px;
    }
    .aviso-sin-config {
      text-align: center;
      font-size: 0.85rem;
      color: #7a5b18;
      background: #f7efd9;
      border-radius: 10px;
      padding: 10px;
    }
    .boton-principal {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-size: 1.1rem;
      padding: 18px;
      border-radius: 16px;
      border: 1px solid #d8d5cd;
      background: #f2f0ea;
      color: var(--texto);
      cursor: pointer;
      min-height: 56px;
    }
    .boton-abrazo {
      background: var(--rojo-suave);
      border-color: #d49a98;
      font-weight: 600;
    }
    .icono {
      font-size: 1.4rem;
    }
    .semaforo {
      display: flex;
      justify-content: center;
      gap: 18px;
      margin-top: 8px;
    }
    .opcion-semaforo {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    .boton-semaforo {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: 2px solid rgba(0, 0, 0, 0.12);
      font-size: 1.6rem;
      cursor: pointer;
    }
    .etiqueta-semaforo {
      font-size: 0.85rem;
      color: var(--texto-suave);
    }
    .feedback {
      text-align: center;
      min-height: 24px;
      font-size: 0.95rem;
      color: var(--texto);
      background: #f2f0ea;
      border-radius: 10px;
      padding: 10px;
    }
    .feedback:empty {
      background: transparent;
      padding: 0;
    }
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-content {
      background: #fbfaf7;
      border-radius: 16px;
      padding: 24px;
      max-width: 320px;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .confirm-btn {
      background: var(--rojo-suave);
      color: var(--texto);
      border: 1px solid #d49a98;
      border-radius: 12px;
      padding: 14px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
    }
    .cancel-btn {
      background: transparent;
      border: 1px solid #c9c6be;
      color: var(--texto);
      border-radius: 12px;
      padding: 12px;
      cursor: pointer;
    }
    .form-config {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .form-config label {
      font-size: 0.9rem;
      color: var(--texto-suave);
    }
    .form-config input[type='text'],
    .form-config input[type='tel'] {
      padding: 12px;
      border-radius: 10px;
      border: 1px solid #c9c6be;
      font-size: 1rem;
      background: white;
    }
    .separador-config {
      border: none;
      border-top: 1px solid #e3e0d8;
      margin: 6px 0;
    }
    .subtitulo-config {
      margin: 0;
      font-size: 0.85rem;
      color: var(--texto-suave);
    }
    .fila-check {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.95rem;
    }
    .guardar-btn {
      background: var(--verde-suave);
      color: var(--texto);
      border: 1px solid #97bd95;
      border-radius: 12px;
      padding: 14px;
      font-size: 1rem;
      cursor: pointer;
    }
    .pantalla-calma {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      padding: 16px 0;
    }
    .circulo-respiracion {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: var(--verde-suave);
      border: 2px solid #97bd95;
      transition: transform 4s ease-in-out;
      transform: scale(1);
    }
    .circulo-respiracion.grande {
      transform: scale(1.35);
    }
    @media (prefers-reduced-motion: reduce) {
      .circulo-respiracion {
        transition: none;
        transform: none !important;
      }
    }
    .texto-respiracion {
      font-size: 1.2rem;
      min-height: 32px;
      text-align: center;
    }
    .grilla-simbolos {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .boton-simbolo {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 10px;
      border-radius: 14px;
      border: 1px solid #d8d5cd;
      background: #f2f0ea;
      cursor: pointer;
      min-height: 96px;
    }
    .imagen-simbolo {
      width: 64px;
      height: 64px;
      object-fit: contain;
    }
    .texto-simbolo {
      font-size: 0.85rem;
      text-align: center;
      color: var(--texto);
    }
    .atribucion-arasaac {
      font-size: 0.7rem;
      color: var(--texto-suave);
      text-align: center;
      margin: 4px 0 0;
    }
    .pantalla-necesidad-detalle {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 16px 0;
    }
    .imagen-simbolo-grande {
      width: 180px;
      height: 180px;
      object-fit: contain;
    }
    .texto-simbolo-grande {
      font-size: 1.5rem;
      font-weight: 600;
      text-align: center;
    }
  `;f([m()],p.prototype,"vista",2);f([m()],p.prototype,"feedbackMsg",2);f([m()],p.prototype,"showEmergencyConfirm",2);f([m()],p.prototype,"tieneContacto",2);f([m()],p.prototype,"nombresGuardados",2);f([m()],p.prototype,"nombreContacto",2);f([m()],p.prototype,"telefonoContacto",2);f([m()],p.prototype,"nombreContacto2",2);f([m()],p.prototype,"telefonoContacto2",2);f([m()],p.prototype,"vibracionActivada",2);f([m()],p.prototype,"textoRespiracion",2);f([m()],p.prototype,"circuloGrande",2);f([m()],p.prototype,"simboloSeleccionadoId",2);p=f([qt("pantalla-abrazo")],p);
