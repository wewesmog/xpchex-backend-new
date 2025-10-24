# XPChex Practical Deployment Package

This package contains everything needed to deploy XPChex on a RHEL server.

## 📦 Package Contents

- **Backend**: Complete Python FastAPI application
- **Frontend**: Complete Next.js application  
- **Database**: PostgreSQL initialization scripts
- **Installation**: Automated installation script

## 🚀 Installation Instructions

### Prerequisites
- RHEL 8/9 server with root access
- Internet connection for package installation

### Installation Steps

1. **Transfer the package to your RHEL server:**
   ```bash
   scp xpchex-practical-deployment-*.tar.gz user@your-server:/tmp/
   ```

2. **Extract the package:**
   ```bash
   cd /tmp
   tar -xzf xpchex-practical-deployment-*.tar.gz
   cd xpchex-practical-deployment-*
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

# Restart services
systemctl restart xpchex-backend
systemctl restart xpchex-frontend
```

## 🗄️ Database Configuration

- **Host**: localhost
- **Port**: 5432
- **Database**: xpchex
- **User**: xpchex_user
- **Password**: xpchex_password

## 📁 File Locations

- **Backend**: `/opt/xpchex/backend/`
- **Frontend**: `/opt/xpchex/frontend/`
- **Services**: `/etc/systemd/system/xpchex-*.service`

## 🆘 Troubleshooting

If services fail to start:
1. Check logs: `journalctl -u xpchex-backend -f`
2. Verify database connection
3. Check firewall settings
4. Ensure all dependencies are installed

## 🔒 Security Notes

- Change default database password after installation
- Configure SSL certificates for production
- Set up proper firewall rules
- Use environment variables for sensitive data
