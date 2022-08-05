const NUMBER_OF_TRIES = 6;
const NUMBER_OF_CHARS = 5;

let wordsDiv = document.getElementById('words');

for (let i = 0; i < NUMBER_OF_TRIES; i++) {
	//for each word we create a div and we give it the class word
	let newEmptyWord = document.createElement('div');
	newEmptyWord.className = 'word';

	for (let j = 0; j < NUMBER_OF_CHARS; j++) {
		//same thing for each character we create a div and we give it the class char and then we add to it every character that is new
		let newEmptyChar = document.createElement('div');
		newEmptyChar.className = 'char';
		newEmptyWord.appendChild(newEmptyChar);
	}
	// then we add the new word to the words div
	wordsDiv.appendChild(newEmptyWord);
}

let currentWord = 0;
let currentChar = 0;

document.addEventListener('keydown', async (event) => {
	handleEvent(event);
});

document.getElementById('keyboard-cont').addEventListener('click', (e) => {
	let event = {
		key: e.target.value,
		code: e.target.value
	};
	if (event.key) {
		handleEvent(event);
	}
});

function clearButton() {
	let event = {
		key: 'Backspace',
		code: 'Backspace'
	};
	handleEvent(event);
}

async function handleEvent(event) {
	if (event.code == 'Enter') {
		let currentGuess = getCurrentWord();
		if (currentChar == NUMBER_OF_CHARS && (await validateEnglish(currentGuess))) {
			let guess = await guesss(currentGuess);
			await colorize(guess);
			colorizeKeyboard(guess, currentGuess);
			currentChar = 0;
			currentWord++;
		} else {
			animateCSS(wordsDiv.children[currentWord], 'shakeX');
		}
	} else if (event.code == 'Backspace') {
		if (currentChar > 0) {
			currentChar--;
			wordsDiv.children[currentWord].children[currentChar].innerHTML = '';
		}
	} else if (currentWord + 1 <= NUMBER_OF_TRIES && currentChar + 1 <= NUMBER_OF_CHARS && isLetter(event.key)) {
		let charDiv = wordsDiv.children[currentWord].children[currentChar];
		charDiv.innerHTML = event.key;
		animateCSS(wordsDiv.children[currentWord].children[currentChar], "pulse")
		currentChar++;
	}
}
function isLetter(c) {
	let asciiValue = c.charCodeAt();
	if (asciiValue >= 97 && asciiValue <= 122) {
		return true;
	} else {
		return false;
	}
}

async function guesss(word) {
		
	let delay = 250 * i
	setTimeout(()=> {
		//flip box
		animateCSS(box, 'flipInX')
		//shade box
		box.style.backgroundColor = letterColor
		shadeKeyBoard(letter, letterColor)
	}, delay)
	try {
		var request = await fetch('/guess/' + word);
		var result = await request.json();
		return result;
	} catch (error) {
		console.log(error);
	}
}

async function validateEnglish(word) {
	try {
		var request = await fetch('/is-english-word/' + word);
		var result = await request.text();
		return result == 'true';
	} catch (error) {
		console.log(error);
	}
}

function getCurrentWord() {
	var word = ''; //init a var to store the word
	var wordDiv = wordsDiv.children[currentWord]; //wordsdiv to go over the characters
	for (var i = 0; i < wordDiv.children.length; i++) {
		// Loop over the characters
		word = word + wordDiv.children[i].innerHTML; //and get each character
	}
	return word; //return the word that the user had typed
}

async function colorize(results) {
	const wordDiv = wordsDiv.children[currentWord].children;
	let number_of_greens = 0;
	for (let i = 0; i < results.length; i++) {
		if (results[i] == 1) {
			number_of_greens++;
			wordDiv[i].style.backgroundColor = 'rgb(121, 168, 107)';
			wordDiv[i].style.color = 'rgb(255, 255, 255)';
		} else if (results[i] == 0) {
			wordDiv[i].style.backgroundColor = 'rgb(197, 181, 102)';
			wordDiv[i].style.color = 'rgb(255, 255, 255)';
		} else {
			wordDiv[i].style.backgroundColor = 'rgb(121, 124, 126)';
			wordDiv[i].style.color = 'rgb(255, 255, 255)';
		}
		await animateCSS(wordDiv[i], 'flipInX');
	}
	if (number_of_greens == NUMBER_OF_CHARS) {
		var modal = document.getElementById("myModal");
		var span = document.getElementsByClassName("close")[0];
		modal.style.display = "block";
		span.onclick = function() {
			modal.style.display = "none";
		}
		window.onclick = function(event) {
			if (event.target == modal) {
			  modal.style.display = "none";
			}
		}
	}
}

function colorizeKeyboard(results, currentGuess) {
	const green = 'rgb(121, 168, 107)';
	const yellow = 'rgb(197, 181, 102)';
	const gray = 'rgb(121, 124, 126)';
	const white = 'rgb(255, 255, 255)';
	for (let i = 0; i < results.length; i++) {
		const currentKey = document.getElementById(currentGuess[i]);
		const keyBackground = window.getComputedStyle(currentKey).backgroundColor;
		if (results[i] == 1) {
			currentKey.style.backgroundColor = green;
			currentKey.style.color = white;
		} else if (results[i] == 0 && keyBackground != green) {
			currentKey.style.backgroundColor = yellow;
			currentKey.style.color = white;
		} else if (keyBackground != green && keyBackground != yellow) {
			currentKey.style.backgroundColor = gray;
			currentKey.style.color = white;
		}
	}
}

const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element
    node.style.setProperty('--animate-duration', '0.4s');
    
    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});

$(document).ready(function() {
    $(".btn-dark").click(function() {
        if($("body").hasClass("light-mode")) {
            $("body").addClass("dark-mode").removeClass("light-mode");
            $("table").addClass("table-dark").removeClass("table-light");
            $(".form-label").addClass("text-light").removeClass("text-dark");
            $(".btn-dark").html("Light Mode");
            $(".btn-dark").addClass("btn-light").removeClass("btn-dark");
        }

        else if($("body").hasClass("dark-mode")) {
            $("body").addClass("light-mode").removeClass("dark-mode");
            $("table").addClass("table-light").removeClass("table-dark");
            $(".form-label").addClass("text-dark").removeClass("text-light");
            $(".btn-light").html("Dark Mode");
            $(".btn-light").addClass("btn-dark").removeClass("btn-light");
        }
    })
})
