#!/bin/bash

# Database Migration Script for VK App
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-vkapp_dev}
DB_USER=${DB_USER:-vkapp_user}
DB_PASSWORD=${DB_PASSWORD:-vkapp_password}

echo -e "${GREEN}🗄️  Starting database migration for VK App${NC}"

# Function to run SQL file
run_sql_file() {
    local file=$1
    echo -e "${YELLOW}📄 Running migration: $file${NC}"
    
    if [ -f "$file" ]; then
        PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$file"
        echo -e "${GREEN}✅ Migration completed: $file${NC}"
    else
        echo -e "${RED}❌ Migration file not found: $file${NC}"
        exit 1
    fi
}

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ psql is not installed. Please install PostgreSQL client tools.${NC}"
    exit 1
fi

# Test database connection
echo -e "${YELLOW}🔌 Testing database connection...${NC}"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database connection successful${NC}"
else
    echo -e "${RED}❌ Database connection failed${NC}"
    exit 1
fi

# Run migrations in order
echo -e "${YELLOW}🔄 Running database migrations...${NC}"

# Create migration tracking table if it doesn't exist
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
CREATE TABLE IF NOT EXISTS schema_migrations (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL UNIQUE,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);" > /dev/null 2>&1

# Run main schema
run_sql_file "database/schema.sql"

# Run any additional migration files
for migration in database/migrations/*.sql; do
    if [ -f "$migration" ]; then
        # Check if migration has already been run
        filename=$(basename "$migration")
        exists=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM schema_migrations WHERE filename = '$filename';" 2>/dev/null | tr -d ' ')
        
        if [ "$exists" = "0" ]; then
            run_sql_file "$migration"
            # Record migration
            PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "INSERT INTO schema_migrations (filename) VALUES ('$filename');" > /dev/null 2>&1
        else
            echo -e "${YELLOW}⏭️  Skipping already executed migration: $filename${NC}"
        fi
    fi
done

echo -e "${GREEN}🎉 Database migration completed successfully!${NC}"
