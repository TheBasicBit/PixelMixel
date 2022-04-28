@echo off
deno bundle --config deno.jsonc src/Main.ts public/bundle.js
cd server
del /S /Q bin
dotnet build
cd ..