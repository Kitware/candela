// For some reason, we can't store the paths in a list variable and then
// iterate. It sounds crazy but it just won't work. Hence, we manually unroll
// the would-be loop instead.

var context;
context = require.context('./node_modules/candela/packages', true, /^((?!image).)*\.js$/);
context.keys().forEach(context);

context = require.context('./node_modules/candela/test', true, /^((?!image).)*\.js$/);
context.keys().forEach(context);

context = require.context('./node_modules/candela/util', true, /^((?!image).)*\.js$/);
context.keys().forEach(context);

context = require.context('./node_modules/candela/VisComponent', true, /^((?!image).)*\.js$/);
context.keys().forEach(context);
