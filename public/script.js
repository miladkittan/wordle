const NUMBER_OF_WORDS = 6;
const NUMBER_OF_CHARS = 5;

let currentChar = 0;
let currentWord = 0;
let containerDiv = document.getElementById("container");
let gameOver = false;

function getWord() {
    let user_word = "";
    
    if (currentChar == 5) {
        let wordDiv = containerDiv.children[currentWord];
        for (let i = 0; i < wordDiv.children.length; i++) {
            user_word = user_word + wordDiv.children[i].innerHTML;
        }
        return user_word;
    }
}

for (let i = 0; i < NUMBER_OF_WORDS; i++) {
    let word = document.createElement("div");
    word.className = "word";
    for (let j = 0; j < NUMBER_OF_CHARS; j++) {
        let char = document.createElement("div");
        char.className = "char";
        word.appendChild(char);
    }
    containerDiv.appendChild(word);
}

document.addEventListener("keydown", (event) => {
    let letter = event.key;
    let wordDiv = containerDiv.children[currentWord];
    
    if (letter === "Backspace" && currentChar > 0) {
        let charDiv = wordDiv.children[currentChar - 1];
        animateCSS(charDiv, "shakeX");
        currentChar--;
        charDiv.innerHTML = "";
    } else if (isLetter(letter) && currentChar < 5) {
        let charDiv = wordDiv.children[currentChar];
        charDiv.innerHTML = letter.toUpperCase();
        currentChar++;
    } else if (letter === "Enter" && currentChar === 5 && currentWord < 7) {
        fetch(`/word/${getWord()}`).then((res) => res.json()).then((res) => {
            res.forEach((color, i) => {
                if (color == "gray")
                    wordDiv.children[i].style.backgroundColor = "#423E3B";
                
                else if (color == "yellow")
                    wordDiv.children[i].style.backgroundColor = "#FFA737";
                
                else
                    wordDiv.children[i].style.backgroundColor = "#90A959";
                
                animateCSS(wordDiv.children[i], "flipInX");
            });
            
            if (res === false) {
                animateCSS(containerDiv, "shakeX");
            }
            
            for (let i = 0; i < res.length; i++) {
                if (res[i] === "yellow" || res[i] === "gray") {
                    gameOver = false;
                    break;
                } else {
                    gameOver = true;
                }
            }

            if (gameOver === true) {
                alert("You Won!");
            }

            if (currentWord === 7 && gameOver === false) {
                alert("Game Over");
            }
        });
        currentChar = 0;
        currentWord++;
    }
});

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}

const animateCSS = (element, animation, prefix = "animate__") =>
    // We create a Promise and return it
    new Promise((resolve, reject) => {
        const animationName = `${prefix}${animation}`;
        element.classList.add(`${prefix}animated`, animationName);

        // When the animation ends, we clean the classes and resolve the Promise
        function handleAnimationEnd(event) {
            event.stopPropagation();
            element.classList.remove(`${prefix}animated`, animationName);
            resolve("Animation ended");
        }

        element.addEventListener("animationend", handleAnimationEnd, {
            once: true,
        });
    });