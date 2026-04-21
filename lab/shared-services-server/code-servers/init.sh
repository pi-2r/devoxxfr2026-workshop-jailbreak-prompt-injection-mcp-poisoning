#!/bin/sh
set -e

# Fix permissions sur le volume named (créé root:root par Docker)
sudo chown -R 1000:1000 /home/coder/.local/share/code-server

# Injecter les settings par défaut sans écraser les customisations user
mkdir -p /home/coder/.local/share/code-server/User
python3 - << 'EOF'
import json, os
f = '/home/coder/.local/share/code-server/User/settings.json'
s = json.load(open(f)) if os.path.exists(f) else {}
s.setdefault('typescript.tsserver.maxTsServerMemory', 256)
json.dump(s, open(f, 'w'), indent=2)
EOF

exec dumb-init /usr/bin/code-server --bind-addr 0.0.0.0:8080 --trusted-origins=* /home/coder/workspace
