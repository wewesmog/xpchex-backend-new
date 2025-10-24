# XPChex Offline Deployment Package 
 
This package contains everything needed to deploy XPChex on an offline RHEL server. 
 
## Installation: 
1. Transfer this package to your RHEL server 
2. Extract: tar -xzf xpchex-complete-offline.tar.gz 
3. Install Docker: sudo rpm -ivh docker-ce-*.rpm --force --nodeps 
4. Start Docker: sudo systemctl start docker 
5. Load images: docker load < xpchex-backend.tar.gz 
6. Start services: docker-compose up -d 
 
## Services: 
- Backend API: http://localhost:8000 
- Frontend App: http://localhost:3000 
- PostgreSQL: localhost:5432 
