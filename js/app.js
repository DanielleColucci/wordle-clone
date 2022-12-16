/*------------------------------- Constants -------------------------------*/
import { getWord, checkWord } from "../data/words.js";

/*------------------------------- Variables -------------------------------*/
let difficulty, secretWord, winner, lastGuess, currentRow, currentLetter

/*----------------------- Cached Element Referenes ------------------------*/
const diffBtnEls = document.getElementById('difficulties')
const messageEl = document.getElementById('message')
const body = document.querySelector('body')
const main = document.querySelector('main')
const keyboardEls = document.getElementById('keyboard')
const resetBtnEl = document.getElementById('reset-button')

/*---------------------------- Event Listeners ----------------------------*/
diffBtnEls.addEventListener('click', chooseDifficulty)
body.addEventListener('keydown', handleKeyPress)

/*------------------------------- Functions -------------------------------*/

function chooseDifficulty(evt) {
  if (evt.target.className === 'mode') {
    difficulty = Number(evt.target.id[5])
    diffBtnEls.style.display = 'none'
    messageEl.innerText = ''
    init()
  }
}

function init() {
  secretWord = getWord(difficulty)
  winner = false 
  lastGuess = ''
  currentRow = 1
  currentLetter = 0
  main.style.display = 'block';
}

function handleKeyPress(evt) {
  // check if difficulty has been selected
  if (secretWord) {
    const key = evt.key.toLowerCase()

    // check if key is single letter and lastGuess is no more than 5 letters
    if (key.length === 1 && /[a-z]/i.test(key) && lastGuess.length < 5) {
      lastGuess += key
    } else if (key === 'backspace') {
      lastGuess = lastGuess.slice(0, -1)
    } else if (key === 'enter') {
      // handle word attempt 
    }
  }
} 