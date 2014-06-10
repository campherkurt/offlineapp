(function(win,ls,doc){function isType(Ctor,val){return val!==undefined&&val!==null&&val.constructor===Ctor;}
function quoteStr(str){return "'"+
String(str)
.replace(/\\/g,'\\\\')
.replace(/'/g,"\\'")
.replace(/\n/g,'\\n')
.replace(/\r/g,'\\r')
.replace(/\t/g,'\\t')+
"'";}
function elementFromHtml(html){var container=doc.createElement('_');container.innerHTML=html;return container.firstChild;}
function HtmlFromElement(el){if(el.outerHTML)return el.outerHTML;var container=doc.createElement('_');container.appendChild(el.cloneNode(true));return container.innerHTML;}
function stringify(val){var callee=arguments.callee,valArr=[],valLen,i=-1,e;if(isType(String,val))return quoteStr(val);if(val===undefined||val===null||isType(Boolean,val)||isType(Number,val)||isType(RegExp,val)||(isType(Function,val)&&!/^function[^\{]+\{\s*\[native code\]/.test(String(val))))return String(val);if(isType(Date,val)){return 'new Date('+val.getTime()+')';}
if(isType(Array,val)){valLen=val.length;while(++i<valLen)valArr.push(callee(val[i]));return '['+valArr+']';}
if(isType(Object,val)){for(e in val)valArr.push(quoteStr(e)+':'+callee(val[e]));return '{'+valArr+'}';}
if(val===win)return 'window';for(e in win)if(val===win[e])return 'window.'+e;for(e in doc)if(val===doc[e])return 'document.'+e;if(val.nodeName)return 'h('+quoteStr(HtmlFromElement(val))+')';}
function unstringify(str){return new Function('var a=arguments;h=a[0];return '+str).apply(win,[elementFromHtml]);}
function extendObject(){var extObj={},arg=arguments,argLen=arg.length,i=-1,e;while(++i<argLen)
if(isType(Object,arg[i]))
for(e in arg[i])
extObj[e]=isType(Object,extObj[e])&&isType(Object,arg[i][e])?arg.callee(extObj[e],arg[i][e]):arg[i][e];return extObj;}
function setAndReturnIfValueChanged(attr,newValue,extend){var rawValue=ls[attr],oldValue;if(extend){oldValue=unstringify(rawValue);if(isType(Array,oldValue))newValue=oldValue.concat(newValue);else if(isType(Boolean,oldValue))newValue=oldValue&&!!newValue;else if(isType(Date,oldValue)&&!isNaN(newValue*1))newValue=new Date(oldValue.getTime()+(newValue*1));else if(isType(Function,oldValue)&&isType(Function,newValue))newValue=new Function('return('+String(oldValue)+').apply(this, arguments)&&('+String(newValue)+').apply(this, arguments)');else if(isType(Number,oldValue)&&!isNaN(newValue*1))newValue=oldValue+(newValue*1);else if(isType(Object,oldValue)&&isType(Object,newValue))newValue=extendObject(oldValue,newValue);else if(isType(RegExp,oldValue)&&isType(RegExp,newValue)){var
regExpMatch=/^\/([\W\w]*)\/([a-z]*?)$/,regExpA=String(oldValue).match(regExpMatch),regExpB=String(newValue).match(regExpMatch);newValue=new RegExp(regExpA[1]+regExpB[1],regExpA[2]+regExpB[2]);}
else if(isType(String,oldValue))newValue=oldValue+String(newValue);else return 2;}
newValue=stringify(newValue);if(rawValue===newValue)return 2;return(ls[attr]=newValue)&&1;}
win.stash={has:function(){var args=[].concat.apply([],arguments),arg,i=-1;while((arg=args[++i]))if(ls[arg]===undefined)return false;return true;},get:function(attr){var args=[].concat.apply([],arguments),arg,i=-1,items={};if(args.length===1)return unstringify(ls[attr]);while((arg=args[++i]))items[arg]=unstringify(ls[arg]);return items;},getAll:function(){var e,items={};for(e in ls)items[e]=ls[e];return items;},set:function(attr,val){var args=[].concat.apply([],arguments),arg,i=-1,e,returnValue=2;if(isType(String,attr))return setAndReturnIfValueChanged(attr,val);while((arg=args[++i]))for(e in arg)returnValue=Math.min(returnValue,setAndReturnIfValueChanged(e,arg[e]));return returnValue;},add:function(attr,val){var args=[].concat.apply([],arguments),arg,i=-1,e,returnValue=2;if(isType(String,attr))return setAndReturnIfValueChanged(attr,val,true);while((arg=args[++i]))for(e in arg)returnValue=Math.min(returnValue,setAndReturnIfValueChanged(e,arg[e],true));return returnValue;},cut:function(attr){var args=[].concat.apply([],arguments),arg,i=-1;while((arg=args[++i]))delete ls[arg];return true;},cutAll:function(){for(var e in ls)delete ls[e];return true;}};})(this,this.localStorage,document);