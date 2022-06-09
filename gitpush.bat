npm run deploy
For /f "tokens=1-3 delims=/-" %%a in ('date /t') do (set mydate=%%a-%%b-%%c)
For /f "tokens=1-2 delims=/:" %%a in ('time /t') do (set mytime=%%a:%%b)
SET timestr=%mydate%_%mytime%
git add .
git commit -m "%timestr%"
git push