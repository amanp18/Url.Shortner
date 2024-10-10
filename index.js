const express = require("express")
const app = express()
const urlRoute = require('./routes/url')
const { connectToMongoDB } = require('./connect')
const PORT = 8000;
const URL = require('./models/url')
connectToMongoDB('mongodb://localhost:27017/short-url').then(() => console.log('mongo connected'))

app.use(express.json())
app.use('/url', urlRoute)

app.get('/:shortId', async(req, res) => {
    const shortId = req.params.shortId;
    const entry= await URL.findOneAndUpdate({
        shortId,
    }, {
        $push: { visitHistory: {
            timestamp: Date.now(),
        } },
    }
    )
    res.redirect(`${entry.redirectURL}`)
})
app.listen(PORT, () => console.log('server started at port'))