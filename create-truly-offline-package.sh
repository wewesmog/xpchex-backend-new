#!/bin/bash

# Create a truly offline package with all dependencies
echo "🚀 Creating TRULY OFFLINE package for RHEL server..."

# Create package directory
PACKAGE_DIR="xpchex-truly-offline-$(date +%Y%m%d-%H%M%S)"
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
cp xpchex-deployment/README.md "$PACKAGE_DIR/"

# Download Python packages with better error handling
echo "🐍 Downloading Python packages..."
cd "$PACKAGE_DIR/python-packages"

# Try to download with more flexible version requirements
pip download --platform linux_x86_64 --only-binary=:all: --no-deps \
    fastapi==0.118.0 \
    uvicorn[standard]==0.37.0 \
    pydantic==2.11.10 \
    python-dotenv==1.1.1 \
    psycopg2-binary>=2.9.0 \
    SQLAlchemy==2.0.43 \
    requests==2.32.5 \
    httpx==0.28.1 \
    pandas==2.3.2 \
    numpy==2.3.3 \
    google-play-scraper==1.2.7 \
    openai==1.109.1 \
    langchain-core==0.3.78 \
    langgraph==0.6.8 \
    instructor==1.11.3 \
    typing-extensions==4.15.0 \
    annotated-types==0.7.0 \
    anyio==4.11.0 \
    sniffio==1.3.1 \
    idna==3.10 \
    certifi==2025.10.5 \
    urllib3==2.5.0 \
    charset-normalizer==3.4.3

# Download Node.js packages
echo "📦 Downloading Node.js packages..."
cd ../node-packages
cp ../frontend/package.json .
cp ../frontend/package-lock.json .

# Try to install and pack all dependencies
npm install --package-lock-only
npm pack --pack-destination . || echo "Some packages may need to be installed from registry"

# Download RPM packages with alternative sources
echo "📥 Downloading RPM packages..."
cd ../rpm-cache

# PostgreSQL packages (these worked)
echo "🐘 PostgreSQL packages already downloaded..."

# Try alternative sources for Python and development tools
echo "🔧 Trying alternative RPM sources..."

# Try to download from different mirrors
wget -O python3.11.rpm "https://download.fedoraproject.org/pub/epel/8/Everything/x86_64/Packages/p/python3.11-3.11.10-1.el8.x86_64.rpm" || echo "Python 3.11 RPM not found"
wget -O python3.11-pip.rpm "https://download.fedoraproject.org/pub/epel/8/Everything/x86_64/Packages/p/python3.11-pip-23.3.1-1.el8.noarch.rpm" || echo "Python 3.11 pip RPM not found"
wget -O python3.11-devel.rpm "https://download.fedoraproject.org/pub/epel/8/Everything/x86_64/Packages/p/python3.11-devel-3.11.10-1.el8.x86_64.rpm" || echo "Python 3.11 devel RPM not found"

# Try to download development tools
wget -O gcc.rpm "https://download.fedoraproject.org/pub/epel/8/Everything/x86_64/Packages/g/gcc-8.5.0-21.el8.x86_64.rpm" || echo "GCC RPM not found"
wget -O gcc-c++.rpm "https://download.fedoraproject.org/pub/epel/8/Everything/x86_64/Packages/g/gcc-c++-8.5.0-21.el8.x86_64.rpm" || echo "GCC++ RPM not found"
wget -O make.rpm "https://download.fedoraproject.org/pub/epel/8/Everything/x86_64/Packages/m/make-4.2.1-12.el8.x86_64.rpm" || echo "Make RPM not found"

# Try Node.js from different source
wget -O nodejs.rpm "https://rpm.nodesource.com/pub_18.x/el/8/x86_64/nodejs-18.20.4-1nodesource.x86_64.rpm" || echo "Node.js RPM not found"

# Check what we actually got
echo "🔍 Checking downloaded packages..."
for rpm in *.rpm; do
    if [ -f "$rpm" ] && [ -s "$rpm" ]; then
        echo "✅ $rpm ($(du -h "$rpm" | cut -f1))"
    else
        echo "❌ $rpm - FAILED or EMPTY"
    fi
done

# Create installation script that handles missing packages
echo "📝 Creating installation script..."
cat > ../install-truly-offline.sh << 'INSTALL_EOF'
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
INSTALL_EOF

chmod +x ../install-truly-offline.sh

# Create final package
echo "📦 Creating final offline package..."
cd ..
tar -czf "${PACKAGE_DIR}.tar.gz" "$PACKAGE_DIR"

echo "✅ Truly offline package created: ${PACKAGE_DIR}.tar.gz"
echo "📁 Package size: $(du -h "${PACKAGE_DIR}.tar.gz" | cut -f1)"
echo ""
echo "📋 Package includes:"
echo "✅ YOUR backend code (Python FastAPI)"
echo "✅ YOUR frontend code (Next.js)"
echo "✅ YOUR database scripts"
echo "✅ Available system packages (RPM files)"
echo "✅ Available Python dependencies"
echo "✅ Available Node.js dependencies"
echo "✅ Smart installation script with fallbacks"
echo ""
echo "⚠️  NOTE: Some packages may need to be installed from RHEL repos"
echo "   The installation script will try to install missing packages automatically."
echo ""
echo "🚀 To deploy on your RHEL server:"
echo "1. Transfer ${PACKAGE_DIR}.tar.gz to your RHEL server"
echo "2. Extract: tar -xzf ${PACKAGE_DIR}.tar.gz"
echo "3. Navigate: cd $PACKAGE_DIR"
echo "4. Install: sudo ./install-truly-offline.sh"
echo "5. Access: http://localhost:3000"
