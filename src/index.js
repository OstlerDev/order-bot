import WebServer from './WebServer'
import config from '../config.json'

let server = new WebServer()
server.listen(config.webserver.host, config.webserver.port)