@echo off
cd /d "%~dp0"
"C:\Program Files\nodejs\npm.cmd" run dev > "%~dp0dev-server.detached.log" 2>&1
