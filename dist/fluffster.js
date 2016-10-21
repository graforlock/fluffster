function State(t,e){return this instanceof State?(this.state=t.appState,this._stream$=kefir.pool(),this.initState=t.appState,this.listeners=[],e&&this.assignMessages(e),this.onNext(function(t){this._stream$.plug(kefir.stream(function(e){return e.emit(t)}))}.bind(this)),this.updateState=function(t){var e=utils.extendMany({},this.state,t);utils.compareTo(this.state,e)||(utils.extend(this.state,t),this.notify())}.bind(this),this.notify(),this.provide(t),void 0):new State(t)}var utils=require("./utils"),kefir=require("kefir");State.prototype.notify=function(t){t=t||this.state;for(var e=0;e<this.listeners.length;e++)this.listeners[e](t)},State.prototype.onNext=function(t){this.listeners.push(t)},State.prototype.stream=function(){return this._stream$},State.prototype.resetState=function(){this.updateState(this.initState)},State.prototype.provide=function(t){utils.each(t.component,function(t){t.subscribe&&t.subscribe(this.stream())}.bind(this))},State.prototype.passMessage=function(t,e){t in this.messages&&this.updateState(this.messages[t](this.state,e))},State.prototype.assignMessages=function(t){this.messages=t},module.exports=State;