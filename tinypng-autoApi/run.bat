@echo off

rem ��������
set input=
set /p input=�������ļ���·�����س�ȷ��(��ע�ⱸ�ݣ�ͼƬѹ���Ḳ��ԭͼ)��
rem ����õ���������Ϣ
echo ·��Ϊ: %input%
echo.
node ./main.js -input %input%
pause