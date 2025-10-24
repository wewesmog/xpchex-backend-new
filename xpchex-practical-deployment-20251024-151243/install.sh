#!/bin/bash

# XPChex Practical Installation Script for RHEL Server
set -e

echo "🚀 Installing XPChex on RHEL Server..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "❌ Please run as root: sudo ./install.sh"
    exit 1
fi

echo "📋 This installation will:"
echo "   1. Install system packages from RHEL repos"
echo "   2. Install Python and Node.js dependencies"
echo "   3. Set up PostgreSQL database"
echo "   4. Deploy your applications"
echo ""

# Update system
echo "📦 Updating system packages..."
yum update -y

# Install Python 3.11 and pip
echo "🐍 Installing Python 3.11..."
yum install -y python3.11 python3.11-pip python3.11-devel || {
    echo "⚠️  Python 3.11 not available, installing Python 3.9..."
    yum install -y python3 python3-pip python3-devel
}

# Install Node.js 18
echo "📦 Installing Node.js 18..."
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Install PostgreSQL 15
echo "🐘 Installing PostgreSQL 15..."
yum install -y postgresql15-server postgresql15 postgresql15-contrib postgresql15-devel || {
    echo "⚠️  PostgreSQL 15 not available, installing PostgreSQL 13..."
    yum install -y postgresql-server postgresql postgresql-contrib postgresql-devel
}

# Install development tools
echo "🔧 Installing development tools..."
yum groupinstall -y "Development Tools"
yum install -y gcc gcc-c++ make

# Initialize PostgreSQL
echo "🗄️ Initializing PostgreSQL..."
if command -v postgresql-15-setup >/dev/null 2>&1; then
    postgresql-15-setup initdb
    systemctl enable postgresql-15
    systemctl start postgresql-15
else
    postgresql-setup initdb
    systemctl enable postgresql
    systemctl start postgresql
fi

# Create database and user
echo "👤 Creating database and user..."
sudo -u postgres psql -c "CREATE DATABASE xpchex;"
sudo -u postgres psql -c "CREATE USER xpchex_user WITH PASSWORD 'xpchex_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE xpchex TO xpchex_user;"

# Run database initialization script
echo "📊 Initializing database schema..."
sudo -u postgres psql -d xpchex -f init-scripts/01-init-db.sql

# Install Python dependencies
echo "🐍 Installing Python dependencies..."
cd backend
if command -v pip3.11 >/dev/null 2>&1; then
    pip3.11 install -r requirements-clean.txt
else
    pip3 install -r requirements-clean.txt
fi

# Install Node.js dependencies and build frontend
echo "📦 Installing Node.js dependencies..."
cd ../frontend
npm install --legacy-peer-deps
npm run build

# Create systemd services
echo "⚙️ Creating systemd services..."

# Backend service
cat > /etc/systemd/system/xpchex-backend.service << 'SERVICE_EOF'
[Unit]
Description=XPChex Backend API
After=network.target postgresql.service

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
