const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 3000;

router.render = (req, res) => {
    res.jsonp({
        data: res.locals.data,
        maxCount: 102,
    })
}
server.use(middlewares);
server.use(router);
server.listen(port);
