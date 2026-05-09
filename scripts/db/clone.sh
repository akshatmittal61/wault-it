# Clone production db to local

cleanup() {
    rm -rf ./dumps
}

trap cleanup EXIT


# Pick source DB_URI from .env.production

SOURCE_DB_URI=""
SOURCE_DB_NAME=""

if [ -f ".env.production" ]; then
    SOURCE_DB_URI=$(cat ".env.production" | grep "^DB_URI=" | cut -d'=' -f2-)
    # Extract DB_NAME from DB_URI (string after last / and before ? or end of string)
    SOURCE_DB_NAME=$(echo "$SOURCE_DB_URI" | sed -E 's|.*/([^?]+).*|\1|')
fi

if [ -z "$SOURCE_DB_URI" ]; then
    echo "Please set DB_URI in .env.production"
    exit 1
fi

# Pick destination DB_URI from .env.local else .env

DESTINATION_DB_URI=""

if [ -f ".env.local" ]; then
    DESTINATION_DB_URI=$(cat ".env.local" | grep "^DB_URI=" | cut -d'=' -f2-)
else
    DESTINATION_DB_URI=$(cat ".env" | grep "^DB_URI=" | cut -d'=' -f2-)
fi

if [ -z "$DESTINATION_DB_URI" ]; then
    echo "Please set DB_URI in .env.local or .env"
    exit 1
fi

# Reset any existing production data

echo "Resetting existing production data..."
rm -rf ./dumps

# Use mongo dump commands to dump production db to a folder
# Restore it to local

echo "Dumping production db from $SOURCE_DB_URI..."
mongodump --uri="$SOURCE_DB_URI" --out=./dumps/production_data

if [ $? -ne 0 ]; then
    echo "Failed to dump production db!"
    exit 1
fi

echo "Restoring production db to $DESTINATION_DB_URI..."
mongorestore --uri="$DESTINATION_DB_URI" ./dumps/production_data/$SOURCE_DB_NAME

if [ $? -ne 0 ]; then
    echo "Failed to restore production db!"
    exit 1
fi


echo "Resetting any existing auth mappings..."
mongosh "$DESTINATION_DB_URI" --eval "db.authmappings.deleteMany({})"

if [ $? -ne 0 ]; then
    echo "Failed to reset auth mappings!"
    exit 1
fi

echo "Done!"
