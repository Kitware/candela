// For some reason, we can't store the paths in a list variable and then
// iterate. It sounds crazy but it just won't work. Hence, we manually unroll
// the would-be loop instead.

var context;
//context = require.context('./packages', true, /^((?!image).)*\.js$/);
//context.keys().forEach(context);

context = require.context('./test', true, /^((?!image).)*\.js$/);
context.keys().forEach(context);

context = require.context('./util', true, /^((?!image).)*\.js$/);
context.keys().forEach(context);

context = require.context('./VisComponent', true, /^((?!image).)*\.js$/);
context.keys().forEach(context);
