const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
const app = express();

var db

MongoClient.connect('mongodb://dbuser:Pass0000@ds237669.mlab.com:37669/quotes', (err, client) => {
	if (err) return console.log(err)

	db = client.db('quotes')

	app.listen(3000, function() {
		console.log('listening on 3000')
	})
})	

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
//	res.sendFile(__dirname + '/index.html')
	db.collection('quotes').find().toArray((err, results) => {
		if (err) return console.log(err)

		res.render('index.ejs', {quotes: results})
	})
})

app.post('/quotes', (req, res) => {
	db.collection('quotes').save(req.body, (err, results) => {

		if (err) return console.log(err)

		console.log('Saved to Database')
		res.redirect('/')
	})
})

app.put('/quotes', (req, res) => {
  db.collection('quotes').findOneAndUpdate({
    name: 'Yoda'
  }, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
      res.send(result)
  })
})

app.delete('/quotes', (req, res) => {
  db.collection('quotes').findOneAndDelete({name: req.body.name},
  (err, result) => {
    if (err) return res.send(500, err)
    res.send({message: 'A darth vadar quote got deleted'})
  })
})
