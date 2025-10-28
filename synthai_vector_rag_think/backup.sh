#!/usr/bin/env bash
TS=$(date +%Y%m%d_%H%M%S)
mkdir -p backups
zip -r "backups/synthai_${TS}.zip" knowledge public server.js package.json indexes patches || exit 1
echo "saved backups/synthai_${TS}.zip"
