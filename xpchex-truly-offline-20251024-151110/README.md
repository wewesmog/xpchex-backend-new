# XPChex Deployment Package

This package contains everything needed to deploy XPChex on a RHEL server.

## 📦 Package Contents

- **Backend**: Complete Python FastAPI application
- **Frontend**: Complete Next.js application  
- **Database**: PostgreSQL initialization scripts
- **Installation**: Automated installation script

## 🚀 Installation Instructions

### Prerequisites
- RHEL 8/9 server with root access

### Installation Steps

1. **Transfer the package to your RHEL server:**
   ```bash
   scp xpchex-deployment.tar.gz user@your-server:/tmp/
   ```

2. **Extract the package:**
   ```bash
   cd /tmp
   tar -xzf xpchex-deployment.tar.gz
   cd xpchex-deployment
   ```

3. **Run the installation script:**
   ```bash
   sudo chmod +x install.sh
   sudo ./install.sh
   ```

## 🌐 Access Your Application

After installation:
- **Frontend**: http://your-server-ip:3000
- **Backend API**: http://your-server-ip:8000

## 🔧 Service Management

```bash
# Check service status
systemctl status xpchex-backend
systemctl status xpchex-frontend

# View logs
journalctl -u xpchex-backend -f
journalctl -u xpchex-frontend -f
```
