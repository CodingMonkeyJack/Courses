import tornado.ioloop, tornado.web

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")

application = tornado.web.Application(
            [(r"/", MainHandler),
             (r"/static/(.*)", tornado.web.StaticFileHandler, {"path": "static"}),
             (r"/lib/(.*)", tornado.web.StaticFileHandler, {"path": "lib"})
            ]);

if __name__ == '__main__':
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start() 