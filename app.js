const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
const app = express();

var db

MongoClient.connect('mongodb://awu:save%24800K@ds237669.mlab.com:37669/quotes', (err, client) => {
	if (err) return console.log(err)

	db = client.db('quotes')

	app.listen(3000, function() {
		console.log('listening on 3000')
	})
})	

app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html')
})

app.post('/quotes', (req, res) => {
	db.collection('quotes').save(req.body, (err, result) => {
		if (err) return console.log(err)

		console.log('Saved to Database')
		res.redirect('/')
	})
})
