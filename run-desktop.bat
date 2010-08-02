set path=%~dp0lib;%SystemRoot%\system32;%SystemRoot%

IF NOT "%GDAL_DATA%" == "" GOTO RUN_APP

:NO_GDAL_DATA
set GDAL_DATA=%~dp0gdal_data

:RUN_APP
%~d0
cd %~dp0
gwst.exe
pause
