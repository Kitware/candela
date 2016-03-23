var context = require.context('./src/candela', true, /\.js$/);
context.keys().forEach(context);
