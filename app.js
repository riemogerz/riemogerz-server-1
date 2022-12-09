if (process.env.NODE_ENV !== `production`) require('dotenv').config();

const express = require('express')
const app = express()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')
const server = require('http').Server(app);
const io = require('socket.io')(server);

const port = process.env.PORT || 3000
const routes = require('./routes/index')

app.use(cors())
app.use(express.urlencoded({ extended: true }))

// Config Socket.io
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(function (req, res, next) {
	req.io = io;
	next();
});

// Connect to Mongo.db
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/realtime_chart");
const schema = mongoose.Schema({ name: String });
const Vote = mongoose.model('Vote', schema);

app.post('/polling', (req, res, next) => {
	try {
		const field = [{ name: req.body.name }];
		const newVote = new Vote(field[0]);
		newVote.save(function (err, data) {
			console.log('Saved');
		});

		console.log(newVote, '------- newVote');

		Vote.aggregate([{
			"$group": {
				"_id": "$name",
				"total_vote": { "$sum": 1 }
			}
		}],
			function (err, results) {
				if (err) throw { name: 'NggakTau' };
				req.io.sockets.emit('vote', results);
			}
		);

		res.status(201).json({ 'message': 'Berhasil ditambahkan' });
	} catch (error) {
		next(error)
	}
})

app.get('/data', (req, res, next) => {
	try {
		Vote.find().exec(function (err, msgs) {
			if (err) throw { name: 'NggakTau' };

			let countPolling = msgs.map(el => el.name)

			let person = {};
			for (let i = 0; i < countPolling.length; i++) {
				if (person[countPolling[i]] === undefined) {
					person[countPolling[i]] = 1
				} else {
					person[countPolling[i]]++
				}
			}
			let send = Object.entries(person)
			res.status(200).json(send);
		});
	} catch (error) {
		next(error)
	}
});


app.use('/', routes)
// Setting Socket.io
io.on('connection', function (socket) {
	Vote.aggregate([{
		"$group": {
			"_id": "$name",
			"total_vote": { "$sum": 1 }
		}
	}],
		(err, results) => {
			if (err) throw err;
			console.log(err, results, '<<< socket.io');
			socket.emit('vote', results);
		}
	);
});

if (process.env.NODE_ENV !== `test`) {
	app.listen(port, () => {
		console.log(`Example app listening on port ${port}`)
	})

} else {
	module.exports = app
}