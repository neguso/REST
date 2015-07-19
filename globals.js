String.prototype.interpolate = function(props)
{
    return this.replace(/\{(\w+)\}/g, function(match, expr) {
        return props[expr];
    });
};


Function.getParams = function(func) {
  var fnStr = func.toString().replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg, '');
  var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(/([^\s,]+)/g);
  if(result === null)
     result = [];
  return result;
}
