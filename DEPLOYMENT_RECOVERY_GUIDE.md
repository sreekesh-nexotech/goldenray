# Production Server Disk Space Recovery Guide

## Problem Summary
Your deployment failed with the error: `E: You don't have enough free space in /var/cache/apt/archives/`

This happens when the production server runs out of disk space, commonly due to accumulated Docker images, containers, build cache, and system logs.

---

## IMMEDIATE FIX - Step by Step

### Step 1: Check Current Disk Usage
```bash
# SSH into your production server first
ssh your-production-server

# Check overall disk usage
df -h

# Check what's using space
du -sh /* | sort -hr | head -20
```

### Step 2: Run the Cleanup Script
```bash
# Navigate to your deployment directory
cd /home/officialraygolden/goldenray

# Download the cleanup script from this repository
wget https://raw.githubusercontent.com/sreekesh-nexotech/goldenray/main/cleanup-server.sh

# Make it executable
chmod +x cleanup-server.sh

# Run the cleanup
sudo ./cleanup-server.sh
```

This script will:
- Remove stopped Docker containers
- Remove unused Docker images
- Remove unused Docker volumes
- Clean Docker build cache
- Clean APT package cache
- Remove old log files
- Clean journal logs

### Step 3: Verify Space is Available
```bash
# Check disk space again
df -h

# You should now have several GB free
```

### Step 4: Deploy Again
```bash
# Download the updated deploy script
wget https://raw.githubusercontent.com/sreekesh-nexotech/goldenray/main/deploy.sh

# Make it executable
chmod +x deploy.sh

# Run deployment
sudo ./deploy.sh
```

---

## MANUAL CLEANUP (If Script Doesn't Free Enough Space)

### Docker Cleanup Commands

```bash
# 1. Stop all running containers
docker-compose down

# 2. Remove ALL stopped containers
docker container prune -a -f

# 3. Remove ALL unused images (be careful - this removes all images not in use)
docker image prune -a -f

# 4. Remove ALL unused volumes
docker volume prune -f

# 5. Remove ALL build cache
docker builder prune -a -f

# 6. Check Docker disk usage
docker system df

# 7. Nuclear option - remove everything (only if you can rebuild)
docker system prune -a -f --volumes
```

### System Cleanup Commands

```bash
# 1. Clean APT cache
sudo apt-get clean
sudo apt-get autoclean
sudo apt-get autoremove -y

# 2. Remove old kernels (keep current and one previous)
sudo apt-get autoremove --purge -y

# 3. Clean journal logs (keep only last 3 days)
sudo journalctl --vacuum-time=3d

# 4. Remove old log files
sudo find /var/log -type f -name "*.log" -mtime +7 -delete
sudo find /var/log -type f -name "*.gz" -delete

# 5. Clean temporary files
sudo rm -rf /tmp/*
sudo rm -rf /var/tmp/*

# 6. Clean thumbnail cache
sudo rm -rf ~/.cache/thumbnails/*
```

### Find Large Files

```bash
# Find the largest 20 files in /var
sudo du -ah /var | sort -rh | head -20

# Find the largest 20 files in /home
sudo du -ah /home | sort -rh | head -20

# Find files larger than 100MB
sudo find / -type f -size +100M -exec ls -lh {} \; 2>/dev/null
```

---

## PREVENTING FUTURE ISSUES

### 1. Set Up Automatic Cleanup (Recommended)

Create a cron job to clean Docker resources weekly:

```bash
# Edit crontab
sudo crontab -e

# Add this line to run cleanup every Sunday at 2 AM
0 2 * * 0 /home/officialraygolden/goldenray/cleanup-server.sh > /var/log/docker-cleanup.log 2>&1
```

### 2. Configure Docker to Limit Resources

Create `/etc/docker/daemon.json`:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2"
}
```

Then restart Docker:
```bash
sudo systemctl restart docker
```

### 3. Monitor Disk Space

Set up monitoring to alert when disk space is low:

```bash
# Create a monitoring script
sudo nano /usr/local/bin/check-disk-space.sh
```

Add this content:
```bash
#!/bin/bash
THRESHOLD=80
CURRENT=$(df / | grep / | awk '{ print $5}' | sed 's/%//g')

if [ "$CURRENT" -gt "$THRESHOLD" ]; then
    echo "Disk space is above ${THRESHOLD}% (${CURRENT}% used)"
    # Add email notification or logging here
fi
```

Make it executable and add to cron:
```bash
sudo chmod +x /usr/local/bin/check-disk-space.sh
sudo crontab -e
# Add: 0 */6 * * * /usr/local/bin/check-disk-space.sh
```

---

## ROOT CAUSE ANALYSIS

The issue occurred because:

1. **Docker accumulation**: Each deployment creates new images and containers. Old ones aren't automatically removed.

2. **Build cache**: Docker caches build layers. This grows over time.

3. **System logs**: Application and system logs accumulate.

4. **No automatic cleanup**: Without scheduled cleanup, these resources keep growing.

---

## UPDATED DEPLOYMENT PROCESS

The new `deploy.sh` script includes:

- ✅ Automatic disk space checking before deployment
- ✅ Automatic cleanup when space is low
- ✅ Better error handling
- ✅ Post-deployment cleanup
- ✅ Safer GitHub token handling

The script will now:
1. Check available disk space
2. Run cleanup if needed
3. Clone fresh code
4. Build images
5. Deploy
6. Clean up old resources

---

## TROUBLESHOOTING

### Still Getting Out of Space Errors?

1. **Check if you have large log files:**
   ```bash
   sudo du -sh /var/log/*
   ```

2. **Check if Docker is using too much space:**
   ```bash
   docker system df -v
   ```

3. **Check for orphaned volumes:**
   ```bash
   docker volume ls -qf dangling=true
   ```

4. **Consider expanding disk space:**
   - If on cloud provider (AWS, DigitalOcean, etc.), increase volume size
   - If on physical server, add additional storage

### Contact Information

If you continue having issues after following this guide, please provide:
- Output of `df -h`
- Output of `docker system df`
- Output of `du -sh /var/* | sort -hr`

---

## Quick Reference Commands

```bash
# Check disk space
df -h

# Clean everything Docker (DESTRUCTIVE)
docker system prune -a -f --volumes

# Clean system
sudo apt-get clean && sudo apt-get autoremove -y

# Check what's using space
du -sh /* | sort -hr | head -10

# Run full cleanup
sudo ./cleanup-server.sh

# Deploy with new script
sudo ./deploy.sh
```

---

## Files Created

This fix includes these new files:

1. **cleanup-server.sh** - Comprehensive cleanup script
2. **deploy.sh** - Improved deployment script with automatic space management
3. **docker-compose.yml** - Docker compose configuration
4. **docker-compose.override.yml** - Production-specific settings with log rotation
5. **DEPLOYMENT_RECOVERY_GUIDE.md** - This guide

---

**Last Updated**: January 17, 2026
