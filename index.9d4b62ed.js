!function(){function e(e,t,n,s){Object.defineProperty(e,t,{get:n,set:s,enumerable:!0,configurable:!0})}var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},n={},s={},i=t.parcelRequire9a78;function r(e){"suspended"===e.state&&e.resume()}null==i&&((i=function(e){if(e in n)return n[e].exports;if(e in s){let t=s[e];delete s[e];let i={id:e,exports:{}};return n[e]=i,t.call(i.exports,i,i.exports),i.exports}var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}).register=function(e,t){s[e]=t},t.parcelRequire9a78=i),i.register("3OOJ5",(function(t,n){var s,i;e(t.exports,"resolve",(()=>i),(e=>i=e)),e(t.exports,"register",(()=>s),(e=>s=e));var r={};s=function(e){for(var t=Object.keys(e),n=0;n<t.length;n++)r[t[n]]=e[t[n]]},i=function(e){var t=r[e];if(null==t)throw new Error("Could not resolve bundle with id "+e);return t}})),i("3OOJ5").register(JSON.parse('{"3SFso":"index.9d4b62ed.js","6HdLu":"quiet.a1692c74.wasm","246eR":"quiet.worklet.dd17454f.js"}'));function o(e,t){const n=e.exports.stackAlloc(t.length);return new Int8Array(e.exports.memory.buffer).set(t,n),n}function a(e,t){return o(e,(t+"\0").split("").map((e=>e.charCodeAt(0))))}const c=16384;class u{constructor(e,t){this.destroyed=!1,this.audioContext=e,this.instance=t}selectProfile(e,t){const n=this.instance.exports.stackSave(),s=a(this.instance,JSON.stringify({profile:e})),i=a(this.instance,"profile"),r=this.instance.exports.quiet_encoder_profile_str(s,i);return this.encoder=this.instance.exports.quiet_encoder_create(r,this.audioContext.sampleRate),this.instance.exports.free(r),this.frameLength=t?this.instance.exports.quiet_encoder_clamp_frame_len(this.encoder,c):this.instance.exports.quiet_encoder_get_frame_len(this.encoder),this.samples=function(e,t){const n=t.exports.malloc(4*e);return{pointer:n,view:new Float32Array(t.exports.memory.buffer).subarray(n/4,n/4+e)}}(c,this.instance),this.instance.exports.stackRestore(n),this}async transmit(e){const t=this.instance.exports.stackSave();r(this.audioContext);const n=function(e,t){const n=[];for(let s=0;s<e.byteLength;s+=t){const i=e.slice(s,s+t);n.push(i)}return n}(e,this.frameLength);let s=this.audioContext.currentTime;for(const e of n){const t=this.audioContext.createBuffer(1,c,this.audioContext.sampleRate),n=o(this.instance,new Uint8Array(e));this.instance.exports.quiet_encoder_send(this.encoder,n,e.byteLength);for(let e=this.instance.exports.quiet_encoder_emit(this.encoder,this.samples.pointer,c);e<c;e+=1)this.samples.view[e]=0;t.copyToChannel(this.samples.view,0,0);const i=new AudioBufferSourceNode(this.audioContext);i.buffer=t,i.connect(this.audioContext.destination),i.start(s),s+=t.duration}var i;return this.instance.exports.stackRestore(t),await(i=s-this.audioContext.currentTime,new Promise((e=>setTimeout(e,1e3*i)))),this}destroy(){return this.destroyed||(this.instance.exports.free(this.samples.pointer),this.instance.exports.quiet_encoder_destroy(this.encoder),this.destroyed=!0),this}}var l={env:{__sys_getpid:()=>null},wasi_snapshot_preview1:{proc_exit:()=>null,clock_time_get:()=>null,fd_close:()=>null,fd_write:()=>null,fd_seek:()=>null,fd_read:()=>null}};i.register("1zfc2",(function(e,t){e.exports=i("31oBo").getBundleURL()+i("3XRD4")("3SFso","6HdLu")})),i.register("31oBo",(function(t,n){var s;e(t.exports,"getBundleURL",(()=>s),(e=>s=e));var i=null;function r(e){return(""+e).replace(/^((?:https?|file|ftp):\/\/.+)\/[^/]+$/,"$1")+"/"}s=function(){return i||(i=function(){try{throw new Error}catch(t){var e=(""+t.stack).match(/(https?|file|ftp):\/\/[^)\n]+/g);if(e)return r(e[0])}return"/"}()),i}})),i.register("3XRD4",(function(e,t){"use strict";var n=i("3OOJ5").resolve;function s(e){if(""===e)return".";var t="/"===e[e.length-1]?e.slice(0,e.length-1):e,n=t.lastIndexOf("/");return-1===n?".":t.slice(0,n)}function r(e,t){if(e===t)return"";var n=e.split("/");"."===n[0]&&n.shift();var s,i,r=t.split("/");for("."===r[0]&&r.shift(),s=0;(s<r.length||s<n.length)&&null==i;s++)n[s]!==r[s]&&(i=s);var o=[];for(s=0;s<n.length-i;s++)o.push("..");return r.length>i&&o.push.apply(o,r.slice(i)),o.join("/")}e.exports=function(e,t){return r(s(n(e)),n(t))},e.exports._dirname=s,e.exports._relative=r})),i.register("6bYiq",(function(e,t){e.exports=i("31oBo").getBundleURL()+i("3XRD4")("3SFso","246eR")}));var d={checksum_scheme:"crc32",inner_fec_scheme:"v27",outer_fec_scheme:"none",mod_scheme:"gmsk",frame_length:25,modulation:{center_frequency:4200,gain:.15},interpolation:{shape:"kaiser",samples_per_symbol:10,symbol_delay:4,excess_bandwidth:.35},encoder_filters:{dc_filter_alpha:.01},resampler:{delay:13,bandwidth:.45,attenuation:60,filter_bank_size:64}},h=class{constructor(e,t){this.audioContext=e,this.profile=t}async init(){if(this.quietWasmBytes=await fetch(i("1zfc2")).then((e=>e.arrayBuffer())),this.instance=(await WebAssembly.instantiate(this.quietWasmBytes,l)).instance,"undefined"!=typeof window){const{audioWorklet:e}=this.audioContext;await e.addModule(i("6bYiq")),this.quietProcessorNode=new AudioWorkletNode(this.audioContext,"quiet-processor-node",{processorOptions:{quietWasmBytes:this.quietWasmBytes,profile:this.profile,sampleRate:this.audioContext.sampleRate}})}return this}async transmit({payload:e,clampFrame:t}){var n;(await new u(this.audioContext,this.instance).selectProfile(this.profile,t).transmit((n=e,(new TextEncoder).encode(n)))).destroy()}async receive(e){this.audioStream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:!1}});this.audioContext.createMediaStreamSource(this.audioStream).connect(this.quietProcessorNode).port.onmessage=t=>e(t.data),r(this.audioContext)}};const f=new AudioContext;!async function(){const e=await new h(f,d).init();document.querySelector("#audible-text").addEventListener("submit",(t=>{const{value:n}=t.target.querySelector("textarea");var s;s=n,e.transmit({clampFrame:!1,payload:s}),t.preventDefault()}));const t=document.querySelector("#received-text");document.querySelector("#start-listening").addEventListener("click",(()=>{e.receive((e=>{t.innerHTML+=e.value}))}))}()}();
//# sourceMappingURL=index.9d4b62ed.js.map
