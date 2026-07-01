import os, re
d = r'c:\Users\carte\Desktop\babybuddy2\v1\baby-buddy-dashboard\baby-buddy-dashboard\frontend\src\components\forms'
for f in os.listdir(d):
    p = os.path.join(d, f)
    if not p.endswith('.jsx'): continue
    with open(p, 'r') as file: content = file.read()
    orig = content
    content = re.sub(r'(data\.(?:start|end|time|date))\s*=\s*`\$\{([^}]+)\}:00`;', r'\1 = new Date(`${\2}:00`).toISOString();', content)
    content = re.sub(r'(start|end|time|date):\s*`\$\{([^}]+)\}:00`', r'\1: new Date(`${\2}:00`).toISOString()', content)
    if orig != content:
        with open(p, 'w') as file: file.write(content)
        print(f'Fixed {f}')
