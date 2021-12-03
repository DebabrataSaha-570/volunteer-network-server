const express = require('express')
const app = express()
const ObjectId = require('mongodb').ObjectId
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
        const RegisteredEventCollection = database.collection("Registered Events");

        console.log('database connected successfully')

        //POST API

        app.post('/addEvent', async (req, res) => {
            const event = req.body;
            // console.log(event)
            const result = await eventCollection.insertOne(event)
            res.json(result)
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
        })

        app.post('/registeredEvent', async (req, res) => {
            const registeredEvent = req.body;
            console.log(registeredEvent)
            const result = await RegisteredEventCollection.insertOne(registeredEvent)
            res.json(result)
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
        })

        //GET API (all events)
        app.get('/allEvents', async (req, res) => {
            const cursor = eventCollection.find({})
            const result = await cursor.toArray()
            res.json(result)
        })

        app.get('/allRegisteredEvents', async (req, res) => {
            const cursor = RegisteredEventCollection.find({})
            const result = await cursor.toArray()
            res.json(result)
        })


        app.get('/singleEvent/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const singleEvent = await eventCollection.findOne(query)
            // console.log(singleEvent)
            res.json(singleEvent)

        })

        //Delete API
        app.delete('/deleteEvent/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await RegisteredEventCollection.deleteOne(query)
            console.log(result)
            res.json(result)

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