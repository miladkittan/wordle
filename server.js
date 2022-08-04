const express = require('express');
let wordlist = require('./wordlist.js');
wordlist = wordlist['wordlist'];

const GREY = -1;
const YELLOW = 0;
const GREEN = 1;
const app = express();
const PORT = process.env.PORT || 3000;

let rand = Math.floor(Math.random() * wordlist.length);
let wordle = wordlist[rand];

console.log(wordle);

app.use(express.static('public'));

app.get('/guess/:word', (req, res) => {
	let userGuess = req.params.word;
	let responses = [];
	for (let i = 0; i < userGuess.length; i++) {
		if (userGuess[i] == wordle[i]) {
			responses.push(GREEN);
		} else {
			responses.push(-9);
		}
	}
	for (let i = 0; i < userGuess.length; i++) {
		let ch = userGuess[i];
		if (responses[i] != GREEN) {
			if (is_char_in_empty_place(responses, ch)) {
				responses[i] = YELLOW;
			} else {
				responses[i] = GREY;
			}
		}
	}
	res.json(responses);
});

const is_char_in_empty_place = (responses, ch) => {
	for (var i = 0; i < wordle.length; i++) {
		if (ch == wordle.charAt(i) && responses[i] != GREEN) {
			return true;
		}
	}
	return false;
};

app.get('/is-english-word/:word', (req, res) => {
	let userGuess = req.params.word;
	if (wordlist.includes(userGuess)) {
		res.send(true);
	} else {
		res.send(false);
	}
});

app.get('/update_wordle/:secret', (req, res) => {
	if (req.params.secret == 'julianOnlyCanUpdateTheWordle') {
		rand = Math.floor(Math.random() * wordlist.length);
		wordle = wordlist[rand];
		console.log(wordle);
		res.redirect('/');
	} else {
		res.send('You dont have permission');
	}
});
app.listen(PORT, () => {
	console.log('My server running on port 3000');
});
