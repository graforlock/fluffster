function State(t){return this instanceof State?(this.state=t,this._stream$=kefir.pool(),this.initState=t,this.subscribers=[],this.subscribe(function(t){this._stream$.plug(kefir.stream(function(e){return e.emit(t)}))}.bind(this)),this.updateState=function(t){var e=this.state;utils.extend(e,t),utils.compareTo(e,this.state)&&(this.state=e,this.notify(e))}.bind(this),this.notify(),void 0):new State(t)}var utils=require("./utils"),kefir=require("kefir");State.prototype.notify=function(t){t=t||this.state;for(var e=0;e<this.subscribers.length;e++)this.subscribers[e](t)},State.prototype.subscribe=function(t){this.subscribers.push(t)},State.prototype.stream=function(){return this._stream$},State.prototype.resetState=function(){this.updateState(this.initState)},State.prototype.bindState=function(t){for(var e=0;e<t.length;e++)t[e].subscribe(this._stream$)},module.exports=State;