/*------------------------------- Constants -------------------------------*/
import { getWord, checkWord } from "../data/words.js";
const board = [
  null, null, null, null, null, 
  null, null, null, null, null, 
  null, null, null, null, null, 
  null, null, null, null, null, 
  null, null, null, null, null, 
  null, null, null, null, null
]

/*------------------------------- Variables -------------------------------*/
let difficulty, secretWord, winner, currentGuess, currentRow, currentLetter

/*----------------------- Cached Element Referenes ------------------------*/
const diffBtnEls = document.getElementById('difficulties')
const messageEl = document.getElementById('message')
const bodyEl = document.querySelector('body')
const mainEl = document.querySelector('main')
const sqrEls = document.querySelectorAll('.sqr')
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
  currentGuess = ''
  currentRow = 0
  currentLetter = 0
  mainEl.style.display = 'block';
}

function handleKeyPress(evt) {
  // check if difficulty has been selected
  if (secretWord) {
    const key = evt.key.toUpperCase()

    // check if key is single letter and lastGuess is no more than 5 letters
    if (key.length === 1 && /[A-Z]/i.test(key) && currentLetter < 5) {
      placeLetter(evt)
    } else if (key === 'BACKSPACE') {
      placeLetter(evt)
    } else if (key === 'ENTER') {
      handleGuess()
    }
  }
  updateBoard()
} 

function placeLetter(evt) {
  const key = evt.key.toUpperCase()
  if (key === 'BACKSPACE') {
    currentGuess.slice(0, -1) 
    currentLetter--
    board[currentRow + currentLetter] = null
  } else {
    currentGuess += key
    board[currentRow + currentLetter] = key
    currentLetter++
  }
}

function updateBoard() {
  board.forEach((sqrText, idx) => sqrEls[idx].textContent = sqrText)
}

function handleGuess() {
  if (currentLetter === 5 && checkWord(currentGuess)) {
    checkWinner()
    currentRow++
  } else {
    // invalid guess animation 
  }
}

function checkWinner() {
  if (currentGuess === secretWord && currentRow <= 5) {
    winner = true
  }
}