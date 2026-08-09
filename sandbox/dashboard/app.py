import json, os
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
DATA=Path(os.getenv('ATRIUM_DATA_DIR','/data')); RECEIPTS=DATA/'receipts'
class Handler(BaseHTTPRequestHandler):
 def do_GET(self):
  if self.path=='/health':
   body=json.dumps({'status':'ok','service':'dashboard','receipts':len(list(RECEIPTS.glob('*.json')))})
  elif self.path=='/receipts':
   body=json.dumps([json.loads(p.read_text()) for p in sorted(RECEIPTS.glob('*.json'))[-50:]])
  else: body='<html><body><h1>Atrium Sandbox</h1><p>Receipt-backed stateful workspace.</p><p><a href="/receipts">Recent receipts</a></p></body></html>'
  self.send_response(200); self.send_header('Content-Type','application/json' if self.path!='/' else 'text/html'); self.end_headers(); self.wfile.write(body.encode())
HTTPServer(('0.0.0.0',8080),Handler).serve_forever()
