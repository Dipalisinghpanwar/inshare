const express = require('express')
const app = express()
const path = require('path')


PORT = process.env.PORT || 3000

//For static folder
app.use(express.static('public'))

app.use(express.json()) //express middleware

//database
require('./config/db')



//Template engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs')


//Routes
app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'))
app.use('/files/download', require('./routes/download'))


app.listen(PORT, () =>{
    console.log(`Listening on port ${PORT}`)
})
