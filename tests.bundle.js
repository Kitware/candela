var context;

context = require.context('./src/core', true, /\.js$/);
context.keys().forEach(context);

context = require.context('./src/components', true, /\.js$/);
context.keys().forEach(context);

context = require.context('./src', false, /\.js$/);
context.keys().forEach(context);
