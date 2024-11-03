const express = require("express");
const port = process.env.PORT || 3000
const app = express();

const words = ["APPLE", "BRAVE", "CIDER", "DREAM", "EAGLE", "FRESH", "GRAPE", "HELLO"];

function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
}

const randomWord = getRandomWord();

const theWord = randomWord;

app.get("/word/:guess", (req, res) => {
  const guess = req.params.guess;

  let theWordMap = {};

  for (let letter of theWord) {
    let count = occurrences(theWord, letter);
    theWordMap[letter] = count;
  }

  let responseMap = [];
  for (let i = 0; i < guess.length; i++) {
    let letterInGuess = guess[i];
    if (theWordMap[letterInGuess] !== undefined) {
      if (letterInGuess == theWord[i] && theWordMap[letterInGuess] !== 0) {
        responseMap.push("green");
        theWordMap[letterInGuess]--;
      } else if (theWordMap[letterInGuess] !== 0) {
        responseMap.push("yellow");
        theWordMap[letterInGuess]--;
      }
    } else {
      responseMap.push("gray");
    }
  }
  console.log(responseMap);
  res.send(responseMap);
});

/** Function that count occurrences of a substring in a string;
 * @param {String} string               The string
 * @param {String} subString            The sub string to search for
 * @param {Boolean} [allowOverlapping]  Optional. (Default:false)
 *
 * @author Vitim.us https://gist.github.com/victornpb/7736865
 * @see Unit Test https://jsfiddle.net/Victornpb/5axuh96u/
 * @see https://stackoverflow.com/a/7924240/938822
 */
function occurrences(string, subString, allowOverlapping) {
  string += "";
  subString += "";
  if (subString.length <= 0) return string.length + 1;

  var n = 0,
    pos = 0,
    step = allowOverlapping ? 1 : subString.length;

  while (true) {
    pos = string.indexOf(subString, pos);
    if (pos >= 0) {
      ++n;
      pos += step;
    } else break;
  }
  return n;
}

app.get("/check", (req, res) => {});
app.use(express.static("public"));
app.listen(port, () => console.log("Server running on port " + 3000));
