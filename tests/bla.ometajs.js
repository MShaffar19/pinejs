{var L=exports.L=objectThatDelegatesTo(OMeta,{
"number":function(){var $elf=this,_fromIdx=this.input.idx;return this._many1((function(){return this._apply("digit")}))},
"addExpr":function(){var $elf=this,_fromIdx=this.input.idx;return this._or((function(){return (function(){this._apply("addExpr");this._applyWithArgs("exactly","+");return this._apply("mulExpr")}).call(this)}),(function(){return (function(){this._apply("addExpr");this._applyWithArgs("exactly","-");return this._apply("mulExpr")}).call(this)}),(function(){return this._apply("mulExpr")}))},
"mulExpr":function(){var $elf=this,_fromIdx=this.input.idx;return this._or((function(){return (function(){this._apply("mulExpr");this._applyWithArgs("exactly","*");return this._apply("primExpr")}).call(this)}),(function(){return (function(){this._apply("mulExpr");this._applyWithArgs("exactly","/");return this._apply("primExpr")}).call(this)}),(function(){return this._apply("primExpr")}))},
"primExpr":function(){var $elf=this,_fromIdx=this.input.idx;return this._or((function(){return (function(){switch(this._apply('anything')){case "(":return (function(){this._apply("expr");return this._applyWithArgs("exactly",")")}).call(this);default: throw fail}}).call(this)}),(function(){return this._apply("number")}))},
"expr":function(){var $elf=this,_fromIdx=this.input.idx;return this._apply("addExpr")}});for(var i = undefined,l = (100);i++;(i < l)){console.log(i)}var re1 = /bla/,re2 = /\//g,re3 = /\/\//gi,s = "\u0430\u0431\u0432"}
