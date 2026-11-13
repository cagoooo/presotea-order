"""把網站複製到 _site/，並把 assets/config.js 的佔位符換成環境變數（GitHub Secrets 或本機 .env）。"""
import os, re, shutil, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / '_site'
KEYS = ['FIREBASE_API_KEY', 'FIREBASE_AUTH_DOMAIN', 'FIREBASE_PROJECT_ID',
        'FIREBASE_STORAGE_BUCKET', 'FIREBASE_MESSAGING_SENDER_ID', 'FIREBASE_APP_ID']

# 本機測試：沒有環境變數時讀 .env
env_file = ROOT / '.env'
if env_file.exists():
    for line in env_file.read_text(encoding='utf-8').splitlines():
        if '=' in line and not line.strip().startswith('#'):
            k, v = line.split('=', 1)
            os.environ.setdefault(k.strip(), v.strip())

if OUT.exists():
    shutil.rmtree(OUT)
OUT.mkdir()
for name in ['index.html', 'admin.html']:
    shutil.copy2(ROOT / name, OUT / name)
shutil.copytree(ROOT / 'assets', OUT / 'assets')
(OUT / '.nojekyll').write_text('', encoding='utf-8')

cfg = OUT / 'assets' / 'config.js'
text = cfg.read_text(encoding='utf-8')
missing = []
for k in KEYS:
    v = os.environ.get(k, '')
    if not v:
        missing.append(k)
    text = text.replace(f'__{k}__', v)
if missing:
    raise SystemExit(f'缺少設定：{", ".join(missing)}')
if re.search(r'__FIREBASE_[A-Z_]+__', text):
    raise SystemExit('config.js 仍有未替換的佔位符')
cfg.write_text(text, encoding='utf-8')
print('已輸出 _site/，設定注入完成')
