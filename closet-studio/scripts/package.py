"""Build the direct-open HTML and ZIP from the same source files."""
from pathlib import Path
import base64
import zipfile

root = Path(__file__).resolve().parents[1]
dist = root / 'dist' if (root / 'dist').is_dir() else root
html = (dist / 'index.html').read_text()
html = html.replace('<link rel="stylesheet" href="style.css">', '<style>' + (dist / 'style.css').read_text() + '</style>')
model = base64.b64encode((dist / 'stella.glb').read_bytes()).decode()
for name in ['core.js', 'app.js', 'character.js', 'scene.js']:
    source = (dist / name).read_text()
    if name == 'app.js':
        source = 'window.STELLA_MODEL="' + model + '";\n' + source
    html = html.replace('<script src="' + name + '"></script>', '<script>' + source + '</script>')
html += '\n<!-- Character anatomy adapted from MakeHuman CC0 assets; see THIRD_PARTY.md. -->\n'
(root / 'Play-Stellas-Closet.html').write_text(html)
with zipfile.ZipFile(root / 'stella-closet.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
    for name in ['index.html', 'style.css', 'core.js', 'app.js', 'character.js', 'scene.js', 'stella.glb']:
        archive.write(dist / name, name)
    archive.write(root / 'README.md', 'README.md')
    if (root / 'THIRD_PARTY.md').exists(): archive.write(root / 'THIRD_PARTY.md', 'THIRD_PARTY.md')
    if (root / 'art/vendor/LICENSE-CC0.md').exists(): archive.write(root / 'art/vendor/LICENSE-CC0.md', 'LICENSE-CC0.md')
    archive.write(root / 'Play-Stellas-Closet.html', 'Play-Stellas-Closet.html')
print('Updated direct-open HTML and ZIP from dist/.')
