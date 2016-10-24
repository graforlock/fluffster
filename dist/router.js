var Resolve=require("./services/resolve"),State=require("./fluffster"),history=require("./services/history"),drivers=require("./drivers"),kefir=require("kefir"),StateRouter={store:null,globalState:null,routes:[],defaultErrorHandler:!0,route:function(e){StateRouter.routes.push(e)},driver:function(e){State=drivers[e]()},global:function(e){StateRouter.globalState=kefir.pool(),StateRouter.globalState.plug(kefir.stream(function(t){return t.emit(e)}))},render:function(e){StateRouter.globalState&&(StateRouter.store=new State(e,e.messages,StateRouter.globalState)),StateRouter.store=new State(e,e.messages,null)},sendMessage:function(e,t){StateRouter.store.messages&&StateRouter.store.passMessage(e,t)},router:function(e){Resolve(StateRouter.routes,e).then(StateRouter.render).catch(function(t){console.warn(t),StateRouter.defaultErrorHandler||Resolve(StateRouter.routes,{location:e,error:t}).then(StateRouter.render)})},link:function(e){history.push(e)},listen:function(){StateRouter.router(history.location),history.listen(StateRouter.router)}};module.exports=StateRouter;