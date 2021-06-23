// Import packages
const express = require('express')

// App & port
const app = express()
const port = 8000

// First route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello world in Blue' })
})

// Starting server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})