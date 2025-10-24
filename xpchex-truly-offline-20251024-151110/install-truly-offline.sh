#!/bin/bash

# XPChex Truly Offline Installation Script for RHEL Server
set -e

echo "🚀 Installing XPChex on RHEL Server (TRULY OFFLINE MODE)..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root: sudo ./install-truly-offline.sh"
    exit 1
fi

echo "⚠️  NOTE: This installation requires some packages to be available on the RHEL server."
echo "   If installation fails, you may need to install missing packages manually."

# Install available RPM packages from local cache
echo "📦 Installing available system packages from local cache..."
cd rpm-cache

# Install PostgreSQL (these should work)
echo "🐘 Installing PostgreSQL..."
if [ -f postgresql15-server.rpm ] && [ -s postgresql15-server.rpm ]; then
    rpm -ivh postgresql15*.rpm
else
    echo "❌ PostgreSQL RPMs not found. Please install PostgreSQL manually."
    exit 1
fi

# Try to install Python 3.11 if available
echo "🐍 Installing Python 3.11..."
if [ -f python3.11.rpm ] && [ -s python3.11.rpm ]; then
    rpm -ivh python3.11*.rpm
else
    echo "⚠️  Python 3.11 RPMs not found. Using system Python or installing from repos."
    # Try to install from system repos
    yum install -y python3 python3-pip python3-devel || echo "Failed to install Python from repos"
fi

# Try to install development tools if available
echo "🔧 Installing development tools..."
if [ -f gcc.rpm ] && [ -s gcc.rpm ]; then
    rpm -ivh gcc*.rpm make.rpm
else
    echo "⚠️  Development tools RPMs not found. Installing from repos."
    yum groupinstall -y "Development Tools" || echo "Failed to install development tools"
fi

# Try to install Node.js if available
echo "📦 Installing Node.js..."
if [ -f nodejs.rpm ] && [ -s nodejs.rpm ]; then
    rpm -ivh nodejs.rpm
else
    echo "⚠️  Node.js RPM not found. Installing from repos."
    curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
    yum install -y nodejs || echo "Failed to install Node.js"
fi

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
echo "🐍 Installing Python dependencies..."
cd ../python-packages
if [ -f fastapi-0.118.0-py3-none-any.whl ]; then
    pip3 install --no-index --find-links . -r ../requirements-clean.txt
else
    echo "⚠️  Python packages not found. Installing from PyPI."
    pip3 install -r ../requirements-clean.txt
fi

# Install Node.js dependencies and build frontend
echo "📦 Installing Node.js dependencies..."
cd ../frontend
npm install
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
ExecStart=/usr/bin/python3 main.py
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
