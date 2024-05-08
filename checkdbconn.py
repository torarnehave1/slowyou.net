from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

# Create a client
client = MongoClient('mongodb://localhost:27017/')

# Connect to your database
db = client['slowyounetpython']

try:
    # The ismaster command is cheap and does not require auth.
    client.admin.command('ismaster')
    print("MongoDB is connected!")
except ConnectionFailure:
    print("Server not available")
