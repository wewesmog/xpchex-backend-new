@echo off
REM Windows batch script to create complete offline deployment package

echo Creating XPChex complete offline deployment package...

REM Create main directory
if not exist "xpchex-complete-offline" mkdir xpchex-complete-offline
cd xpchex-complete-offline

REM Create directory structure
mkdir backend
mkdir frontend
mkdir database
mkdir scripts
mkdir docker

echo Step 1: Copying backend source code...
xcopy /E /I /Y "..\backend\*" "backend\"

echo Step 2: Copying frontend source code...
xcopy /E /I /Y "..\..\xpchex_frontend_new_2\*" "frontend\"

echo Step 3: Copying database files...
xcopy /E /I /Y "..\database\*" "database\"

echo Step 4: Copying scripts...
xcopy /E /I /Y "..\scripts\*" "scripts\"

echo Step 5: Copying Docker files...
xcopy /E /I /Y "..\docker\*" "docker\"

echo Step 6: Creating docker-compose.yml...
echo version: '3.8' > docker-compose.yml
echo. >> docker-compose.yml
echo services: >> docker-compose.yml
echo   postgres: >> docker-compose.yml
echo     image: postgres:15-alpine >> docker-compose.yml
echo     container_name: xpchex-postgres >> docker-compose.yml
echo     environment: >> docker-compose.yml
echo       POSTGRES_DB: xpchex >> docker-compose.yml
echo       POSTGRES_USER: xpchex_user >> docker-compose.yml
echo       POSTGRES_PASSWORD: xpchex_password >> docker-compose.yml
echo     volumes: >> docker-compose.yml
echo       - postgres_data:/var/lib/postgresql/data >> docker-compose.yml
echo       - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql >> docker-compose.yml
echo     ports: >> docker-compose.yml
echo       - "5432:5432" >> docker-compose.yml
echo     restart: unless-stopped >> docker-compose.yml
echo. >> docker-compose.yml
echo   backend: >> docker-compose.yml
echo     build: ./backend >> docker-compose.yml
echo     container_name: xpchex-backend >> docker-compose.yml
echo     environment: >> docker-compose.yml
echo       DATABASE_URL: postgresql://xpchex_user:xpchex_password@postgres:5432/xpchex >> docker-compose.yml
echo     ports: >> docker-compose.yml
echo       - "8000:8000" >> docker-compose.yml
echo     depends_on: >> docker-compose.yml
echo       - postgres >> docker-compose.yml
echo     restart: unless-stopped >> docker-compose.yml
echo. >> docker-compose.yml
echo   frontend: >> docker-compose.yml
echo     build: ./frontend >> docker-compose.yml
echo     container_name: xpchex-frontend >> docker-compose.yml
echo     ports: >> docker-compose.yml
echo       - "3000:3000" >> docker-compose.yml
echo     depends_on: >> docker-compose.yml
echo       - backend >> docker-compose.yml
echo     restart: unless-stopped >> docker-compose.yml
echo. >> docker-compose.yml
echo volumes: >> docker-compose.yml
echo   postgres_data: >> docker-compose.yml

echo Step 7: Creating README.md...
echo # XPChex Offline Deployment Package > README.md
echo. >> README.md
echo This package contains everything needed to deploy XPChex on an offline RHEL server. >> README.md
echo. >> README.md
echo ## Installation: >> README.md
echo 1. Transfer this package to your RHEL server >> README.md
echo 2. Extract: tar -xzf xpchex-complete-offline.tar.gz >> README.md
echo 3. Install Docker: sudo rpm -ivh docker-ce-*.rpm --force --nodeps >> README.md
echo 4. Start Docker: sudo systemctl start docker >> README.md
echo 5. Load images: docker load ^< xpchex-backend.tar.gz >> README.md
echo 6. Start services: docker-compose up -d >> README.md
echo. >> README.md
echo ## Services: >> README.md
echo - Backend API: http://localhost:8000 >> README.md
echo - Frontend App: http://localhost:3000 >> README.md
echo - PostgreSQL: localhost:5432 >> README.md

echo Step 8: Creating final package...
cd ..
tar -czf xpchex-complete-offline.tar.gz xpchex-complete-offline\

echo Complete offline package created: xpchex-complete-offline.tar.gz
echo.
echo Next steps:
echo 1. Build Docker images: docker build -t xpchex-backend:latest ./backend/
echo 2. Save images: docker save xpchex-backend:latest ^| gzip ^> xpchex-backend.tar.gz
echo 3. Transfer to RHEL server
echo 4. Follow README.md instructions
