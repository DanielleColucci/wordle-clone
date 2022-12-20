/*------------------------------- Constants -------------------------------*/
import { getWord, checkWord } from "../data/words.js";

/*------------------------------- Variables -------------------------------*/
let difficulty, board, secretWord, winner, acceptingGuess, currentGuess, currentRow, currentLetter, loss

/*----------------------- Cached Element Referenes ------------------------*/
const diffBtnEls = document.getElementById('difficulties')
const messageEl = document.getElementById('message')
const bodyEl = document.querySelector('body')
const boardEl = document.querySelector('.board')
const sqrEls = document.querySelectorAll('.sqr')
const frontEls = document.querySelectorAll('.front')
const backEls = document.querySelectorAll('.back')
const keyboardEl = document.getElementById('keyboard')
const resetBtnEl = document.getElementById('reset-button')

/*---------------------------- Event Listeners ----------------------------*/
diffBtnEls.addEventListener('click', chooseDifficulty)
bodyEl.addEventListener('keydown', handleKeyPress)
resetBtnEl.addEventListener('click', init)
keyboardEl.addEventListener('click', handleKeyPress)

/*------------------------------- Functions -------------------------------*/

function chooseDifficulty(evt) {
  if (evt.target.className === 'mode') {
    difficulty = Number(evt.target.id[5])
    diffBtnEls.style.visibility = 'hidden'
    messageEl.style.visibility = 'hidden'
    init()
  }
}

function init() {
  secretWord = getWord(difficulty)
  board = Array(30).fill(null, 0)
  winner = false 
  loss = false
  acceptingGuess = true
  currentGuess = ''
  currentRow = 0
  currentLetter = 0
  boardEl.style.visibility = 'visible'
  keyboardEl.style.visibility = 'visible'
  resetBtnEl.style.visibility = 'visible'
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
    setTimeout(() => { 
      messageEl.style.visibility = 'visible' 
      messageEl.textContent = `You got it in ${currentRow}! Play again?`
      diffBtnEls.style.visibility = 'visible'
      resetBtnEl.style.visibility = 'hidden'
    }, 3750)
  }
  if (loss) {
    setTimeout(() => { 
      messageEl.style.visibility = 'visible' 
      messageEl.textContent = `The word was ${secretWord}. Play again?`
      diffBtnEls.style.visibility = 'visible'
      resetBtnEl.style.visibility = 'hidden'
    }, 3750)
  }
}

function handleKeyPress(evt) {
  // check if game has been initialized 
  if (acceptingGuess) {
    const key = evt.type === 'keydown' ? evt.key.toUpperCase() : evt.target.id.toUpperCase()

    // check if key is single letter and lastGuess is no more than 5 letters
    if ((key.length === 1 && key >= 'A' && key <= 'Z' && currentLetter < 5) || key === 'BACKSPACE') {
      updateGuess(key)
    } else if (currentLetter >= 5 && key === 'ENTER') {
      handleGuess()
    }
    render()
  }
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
    acceptingGuess = false
    updateColors()
    setTimeout(() => {
      checkWinner()
      checkLoss()
      updateRoundState()
    }, 7500)
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
  if (!winner && !loss) acceptingGuess = true
}

function getColorArray() {
  let lowerGuessArr = currentGuess.toLowerCase().split('')
  let secretWordArr = secretWord.split('')
  let colorArr = []
  lowerGuessArr.forEach(function(char, idx) {
    if (char === secretWordArr[idx]) {
      document.getElementById(char).classList.add('green')
      colorArr.splice(idx, 0, 'green')
      lowerGuessArr[idx] = ' '
      secretWordArr[idx] = ' '
    } 
  }) 
  lowerGuessArr.forEach(function(char, idx) {
    if (secretWordArr.includes(char) && char !== secretWordArr[idx]) {
      document.getElementById(char).classList.add('yellow')
      colorArr.splice(idx, 0, 'yellow')
      secretWordArr[secretWordArr.indexOf(char)] = ' '
    } else if (char !== ' ') {
      document.getElementById(char).classList.add('grey')
      colorArr.splice(idx, 0, 'grey')
    }
  })
  return colorArr
}

function updateColors() {
  const colorArr = getColorArray()
  sqrEls[currentRow * 5].style.animation = '1.5s 1 verticalFlip'
  sqrEls[currentRow * 5].classList.add(colorArr[0])

  let idx = 1
  setInterval(() => {
    if (idx <= 4) {
      sqrEls[currentRow * 5 + idx].classList.add(colorArr[idx])
      sqrEls[currentRow * 5 + idx].style.animation = '5s 1 verticalFlip'
      idx++
    } else {
      clearInterval()
    }
  }, 500)
}

function resetColors() {
  sqrEls.forEach((sqr) => sqr.className = 'sqr')
  document.querySelectorAll('.key').forEach((key) => key.className = 'key')
}