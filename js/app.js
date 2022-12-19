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
resetBtnEl.addEventListener('click', init)
keyboardEls.addEventListener('click', handleKeyPress)

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
  resetBtnEl.style.display = 'flex'
  mainEl.style.display = 'block'
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
    resetBtnEl.style.display = 'none'
  }
  if (loss) {
    messageEl.style.visibility = 'visible'
    messageEl.textContent = `The word was ${secretWord}. Play again?`
    diffBtnEls.style.display = 'flex'
    resetBtnEl.style.display = 'none'
  }
}

function handleKeyPress(evt) {
  // check if game has been initialized 
  if (secretWord) {
    const key = evt.type === 'keydown' ? evt.key.toUpperCase() : evt.target.id.toUpperCase()

    // check if key is single letter and lastGuess is no more than 5 letters
    if (key.length === 1 && /[A-Z]/i.test(key) && currentLetter < 5 || key === 'BACKSPACE') {
      updateGuess(key)
    } else if (currentLetter >= 5 && key === 'ENTER') {
      handleGuess()
    }
  }
  render()
} 

function updateGuess(key) {
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
    document.getElementById(`row${currentRow + 1}`).style.animationPlayState = 'running'
    setTimeout(() => messageEl.style.visibility = 'hidden', 1000)
    setTimeout(() => document.getElementById(`row${currentRow + 1}`).style.animationPlayState = 'paused', 500)
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

function getColorArray() {
  let lowerGuessArr = currentGuess.toLowerCase().split('')
  let secretWordArr = secretWord.split('')
  return lowerGuessArr.map(function(char, idx) {
    let key = document.getElementById(char)
    if (char === secretWordArr[idx]) {
      key.classList.add('green')
      return 'green'
    } else if (secretWordArr.includes(char) && char !== secretWordArr[idx]) {
      key.classList.add('yellow')
      return 'yellow'
    } else {
      key.classList.add('grey')
      return 'grey'
    }
  })
}

function updateColors() {
  const colorArr = getColorArray()
  let idx = 0
  setInterval(function() {
    if (idx <= 4) {
      sqrEls[(currentRow - 1) * 5 + idx].classList.add(colorArr[idx])
      sqrEls[(currentRow - 1) * 5 + idx].style.transform = 'rotateY(180deg)'
      sqrEls[(currentRow - 1) * 5 + idx].style.transition = '1.5s'
      idx++
    } else {
      clearInterval()
    }
  }, 750)
}

function resetColors() {
  sqrEls.forEach((sqr) => sqr.className = 'sqr')
  document.querySelectorAll('.key').forEach((key) => key.className = 'key')
}