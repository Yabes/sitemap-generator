module.exports = {
    parser: {
        isRoute: function(node) {
            function recursiveSearch(node) {
                return (node && node.callee) &&
                    (
                        (node.callee.type === 'MemberExpression' &&
                            node.callee.object.name === '$stateProvider' &&
                            node.callee.property.name === 'state' &&
                            node.arguments.length && [1, 2].indexOf(node.arguments.length) !== -1 &&
                            node.arguments[node.arguments.length - 1].type === 'ObjectExpression') ||
                        recursiveSearch(node.callee.object)
                    )
            }

            return recursiveSearch(node);
        },
        extractRoute: function(node) {
            var stateName = node.arguments[0].value;
            var stateArgs = node.arguments[node.arguments.length - 1].properties;
            var url = stateArgs.filter(function(property) {
                    return property.key.name === 'url';
                })
                .map(function(property) {
                    return property.value.value
                })
                .pop();

            if (stateName.indexOf(".") > 0) {
                url = "/" + stateName.split(".")[0] + url;
            }
            
            return url;
        }
    }
};