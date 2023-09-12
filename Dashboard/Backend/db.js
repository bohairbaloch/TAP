const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://admin:admin@scraper.id9n8cs.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connect() {
    try {
        await client.connect();
        const db = client.db("scrapyMain");
        console.log("Connected to MongoDB");
        return db;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

module.exports = { connect };
