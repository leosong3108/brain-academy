from pathlib import Path
root=Path(__file__).resolve().parent
css=(root/'style.css').read_text()
scripts='\n'.join((root/x).read_text() for x in ['engine.js','content.js','store.js','app.js'])
html='''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#6652d9"><meta name="description" content="个人脑力学习训练站：九类分级生成题、方法课、能力测评、错题间隔复习与本机存档。非官方测评，无云同步。"><title>脑力研习室 · 学习与训练</title><style>'''+css+'''</style></head><body><div id="app"></div><div id="toast" class="toast" role="status" aria-live="polite"></div><dialog id="restore-dialog" aria-label="恢复存档确认"></dialog><noscript>需要启用JavaScript才能学习和存档。</noscript><script>'''+scripts.replace('</script','<\\/script')+'''</script></body></html>'''
(root/'index.html').write_text(html)
print('Built standalone:',root/'index.html',len(html))
