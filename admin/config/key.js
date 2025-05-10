const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://Ngocan12:Ngocan1234@ac-dwfcuf3.ukksayw.mongodb.net/WEBCTT2?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connectDB() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("✅ Connected to MongoDB!");
    } catch (err) {
        console.error("❌ MongoDB error:", err);
    }
}

module.exports = connectDB;