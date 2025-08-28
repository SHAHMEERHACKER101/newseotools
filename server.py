#!/usr/bin/env python3
import http.server
import socketserver
import os
import mimetypes
from urllib.parse import urlparse

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory="/app/frontend", **kwargs)
    
    def do_GET(self):
        # Parse the URL
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Handle root path
        if path == '/':
            path = '/index.html'
        
        # Handle page routes - serve the actual HTML files
        if path.startswith('/pages/'):
            # Path is already correct for files like /pages/about.html
            pass
        elif path in ['/about', '/contact', '/privacy', '/terms', '/cookie-policy']:
            # Redirect clean URLs to .html files
            if path == '/about':
                path = '/pages/about.html'
            elif path == '/contact':
                path = '/pages/contact.html'
            elif path == '/privacy':
                path = '/pages/privacy.html'
            elif path == '/terms':
                path = '/pages/terms.html'
            elif path == '/cookie-policy':
                path = '/pages/cookie-policy.html'
        
        # Update the path
        self.path = path
        
        # Check if file exists
        filepath = "/app/frontend" + path
        if not os.path.exists(filepath) and not path.endswith('.html'):
            # If file doesn't exist and doesn't end with .html, try adding .html
            if os.path.exists(filepath + '.html'):
                self.path = path + '.html'
                filepath = "/app/frontend" + self.path
        
        # If still doesn't exist and it's a page route, serve index.html
        if not os.path.exists(filepath) and (path.startswith('/pages/') or path in ['/about', '/contact', '/privacy', '/terms']):
            # Check if the original HTML file exists
            original_path = path
            if not path.startswith('/pages/'):
                original_path = '/pages' + path + '.html'
            
            original_file = "/app/frontend" + original_path
            if os.path.exists(original_file):
                self.path = original_path
        
        return super().do_GET()
    
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

if __name__ == "__main__":
    PORT = 3000
    
    # Change to frontend directory
    os.chdir("/app/frontend")
    
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"Static server running at http://0.0.0.0:{PORT}")
        print(f"Serving files from: {os.getcwd()}")
        httpd.serve_forever()