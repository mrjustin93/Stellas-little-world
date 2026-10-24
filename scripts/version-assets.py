"""Run after changing package.json version so phone caches receive the release."""
from pathlib import Path
import json,re
root=Path(__file__).resolve().parent.parent
version=json.loads((root/'package.json').read_text())['version']
imports={f'./js/{p.name}':f'./js/{p.name}?v={version}' for p in sorted((root/'js').glob('*.js'))}
block='<script type="importmap">'+json.dumps({'imports':imports},separators=(',',':'))+'</script>'
p=root/'index.html';s=p.read_text()
s=re.sub(r'<script type="importmap">.*?</script>','',s,flags=re.S)
s=re.sub(r'href="style.css(?:\?[^\"]*)?"',f'href="style.css?v={version}"',s)
s=re.sub(r'src="main.js(?:\?[^\"]*)?"',f'src="main.js?v={version}"',s)
s=s.replace('</head>',block+'</head>');p.write_text(s)
