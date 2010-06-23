set path=%SystemRoot%\system32;%SystemRoot%;%~dp0lib

IF NOT "%GDAL_DATA%" == "" GOTO CHECK_FOR_DB

:NO_GDAL_DATA
set GDAL_DATA=%~dp0gdal_data

:CHECK_FOR_DB
IF EXIST "%APPDATA%\Ecotrust\db.sqlite" GOTO RUN_APP

IF NOT EXIST "%APPDATA%\Ecotrust\NUL" mkdir "%APPDATA%\Ecotrust"

copy "%~dp0database\db.sqlite" "%APPDATA%\Ecotrust\db.sqlite"

:RUN_APP
%~d0
cd %~dp0
gwst.exe
pause
