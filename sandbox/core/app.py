import hashlib
import json
import os
import time
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

DATA = Path(os.getenv('ATRIUM_DATA_DIR', '/data'))
RECEIPTS = Path(os.getenv('RECEIPT_DIR', '/data/receipts'))
RECEIPTS.mkdir(parents=True, exist_ok=True)


def receipt(event, payload):
    body = json.dumps({'event': event, 'payload': payload, 'ts': time.time()}, sort_keys=True)
    digest = hashlib.sha256(body.encode()).hexdigest()
    record = {'receipt_id': f'RCPT-{int(time.time()*1000)}', 'sha256': digest, 'body': json.loads(body)}
    (RECEIPTS / f"{record['receipt_id']}.json").write_text(json.dumps(record, indent=2))
    return record


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/health':
            self.send_response(200); self.send_header('Content-Type','application/json'); self.end_headers()
            self.wfile.write(json.dumps({'status':'ok','service':'atrium-core'}).encode()); return
        self.send_response(404); self.end_headers()

    def do_POST(self):
        if self.path != '/mint':
            self.send_response(404); self.end_headers(); return
        n = int(self.headers.get('Content-Length','0'))
        payload = json.loads(self.rfile.read(n) or '{}')
        rec = receipt('mint.accepted', payload)
        self.send_response(202); self.send_header('Content-Type','application/json'); self.end_headers()
        self.wfile.write(json.dumps({'accepted':True,'receipt':rec}).encode())

HTTPServer(('0.0.0.0',8080), Handler).serve_forever()
