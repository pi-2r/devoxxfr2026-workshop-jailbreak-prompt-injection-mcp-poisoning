#!/bin/bash
set -e
SERVERDIR=/data
if [ ! -f "$SERVERDIR/.nodeinfo" ]; then
  echo "Initializing devpi server..."
  devpi-init --serverdir "$SERVERDIR"
fi
exec devpi-server --host 0.0.0.0 --port 3141 --serverdir "$SERVERDIR"