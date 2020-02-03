var StaticServer = require('static-server');
var path = require('path');
console.log(path.join(__dirname, './build/'));
var server = new StaticServer({
  rootPath: path.join(__dirname, './build/web-desktop/'),            // required, the root of the server file tree
  port: 3000,               // required, the port to listen
  name: 'demo',   // optional, will set "X-Powered-by" HTTP header
  cors: '*',                // optional, defaults to undefined
  followSymlink: true,      // optional, defaults to a 404 error
  templates: {
    index: 'index.html',      // optional, defaults to 'index.html'
    notFound: '404.html'    // optional, defaults to undefined
  }
});
 
server.start(function () {
  console.log('Server listening to', server.port);
});