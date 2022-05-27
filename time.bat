For /f "tokens=1-3 delims=/-" %%a in ('date /t') do (set mydate=%%a-%%b-%%c)
For /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a%%b)
SET timestr=%mydate%_%mytime%
%mydate%
%mytime%
%timestr%
timeout -1