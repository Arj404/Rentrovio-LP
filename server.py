import http.server
import socketserver
import os

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # If a URL does not have an extension, try serving the .html version
        if not os.path.splitext(self.path)[1]:
            if os.path.exists(self.path[1:] + '.html'):
                self.path += '.html'
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

PORT = 8000
with socketserver.TCPServer(("", PORT), CleanURLHandler) as httpd:
    print("Serving at port", PORT)
    httpd.serve_forever()
