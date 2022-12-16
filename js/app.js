/*------------------------------- Constants -------------------------------*/
import { getWord, checkWord } from "../data/words.js";
const board = [
  [null, null, null, null, null], 
  [null, null, null, null, null], 
  [null, null, null, null, null], 
  [null, null, null, null, null], 
  [null, null, null, null, null], 
  [null, null, null, null, null]
]

/*------------------------------- Variables -------------------------------*/
let difficulty, secretWord, winner, lastGuess, currentRow, currentLetter

/*----------------------- Cached Element Referenes ------------------------*/
const diffBtnEls = document.getElementById('difficulties')
const messageEl = document.getElementById('message')
const bodyEl = document.querySelector('body')
const mainEl = document.querySelector('main')
const keyboardEls = document.getElementById('keyboard')
const resetBtnEl = document.getElementById('reset-button')

/*---------------------------- Event Listeners ----------------------------*/
diffBtnEls.addEventListener('click', chooseDifficulty)
bodyEl.addEventListener('keydown', handleKeyPress)

/*------------------------------- Functions -------------------------------*/

function chooseDifficulty(evt) {
  if (evt.target.className === 'mode') {
    difficulty = Number(evt.target.id[5])
    diffBtnEls.style.display = 'none'
    messageEl.textContent = ''
    init()
  }
}

function init() {
  secretWord = getWord(difficulty)
  winner = false 
  lastGuess = ''
  currentRow = 0
  currentLetter = 0
  mainEl.style.display = 'block';
}

function handleKeyPress(evt) {
  // check if difficulty has been selected
  if (secretWord) {
    const key = evt.key.toUpperCase()

    // check if key is single letter and lastGuess is no more than 5 letters
    if (key.length === 1 && /[A-Z]/i.test(key) && lastGuess.length < 5) {
      lastGuess += key
      board[currentRow][currentLetter] = key
      currentLetter++
      render()
      // put key in appropriate box
    } else if (key === 'BACKSPACE') {
      lastGuess = lastGuess.slice(0, -1)
      currentLetter--
      render()
      // remove key from appropriate box 
    } else if (key === 'ENTER') {
      // handle word attempt 
    }
  }
} 

function render() {

}