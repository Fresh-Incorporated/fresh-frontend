import os
import re
import shutil
from pathlib import Path
import random
import string

SOURCE_DIR = Path('./')
FAKE_DIR = Path('./fake')

# Создание новой папки
if not FAKE_DIR.exists():
    FAKE_DIR.mkdir()

# Удаляем всё внутри fake, кроме node_modules
for item in FAKE_DIR.iterdir():
    if item.name == 'node_modules':
        continue
    if item.is_dir():
        shutil.rmtree(item)
    else:
        item.unlink()
shutil.copytree(SOURCE_DIR, FAKE_DIR, dirs_exist_ok=True, ignore=shutil.ignore_patterns('node_modules', 'fake', '.output', '.git', '.github', '.nuxt', '.idea', '.gitlab-ci.yml', 'Dockerfile', 'tailwind.config.js', '.env'))

def generate_random_name(length=16):
    return ''.join(random.choices(string.ascii_lowercase, k=length))

def obfuscate_vue_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    if "node_modules" in str(file_path):
        return
    print(str(file_path))

    # Заменяем все классы на ничего
    content = re.sub(r':class="(.*?)"', '', content)
    content = re.sub(r'class="(.*?)"', '', content)
    if "Header" not in str(file_path):
        content = re.sub(r'v-if="(.*?)"', '', content)
        content = re.sub(r'v-else', '', content)
        content = re.sub(r'v-else-if="(.*?)"', '', content)
        content = re.sub(r'<transition>', '', content)
        content = re.sub(r'<transition name=".*?">', '', content)
        content = re.sub(r'</transition>', '', content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

# обфускация всех Vue-файлов
for root, dirs, files in os.walk(FAKE_DIR):
    for file in files:
        if file.endswith('.vue'):
            full_path = Path(root) / file
            obfuscate_vue_file(full_path)

# Удаляем сопроводительные и потенциально полезные файлы
for pattern in ['*.md', 'README*']:
    for file in FAKE_DIR.rglob(pattern):
        file.unlink()

print("✅ Фейковый проект создан в папке ./fake")
