var context = require.context('./src', true, /^((?!\.image).)*\.js$/);
context.keys().forEach(context);
