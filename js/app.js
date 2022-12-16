/*------------------------------- Constants -------------------------------*/
import { getWord, checkWord } from "../data/words.js";

/*------------------------------- Variables -------------------------------*/
let difficulty, secretWord, winner, lastGuess, currentRow, currentLetter

/*----------------------- Cached Element Referenes ------------------------*/
const diffBtnEls = document.getElementById('difficulties')
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
  const key = evt.key.toLowerCase()
  // check if key is letter
  if (key >= 97 && key <= 122) {
    // add letter to currentGuess
  } else if (key === 'backspace') {
    // remove letter from currentGuess 
  } else if (key === 'enter') {
    // handle word attempt 
  }
}