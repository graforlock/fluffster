function ServiceProvider(e){this.provider=this.providerCheck(e)}var utils=require("./utils"),Singleton=utils.Singleton,thennable=utils.thennable;ServiceProvider.prototype.providerCheck=function(e){return{isPromise:thennable(e),_value:e}},ServiceProvider.prototype.then=function(e,r){return this.provider.isPromise?this.provider._value.then(e,r):e(this.provider._value)},module.exports=Singleton(ServiceProvider);