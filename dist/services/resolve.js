function matchURI(e,r){var t=[],o=toRegex(e,t),n=o.exec(r);if(!n)return null;for(var a=Object.create(null),u=1;u<n.length;u++)a[t[u-1].name]=void 0!==n[u]?n[u]:void 0;return a}function Resolve(e,r){return new Promise(function(t,o){for(var n=0;n<e.length;n++){var a=e[n],u=Object.keys(a)[0],i=r.error?"/error":r.pathname,v=matchURI(u,i);if(v){var l=a;if(l[u].appState.params=v,l)return t(l[u])}}var c=new Error("Not found");return c.status=404,o(c)})}var toRegex=require("path-to-regexp"),Promise=require("bluebird");module.exports=Resolve;