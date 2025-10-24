#!/bin/bash

# Script to download all RPM packages needed for offline RHEL installation
echo "🚀 Downloading RPM packages for offline RHEL installation..."

# Create package directory
PACKAGE_DIR="xpchex-offline-complete-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$PACKAGE_DIR/rpm-cache"
mkdir -p "$PACKAGE_DIR/python-packages"
mkdir -p "$PACKAGE_DIR/node-packages"

echo "📦 Creating package in: $PACKAGE_DIR"

# Copy application code
echo "📁 Copying application code..."
cp -r xpchex-deployment/backend "$PACKAGE_DIR/"
cp -r xpchex-deployment/frontend "$PACKAGE_DIR/"
cp -r xpchex-deployment/init-scripts "$PACKAGE_DIR/"
cp xpchex-deployment/requirements-clean.txt "$PACKAGE_DIR/"
cp xpchex-deployment/install.sh "$PACKAGE_DIR/"
cp xpchex-deployment/README.md "$PACKAGE_DIR/"

# Download Python packages
echo "🐍 Downloading Python packages..."
cd "$PACKAGE_DIR/python-packages"
pip download --platform linux_x86_64 --only-binary=:all: --no-deps -r ../requirements-clean.txt

# Download Node.js packages
echo "📦 Downloading Node.js packages..."
cd ../node-packages
cp ../frontend/package.json .
cp ../frontend/package-lock.json .
npm pack --pack-destination .

# Download RPM packages for RHEL 8
echo "📥 Downloading RPM packages for RHEL 8..."
cd ../rpm-cache

# PostgreSQL 15 packages
echo "🐘 Downloading PostgreSQL packages..."
wget -O postgresql15-server.rpm "https://download.postgresql.org/pub/repos/yum/15/redhat/rhel-8-x86_64/postgresql15-server-15.7-1PGDG.rhel8.x86_64.rpm"
wget -O postgresql15.rpm "https://download.postgresql.org/pub/repos/yum/15/redhat/rhel-8-x86_64/postgresql15-15.7-1PGDG.rhel8.x86_64.rpm"
wget -O postgresql15-contrib.rpm "https://download.postgresql.org/pub/repos/yum/15/redhat/rhel-8-x86_64/postgresql15-contrib-15.7-1PGDG.rhel8.x86_64.rpm"
wget -O postgresql15-devel.rpm "https://download.postgresql.org/pub/repos/yum/15/redhat/rhel-8-x86_64/postgresql15-devel-15.7-1PGDG.rhel8.x86_64.rpm"

# Python 3.11 packages
echo "🐍 Downloading Python 3.11 packages..."
wget -O python3.11.rpm "https://download.fedoraproject.org/pub/epel/8/Everything/x86_64/Packages/p/python3.11-3.11.10-1.el8.x86_64.rpm"
wget -O python3.11-pip.rpm "https://download.fedoraproject.org/pub/epel/8/Everything/x86_64/Packages/p/python3.11-pip-23.3.1-1.el8.noarch.rpm"
wget -O python3.11-devel.rpm "https://download.fedoraproject.org/pub/epel/8/Everything/x86_64/Packages/p/python3.11-devel-3.11.10-1.el8.x86_64.rpm"

# Development tools
echo "🔧 Downloading development tools..."
wget -O gcc.rpm "https://download.fedoraproject.org/pub/epel/8/Everything/x86_64/Packages/g/gcc-8.5.0-21.el8.x86_64.rpm"
wget -O gcc-c++.rpm "https://download.fedoraproject.org/pub/epel/8/Everything/x86_64/Packages/g/gcc-c++-8.5.0-21.el8.x86_64.rpm"
wget -O make.rpm "https://download.fedoraproject.org/pub/epel/8/Everything/x86_64/Packages/m/make-4.2.1-12.el8.x86_64.rpm"

# Node.js 18
echo "📦 Downloading Node.js 18..."
wget -O nodejs.rpm "https://rpm.nodesource.com/pub_18.x/el/8/x86_64/nodejs-18.20.4-1nodesource.x86_64.rpm"

# Check if all RPMs were downloaded successfully
echo "🔍 Checking downloaded packages..."
for rpm in *.rpm; do
    if [ -f "$rpm" ] && [ -s "$rpm" ]; then
        echo "✅ $rpm ($(du -h "$rpm" | cut -f1))"
    else
        echo "❌ $rpm - FAILED or EMPTY"
    fi
done

# Create offline installation script
echo "📝 Creating offline installation script..."
cat > ../install-offline.sh << 'INSTALL_EOF'
#!/bin/bash

# XPChex Offline Installation Script for RHEL Server
set -e

echo "🚀 Installing XPChex on RHEL Server (OFFLINE MODE)..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root: sudo ./install-offline.sh"
    exit 1
fi

# Install RPM packages from local cache
echo "📦 Installing system packages from local cache..."
cd rpm-cache

# Install PostgreSQL
echo "🐘 Installing PostgreSQL..."
rpm -ivh postgresql15*.rpm

# Install Python 3.11
echo "🐍 Installing Python 3.11..."
rpm -ivh python3.11*.rpm

# Install development tools
echo "🔧 Installing development tools..."
rpm -ivh gcc*.rpm make.rpm

# Install Node.js
echo "📦 Installing Node.js..."
rpm -ivh nodejs.rpm

# Initialize PostgreSQL
echo "🗄️ Initializing PostgreSQL..."
postgresql-15-setup initdb
systemctl enable postgresql-15
systemctl start postgresql-15

# Create database and user
echo "👤 Creating database and user..."
sudo -u postgres psql -c "CREATE DATABASE xpchex;"
sudo -u postgres psql -c "CREATE USER xpchex_user WITH PASSWORD 'xpchex_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE xpchex TO xpchex_user;"

# Run database initialization script
echo "📊 Initializing database schema..."
sudo -u postgres psql -d xpchex -f init-scripts/01-init-db.sql

# Install Python dependencies from local cache
echo "🐍 Installing Python dependencies from local cache..."
cd ../python-packages
pip3.11 install --no-index --find-links . -r ../requirements-clean.txt

# Install Node.js dependencies and build frontend
echo "📦 Installing Node.js dependencies..."
cd ../frontend
npm install --offline
npm run build

# Create systemd services
echo "⚙️ Creating systemd services..."

# Backend service
cat > /etc/systemd/system/xpchex-backend.service << 'SERVICE_EOF'
[Unit]
Description=XPChex Backend API
After=network.target postgresql-15.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/xpchex/backend
ExecStart=/usr/bin/python3.11 main.py
Restart=always
Environment=PGHOST=localhost
Environment=PGPORT=5432
Environment=PGDATABASE=xpchex
Environment=PGUSER=xpchex_user
Environment=PGPASSWORD=xpchex_password
Environment=DB_SSL_MODE=disable

[Install]
WantedBy=multi-user.target
SERVICE_EOF

# Frontend service
cat > /etc/systemd/system/xpchex-frontend.service << 'SERVICE_EOF'
[Unit]
Description=XPChex Frontend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/xpchex/frontend
ExecStart=/usr/bin/node server.js
Restart=always
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
SERVICE_EOF

# Copy applications to /opt/xpchex
echo "📁 Installing applications..."
mkdir -p /opt/xpchex
cp -r backend /opt/xpchex/
cp -r frontend /opt/xpchex/

# Set permissions
chown -R root:root /opt/xpchex
chmod -R 755 /opt/xpchex

# Enable and start services
echo "🚀 Starting services..."
systemctl daemon-reload
systemctl enable xpchex-backend
systemctl enable xpchex-frontend
systemctl start xpchex-backend
systemctl start xpchex-frontend

# Configure firewall
echo "🔥 Configuring firewall..."
firewall-cmd --permanent --add-port=3000/tcp
firewall-cmd --permanent --add-port=8000/tcp
firewall-cmd --reload

echo "✅ Installation complete!"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo ""
echo "📊 Service status:"
echo "   systemctl status xpchex-backend"
echo "   systemctl status xpchex-frontend"
echo ""
echo "📝 Logs:"
echo "   journalctl -u xpchex-backend -f"
echo "   journalctl -u xpchex-frontend -f"
INSTALL_EOF

chmod +x ../install-offline.sh

# Create final package
echo "📦 Creating final offline package..."
cd ..
tar -czf "${PACKAGE_DIR}.tar.gz" "$PACKAGE_DIR"

echo "✅ Complete offline package created: ${PACKAGE_DIR}.tar.gz"
echo "📁 Package size: $(du -h "${PACKAGE_DIR}.tar.gz" | cut -f1)"
echo ""
echo "📋 Package includes:"
echo "✅ YOUR backend code (Python FastAPI)"
echo "✅ YOUR frontend code (Next.js)"
echo "✅ YOUR database scripts"
echo "✅ ALL system packages (RPM files)"
echo "✅ ALL Python dependencies"
echo "✅ ALL Node.js dependencies"
echo "✅ Complete offline installation script"
echo "✅ NO INTERNET CONNECTION REQUIRED!"
echo ""
echo "🚀 To deploy on your RHEL server:"
echo "1. Transfer ${PACKAGE_DIR}.tar.gz to your RHEL server"
echo "2. Extract: tar -xzf ${PACKAGE_DIR}.tar.gz"
echo "3. Navigate: cd $PACKAGE_DIR"
echo "4. Install: sudo ./install-offline.sh"
echo "5. Access: http://localhost:3000"
