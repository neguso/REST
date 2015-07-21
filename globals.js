String.prototype.interpolate = function(props)
{
    return this.replace(/\{(\w+)\}/g, function(match, expr) {
        return props[expr];
    });
};
