import config
import simplejson as json
import tornado.ioloop, tornado.web

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")

class DatalistHandler(tornado.web.RequestHandler):
    def get(self):
        with open('data/datalist.json') as input:
            # datalist = json.loads(input.read())
            self.write(input.read())

class DataHandler(tornado.web.RequestHandler):
    def get(self):
        datasetName = self.get_argument("datasetName")
        datasetFilePath = 'data/' + datasetName + '.json'
        with open(datasetFilePath, 'r') as datasetFile:
            self.write(datasetFile.read())
        
class ParamsHandler(tornado.web.RequestHandler):
    def get(self):
        method = self.get_argument("method")
        params = config.Params[method]
        self.write(json.dumps(params))

application = tornado.web.Application(
            [(r"/", MainHandler),
             (r"/params", ParamsHandler),
             (r"/datalist", DatalistHandler),
             (r"/loadData", DataHandler),
             (r"/static/(.*)", tornado.web.StaticFileHandler, {"path": "static"}),
             (r"/lib/(.*)", tornado.web.StaticFileHandler, {"path": "lib"}), 
             (r"/data/(.*)", tornado.web.StaticFileHandler, {"path": "data"})
            ]);

if __name__ == '__main__':
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start() 