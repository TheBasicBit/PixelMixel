@echo off
call build.bat

rd /S /Q output
md output

xcopy server\bin\Debug\net6.0 output /E /H /C /I

md output\public
xcopy public output\public /E /H /C /I
