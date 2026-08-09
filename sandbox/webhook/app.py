import json, os, time, urllib.request
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

RECEIPTS=Path(os.getenv('RECEIPT_DIR','/data/receipts')); RECEIPTS.mkdir(parents=True,exist_ok=True)
DISCORD=os.getenv('DISCORD_WEBHOOK_URL',''); TG_TOKEN=os.getenv('TELEGRAM_BOT_TOKEN',''); TG_CHAT=os.getenv('TELEGRAM_CHAT_ID','')

def post(url, payload):
    if not url: return False
    req=urllib.request.Request(url, data=json.dumps(payload).encode(), headers={'Content-Type':'application/json'}, method='POST')
    try:
        urllib.request.urlopen(req, timeout=8); return True
    except Exception: return False

def notify(event):
    text=f"🪙 New mint: {event.get('name', event.get('id','unknown'))}"
    results={'discord':False,'telegram':False}
    if DISCORD: results['discord']=post(DISCORD, {'content':text})
    if TG_TOKEN and TG_CHAT: results['telegram']=post(f'https://api.telegram.org/bot{TG_TOKEN}/sendMessage', {'chat_id':TG_CHAT,'text':text})
    receipt={'receipt_id':f'RCPT-ALERT-{int(time.time()*1000)}','event':'mint.alert.dispatched','results':results,'ts':time.time()}
    (RECEIPTS/f"{receipt['receipt_id']}.json").write_text(json.dumps(receipt,indent=2))
    return receipt

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path=='/health':
            self.send_response(200); self.send_header('Content-Type','application/json'); self.end_headers(); self.wfile.write(b'{"status":"ok","service":"webhook"}'); return
        self.send_response(404); self.end_headers()
    def do_POST(self):
        n=int(self.headers.get('Content-Length','0')); payload=json.loads(self.rfile.read(n) or '{}')
        rec=notify(payload); self.send_response(202); self.send_header('Content-Type','application/json'); self.end_headers(); self.wfile.write(json.dumps(rec).encode())
HTTPServer(('0.0.0.0',8080),Handler).serve_forever()
