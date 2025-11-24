# Mobile Reporting PWA - Deployment Guide

## Prerequisites

- Raspberry Pi with Raspberry Pi OS
- Docker and Docker Compose installed
- Network access to Raspberry Pi

## Quick Start

### 1. Install Docker on Raspberry Pi

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose -y
```

### 2. Copy Project to Raspberry Pi

```bash
# On your development machine
scp -r fusion-cassini pi@raspberrypi.local:/home/pi/
```

### 3. Configure Environment

```bash
# SSH into Raspberry Pi
ssh pi@raspberrypi.local

cd fusion-cassini

# Copy and configure environment
cp .env.example .env
nano .env

# Generate a secure SECRET_KEY
openssl rand -hex 32
```

Update `.env` with:
- Your generated `SECRET_KEY`
- Your admin email
- Your Raspberry Pi's IP address in `CORS_ORIGINS`

### 4. Build and Run

```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### 5. Access the Application

On your mobile device or computer on the same network:

- Navigate to `http://raspberrypi.local` or `http://<raspberry-pi-ip>`
- Register a new account
- Install the PWA on your mobile device (Add to Home Screen)

## PWA Installation on Mobile

### iOS (Safari)
1. Open the app in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

### Android (Chrome)
1. Open the app in Chrome
2. Tap the three dots menu
3. Tap "Add to Home Screen"
4. Tap "Add"

## Network Access

### Local Network Only
By default, the app is only accessible on your local network.

### External Access (Port Forwarding)
1. Log into your Freebox admin panel
2. Go to Network Settings → Port Forwarding
3. Forward port 80 to your Raspberry Pi's IP:80
4. Access via your public IP or DynDNS domain

**⚠️ Security Warning**: For production with external access:
- Use HTTPS with Let's Encrypt
- Set up a reverse proxy (Nginx/Traefik) with SSL
- Use strong passwords
- Consider VPN access instead of direct exposure

## Maintenance

### View Logs
```bash
docker-compose logs -f
```

### Restart Services
```bash
docker-compose restart
```

### Update Application
```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build
```

### Backup Database
```bash
# Backup SQLite database
cp backend/app.db backend/app.db.backup

# Backup uploads
tar -czf uploads-backup.tar.gz backend/uploads
```

### Stop Services
```bash
docker-compose down
```

## Troubleshooting

### Cannot access from mobile device
- Ensure mobile is on same WiFi network
- Check Raspberry Pi firewall: `sudo ufw status`
- Try IP address instead of hostname

### Storage issues
- Check available space: `df -h`
- Clean old Docker images: `docker system prune -a`

### Camera not working on iOS
- Must use HTTPS for camera access on iOS (except localhost)
- Set up SSL certificate or use ngrok for testing

## Performance Optimization

For better performance on Raspberry Pi:
- Use Raspberry Pi 4 with 4GB+ RAM
- Use SSD instead of SD card for better I/O
- Monitor resources: `docker stats`

## Support

For issues or questions, contact the admin email configured in your `.env` file.
