import http.server
import socketserver
import os
import random

PORT = random.randint(8000, 8020)

class MyRequestHandler(http.server.SimpleHTTPRequestHandler):
	def do_GET(self):
		if not os.path.splitext(self.path)[1]:  # Check if the path has no file extension
			self.path = 'index.html'  # Redirect to index.html
		return super().do_GET()  # Serve the file

Handler = MyRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
	print(f"Serving at port {PORT}")
	httpd.serve_forever()
