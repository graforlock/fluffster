function ReactDecorator(e){return e.prototype.provide=function(e){this.stream().onValue(function(t){each(e.component,function(r,c){ReactDOM.render(React.createElement(r,t),document.querySelector(e.id[c]))})})},e}var React=require("react"),ReactDOM=require("react-dom"),State=require("./../fluffster"),each=require("./../utils/index").each;module.exports=function(){return ReactDecorator(State)};