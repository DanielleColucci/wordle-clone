/*------------------------------- Constants -------------------------------*/
import { getWord, checkWord } from "../data/words.js";

/*------------------------------- Variables -------------------------------*/
let difficulty, board, secretWord, winner, currentGuess, currentRow, currentLetter, loss

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
    messageEl.style.visibility = 'hidden'
    init()
  }
}

function init() {
  secretWord = getWord(difficulty)
  board = Array(30).fill(null, 0)
  winner = false 
  loss = false
  currentGuess = ''
  currentRow = 0
  currentLetter = 0
  mainEl.style.display = 'block';
  updateBoard()
  resetColors()
}

function render() {
  updateBoard()
  updateMessage()
}

function updateBoard() {
  board.forEach((sqrText, idx) => sqrEls[idx].textContent = sqrText)
}

function updateMessage() {
  if (winner) {
    messageEl.style.visibility = 'visible'
    messageEl.textContent = `You got it in ${currentRow}! Play again?`
    diffBtnEls.style.display = 'flex'
  }
  if (loss) {
    messageEl.style.visibility = 'visible'
    messageEl.textContent = `The word was ${secretWord}. Play again?`
    diffBtnEls.style.display = 'flex'
  }
}

function handleKeyPress(evt) {
  // check if game has been initialized 
  if (secretWord) {
    const key = evt.key.toUpperCase()

    // check if key is single letter and lastGuess is no more than 5 letters
    if (key.length === 1 && /[A-Z]/i.test(key) && currentLetter < 5) {
      updateGuess(evt)
    } else if (key === 'BACKSPACE') {
      updateGuess(evt)
    } else if (currentLetter >= 5 && key === 'ENTER') {
      handleGuess()
    }
  }
  render()
} 

function updateGuess(evt) {
  const key = evt.key.toUpperCase()
  if (key === 'BACKSPACE') {
    currentGuess = currentGuess.slice(0, -1)
    currentLetter = currentLetter > 0 ? --currentLetter : 0
    board[currentRow * 5 + currentLetter] = null
  } else {
    currentGuess += key
    board[currentRow * 5 + currentLetter] = key
    currentLetter++
  }
}

function handleGuess() {
  if (checkWord(currentGuess.toLowerCase())) {
    updateColors()
    checkWinner()
    checkLoss()
    updateRoundState()
  } else {
    messageEl.textContent = 'Invalid guess!'
    messageEl.style.visibility = 'visible'
    setTimeout(function() { messageEl.style.visibility = 'hidden' }, 1000)
    // invalid guess animation
  }
}

function checkWinner() {
  if (currentGuess.toLowerCase() === secretWord && currentRow <= 5) {
    winner = true
  }
}

function checkLoss() {
  if (currentGuess.toLowerCase() !== secretWord && currentRow >= 5) {
    loss = true 
  }
}

function updateRoundState() {
  currentRow++
  currentLetter = 0
  currentGuess = ''
}

function updateColors() {
  if (currentGuess){
    let lowerGuessArr = currentGuess.toLowerCase().split('')
    let secretWordArr = secretWord.split('')
    lowerGuessArr.forEach(function(char, idx) {
      if (char === secretWordArr[idx]) {
        sqrEls[currentRow * 5 + idx].classList.add('green')
        document.getElementById(char).classList.add('green')
        lowerGuessArr[idx] = ' '
        secretWordArr[idx] = ' '
      }
    })
    lowerGuessArr.forEach(function(char, idx) { 
      if (secretWordArr.includes(char) && char !== secretWordArr[idx]) {
        sqrEls[currentRow * 5 + idx].classList.add('yellow')
        document.getElementById(char).classList.add('yellow')
        lowerGuessArr[idx] = ' '
        secretWordArr[idx] = ' '
      } else if (char !== ' ') {
        sqrEls[currentRow * 5 + idx].classList.add('grey')
        document.getElementById(char).classList.add('grey')
      }
    })
  }
}

function resetColors() {
  sqrEls.forEach((sqr) => sqr.className = 'sqr')
  document.querySelectorAll('.key').forEach((key) => key.className = 'key')
}