import hashlib, json, os, time
from pathlib import Path

DATA = Path(os.getenv('ATRIUM_DATA_DIR','/data')); RECEIPTS = DATA/'receipts'; OUT = DATA/'generated_campaigns'
RECEIPTS.mkdir(parents=True, exist_ok=True); OUT.mkdir(parents=True, exist_ok=True)

cards = [
 {'id':101,'location':'Tokyo Cyberpunk','rarity':'Legendary','theme':'Futuristic Neon Travel'},
 {'id':102,'location':'Amalfi Coastal Drift','rarity':'Rare','theme':'Mediterranean Solitude'},
 {'id':103,'location':'Reykjavik Aurora','rarity':'Epic','theme':'Glacial Night Lights'}]
state_file = DATA/'scheduler_state.json'
state = json.loads(state_file.read_text()) if state_file.exists() else {'index':0}

while True:
    i = state.get('index',0)
    if i < len(cards):
        card=cards[i]
        metadata={'name':f"{card['location']} #{card['id']}",'description':f"{card['rarity']} travel artefact from {card['theme']}.",'attributes':[{'trait_type':'Location','value':card['location']},{'trait_type':'Rarity','value':card['rarity']}]}
        path=OUT/f"card_{card['id']}"; path.mkdir(exist_ok=True); raw=json.dumps(metadata,sort_keys=True)
        (path/'metadata.json').write_text(json.dumps(metadata,indent=2))
        digest=hashlib.sha256(raw.encode()).hexdigest()
        receipt={'receipt_id':f'RCPT-MINT-{int(time.time()*1000)}','event':'mint.metadata.compiled','sha256':digest,'card_id':card['id'],'ts':time.time()}
        (RECEIPTS/f"{receipt['receipt_id']}.json").write_text(json.dumps(receipt,indent=2))
        state['index']=i+1; state_file.write_text(json.dumps(state,indent=2))
    time.sleep(int(os.getenv('POLL_SECONDS','60')))
