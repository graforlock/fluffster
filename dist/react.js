function ReactDecorator(e){return e.prototype.provide=function(e){this.stream().onValue(function(t){console.log(e.component),each(e.component,function(r,o){ReactDOM.render(React.createElement(r,t),document.querySelector(e.id[o]))})})},e}var React=require("react"),ReactDOM=require("react-dom"),State=require("./fluffster"),each=require("./utils").each;module.exports=ReactDecorator(State);