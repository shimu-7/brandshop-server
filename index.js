

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fd2onld.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        //await client.connect();

        const productsCollection = client.db('productsDB').collection('products');

        const cart = client.db('productsDB').collection('cart');

        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await productsCollection.insertOne(newProduct);
            res.send(result);
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productsCollection.findOne(query)
            res.send(result)
        })

        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updatedProduct = req.body;
            const upCoffee = {
                $set: {
                    pName: updatedProduct.pName,
                    bName: updatedProduct.bName,
                    photo: updatedProduct.photo,
                    type: updatedProduct.type,
                    price: updatedProduct.price,
                    rating: updatedProduct.rating,
                    description: updatedProduct.description,


                }
            }
            const result = await productsCollection.updateOne(filter, upCoffee, options);
            res.send(result);
        })

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }

            const result = await productsCollection.deleteOne(query);
            res.send(result);
        })

        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/cart', async (req, res) => {
            const product = req.body;
            console.log(product);
            const result = await cart.insertOne(product);
            res.send(result);
        })


        app.get('/cart', async (req, res) => {
            const cursor = cart.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.delete('/cart/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }

            const result = await cart.deleteOne(query);
            res.send(result);
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);


app.get('/', async (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log(`server is running on ${port}`)
})