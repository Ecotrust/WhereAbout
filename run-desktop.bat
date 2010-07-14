set path=%~dp0lib;%SystemRoot%\system32;%SystemRoot%

IF NOT "%GDAL_DATA%" == "" GOTO CHECK_FOR_DB

:NO_GDAL_DATA
set GDAL_DATA=%~dp0gdal_data

:CHECK_FOR_DB
IF EXIST "%ALLUSERSPROFILE%\Application Data\Ecotrust\db.sqlite" GOTO RUN_APP

IF NOT EXIST "%ALLUSERSPROFILE%\Application Data\Ecotrust\NUL" mkdir "%ALLUSERSPROFILE%\Application Data\Ecotrust"

copy "%~dp0database\db.sqlite" "%ALLUSERSPROFILE%\Application Data\Ecotrust\db.sqlite"

:RUN_APP
%~d0
cd %~dp0
gwst.exe
pause
