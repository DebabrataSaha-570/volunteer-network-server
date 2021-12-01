const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 5000

require('dotenv').config()

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.imkxn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("volunteerNetwork");
        const eventCollection = database.collection("Events");
        // create a document to insert
        app.post('/addEvent', async (req, res) => {
            const event = req.body;
            console.log(event)
            const result = await eventCollection.insertOne(event)
            res.json(result)
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Hello Volunteers!!')
})

app.listen(port, () => {
    console.log('volunteer network app listening at', port)
})