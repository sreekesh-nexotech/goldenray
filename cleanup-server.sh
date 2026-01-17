#!/bin/bash

# =================================================================
# Production Server Cleanup Script
# =================================================================
# This script cleans up disk space by removing unused Docker resources
# and system cache files.
#
# Usage: sudo ./cleanup-server.sh
# =================================================================

set -e

echo "==================================================================="
echo "Production Server Cleanup Script"
echo "==================================================================="
echo ""

# Function to display disk usage
show_disk_usage() {
    echo "Current Disk Usage:"
    df -h / | awk 'NR==1 || /\/$/'
    echo ""
}

# Function to display Docker disk usage
show_docker_usage() {
    echo "Docker Disk Usage:"
    docker system df 2>/dev/null || echo "Docker not running or not installed"
    echo ""
}

# Show initial state
echo ">>> BEFORE CLEANUP <<<"
show_disk_usage
show_docker_usage

# Ask for confirmation
echo "This script will perform the following cleanup operations:"
echo "  1. Remove stopped containers"
echo "  2. Remove unused Docker images"
echo "  3. Remove unused Docker volumes"
echo "  4. Remove Docker build cache"
echo "  5. Clean APT cache"
echo "  6. Clean system logs (older than 7 days)"
echo "  7. Remove old journal logs"
echo ""
read -p "Do you want to continue? (yes/no): " -r
echo ""

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo "Cleanup cancelled."
    exit 0
fi

echo "==================================================================="
echo "Starting Cleanup Process..."
echo "==================================================================="
echo ""

# 1. Docker Cleanup
echo "[1/7] Cleaning Docker containers..."
docker container prune -f 2>/dev/null || echo "No containers to remove"
echo ""

echo "[2/7] Cleaning Docker images..."
docker image prune -a -f 2>/dev/null || echo "No images to remove"
echo ""

echo "[3/7] Cleaning Docker volumes..."
docker volume prune -f 2>/dev/null || echo "No volumes to remove"
echo ""

echo "[4/7] Cleaning Docker build cache..."
docker buildx prune -f 2>/dev/null || docker builder prune -f 2>/dev/null || echo "No build cache to remove"
echo ""

# 2. System Cleanup
echo "[5/7] Cleaning APT cache..."
apt-get clean 2>/dev/null || echo "APT clean skipped"
rm -rf /var/cache/apt/archives/*.deb 2>/dev/null || echo "No APT archives to remove"
echo ""

echo "[6/7] Cleaning old system logs..."
find /var/log -type f -name "*.log" -mtime +7 -delete 2>/dev/null || echo "No old logs to remove"
find /var/log -type f -name "*.gz" -delete 2>/dev/null || echo "No compressed logs to remove"
echo ""

echo "[7/7] Cleaning journal logs..."
journalctl --vacuum-time=7d 2>/dev/null || echo "Journal cleanup skipped"
echo ""

# Show final state
echo "==================================================================="
echo ">>> AFTER CLEANUP <<<"
echo "==================================================================="
show_disk_usage
show_docker_usage

echo "==================================================================="
echo "Cleanup Complete!"
echo "==================================================================="
echo ""
echo "If you still need more space, consider:"
echo "  - Removing unused applications: apt-get autoremove"
echo "  - Checking large files: du -sh /* | sort -hr | head -20"
echo "  - Checking specific directories: du -sh /var/* | sort -hr"
echo ""
