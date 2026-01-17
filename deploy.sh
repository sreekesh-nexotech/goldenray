#!/bin/bash

# =================================================================
# Secure Deployment Script for GoldenRay Production
# =================================================================
# This script deploys the GoldenRay application with automatic
# disk space management and cleanup.
#
# Usage: sudo ./deploy.sh
# =================================================================

set -e

GITHUB_REPO="sreekesh-nexotech/goldenray"
DEPLOY_DIR="/home/officialraygolden"
APP_DIR="${DEPLOY_DIR}/goldenray"
MIN_FREE_SPACE_GB=5  # Minimum required free space in GB

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check available disk space
check_disk_space() {
    local available_kb=$(df /var | tail -1 | awk '{print $4}')
    local available_gb=$((available_kb / 1024 / 1024))

    echo ""
    print_info "Available disk space: ${available_gb} GB"

    if [ $available_gb -lt $MIN_FREE_SPACE_GB ]; then
        print_warn "Low disk space detected! (${available_gb} GB available, ${MIN_FREE_SPACE_GB} GB recommended)"
        print_info "Running automatic cleanup..."
        cleanup_docker_resources

        # Check again after cleanup
        available_kb=$(df /var | tail -1 | awk '{print $4}')
        available_gb=$((available_kb / 1024 / 1024))

        if [ $available_gb -lt $MIN_FREE_SPACE_GB ]; then
            print_error "Still low on disk space after cleanup (${available_gb} GB available)"
            print_error "Please run './cleanup-server.sh' for more aggressive cleanup"
            return 1
        else
            print_info "Cleanup successful! Now have ${available_gb} GB available"
        fi
    fi
    echo ""
}

# Function to cleanup Docker resources
cleanup_docker_resources() {
    print_info "Cleaning up Docker resources..."

    # Remove stopped containers
    docker container prune -f 2>/dev/null || true

    # Remove dangling images (not used by any container)
    docker image prune -f 2>/dev/null || true

    # Remove build cache older than 24h
    docker builder prune -f --filter "until=24h" 2>/dev/null || true

    print_info "Docker cleanup complete"
}

# Function to cleanup on error
cleanup_on_error() {
    print_error "Deployment failed! Performing cleanup..."

    # Stop containers
    if [ -d "$APP_DIR" ]; then
        cd "$APP_DIR"
        docker-compose down 2>/dev/null || true
    fi

    # Clear GitHub token from memory
    unset GITHUB_TOKEN

    print_info "GitHub token cleared from memory."
}

# Set trap for cleanup on error
trap cleanup_on_error ERR

echo "==================================================================="
echo "=== Starting Secure Deployment Setup ==="
echo "==================================================================="
echo ""

# Check disk space before starting
check_disk_space || exit 1

# Prompt for GitHub token
print_info "Prompting for GitHub token..."
echo -n "Enter GitHub Token (will not be displayed): "
read -s GITHUB_TOKEN
echo ""
print_info "GitHub token received."
echo ""

# Remove existing repository directory
if [ -d "$APP_DIR" ]; then
    print_info "Removing existing repository directory..."
    cd "$DEPLOY_DIR"
    rm -rf goldenray
fi

# Clone repository
print_info "Cloning repository..."
git clone https://${GITHUB_TOKEN}@github.com/${GITHUB_REPO}.git
cd "$APP_DIR"

# Clear GitHub token from command history
unset GITHUB_TOKEN
print_info "GitHub token cleared from memory."
echo ""

# Check disk space before building
check_disk_space || exit 1

# Stop existing containers
print_info "Stopping existing containers..."
docker-compose down 2>/dev/null || true
echo ""

# Build Docker images with no-cache option for fresh build
print_info "Building Docker images..."
if ! docker-compose build --no-cache; then
    print_error "Docker build failed!"
    exit 1
fi
echo ""

# Start services
print_info "Starting services..."
if ! docker-compose up -d; then
    print_error "Failed to start services!"
    exit 1
fi
echo ""

# Wait for services to be healthy
print_info "Waiting for services to start..."
sleep 5
echo ""

# Show running containers
print_info "Running containers:"
docker-compose ps
echo ""

# Show disk usage after deployment
print_info "Final disk usage:"
df -h / | awk 'NR==1 || /\/$/'
echo ""

# Cleanup old Docker resources after successful deployment
print_info "Performing post-deployment cleanup..."
cleanup_docker_resources
echo ""

echo "==================================================================="
echo "=== Deployment Complete! ==="
echo "==================================================================="
echo ""
print_info "Application is now running!"
print_info "You can check logs with: docker-compose logs -f"
print_info "You can check status with: docker-compose ps"
echo ""
