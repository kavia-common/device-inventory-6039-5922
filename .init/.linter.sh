#!/bin/bash
cd /home/kavia/workspace/code-generation/device-inventory-6039-5922/Frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

