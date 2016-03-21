import config
import simplejson as json
import tornado.ioloop, tornado.web

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")

class ParamsHandler(tornado.web.RequestHandler):
    def get(self):
        method = self.get_argument("method")
        params = config.Params[method]
        self.write(json.dumps(params))

application = tornado.web.Application(
            [(r"/", MainHandler),
             (r"/params", ParamsHandler),
             (r"/static/(.*)", tornado.web.StaticFileHandler, {"path": "static"}),
             (r"/lib/(.*)", tornado.web.StaticFileHandler, {"path": "lib"})
            ]);

if __name__ == '__main__':
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start() 