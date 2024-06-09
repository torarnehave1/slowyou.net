from pymongo import MongoClient
from pymongo.errors import ConnectionFailure

# Create a client
# client = MongoClient('mongodb://localhost:27017/')
client = MongoClient('mongodb+srv://torarnehave:Q3AYMtCA62tOWNk1@cluster0.wcbzj0t.mongodb.net/slowyounet')

# Connect to your database
db = client['slowyounet']

try:
    # The ismaster command is cheap and does not require auth.
    client.admin.command('ismaster')
    print("MongoDB is connected!")

    # Inserting a document into the "user" collection
    user_collection = db['users']
    user_document = {
        "name": "John Doe",
        "email": "john@example.com",
        "age": 30
    }
    user_collection.insert_one(user_document)
    print("Document inserted into the 'user' collection.")
except ConnectionFailure:
    print("Server not available")
