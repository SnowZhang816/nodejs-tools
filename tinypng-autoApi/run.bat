@echo off

rem 接收输入
set input=
set /p input=请输入文件夹路径，回车确定(请注意备份，图片压缩会覆盖原图)：
rem 输出得到的输入信息
echo 路径为: %input%
echo.
node ./main.js -input %input%
pause