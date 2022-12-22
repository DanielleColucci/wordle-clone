/*------------------------------- Constants -------------------------------*/
import { getWord, checkWord } from "../data/words.js";
import * as gameAudio from "./audio.js"

/*------------------------------- Variables -------------------------------*/
let difficulty, board, secretWord, winner, acceptingGuess, currentGuess, currentRow, currentLetter, loss
let sound = true

/*----------------------- Cached Element Referenes ------------------------*/
const diffBtnEls = document.getElementById('difficulties')
const messageEl = document.getElementById('message')
const bodyEl = document.querySelector('body')
const boardEl = document.querySelector('.board')
const sqrEls = document.querySelectorAll('.sqr')
const keyboardEl = document.getElementById('keyboard')
const resetBtnEl = document.getElementById('reset-button')
const soundBtnEl = document.getElementById('toggle-sound')

/*---------------------------- Event Listeners ----------------------------*/
diffBtnEls.addEventListener('click', chooseDifficulty)
bodyEl.addEventListener('keydown', handleKeyPress)
resetBtnEl.addEventListener('click', resetGame)
keyboardEl.addEventListener('click', handleKeyPress)
soundBtnEl.addEventListener('click', toggleSound)

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
    messageEl.style.visibility = 'visible' 
    messageEl.textContent = `You got it in ${currentRow}! Play again?`
    diffBtnEls.style.visibility = 'visible'
    resetBtnEl.style.visibility = 'hidden'
  }
  if (loss) {
    messageEl.style.visibility = 'visible' 
    messageEl.textContent = `The word was ${secretWord}. Play again?`
    diffBtnEls.style.visibility = 'visible'
    resetBtnEl.style.visibility = 'hidden'
  }
}

function handleKeyPress(evt) {
  if (acceptingGuess) {
    const key = evt.type === 'keydown' ? evt.key.toLowerCase() : evt.target.id
    document.activeElement.blur()
    
    if ((key.length === 1 && key >= 'a' && key <= 'z' && currentLetter < 5) || key === 'backspace') {
      updateGuess(key)
      if (sound) gameAudio.playClick()
      render()
    } else if (currentLetter >= 5 && key === 'enter') {
      if (sound) gameAudio.playClick()
      handleGuess()
    }
  }
} 

function updateGuess(key) {
  if (key === 'backspace') {
    currentGuess = currentGuess.slice(0, -1)
    currentLetter = currentLetter > 0 ? --currentLetter : 0
    board[currentRow * 5 + currentLetter] = null
  } else {
    currentGuess += key
    board[currentRow * 5 + currentLetter] = key.toUpperCase()
    currentLetter++
  }
}

function handleGuess() {
  if (checkWord(currentGuess)) {
    acceptingGuess = false
    updateGameState()    
  } else {
    messageEl.textContent = 'Invalid guess!'
    messageEl.style.visibility = 'visible'
    document.getElementById(`row${currentRow + 1}`).style.animationPlayState = 'running'
    setTimeout(() => messageEl.style.visibility = 'hidden', 1000)
    setTimeout(() => document.getElementById(`row${currentRow + 1}`).style.animationPlayState = 'paused', 500)
  }
}

async function updateGameState() {
  const colorsRevealed = await updateColors()
  if (colorsRevealed) {
    checkWinner()
    checkLoss()
    updateRoundState()
    render()
  }
}

function checkWinner() {
  if (currentGuess === secretWord && currentRow <= 5) {
    winner = true
  }
}

function checkLoss() {
  if (currentGuess !== secretWord && currentRow >= 5) {
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
  let lowerGuessArr = currentGuess.split('')
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
  sqrEls[currentRow * 5].classList.add(colorArr[0], 'flip')
  if (sound) gameAudio.playFlip()
  
  let idx = 1
  return new Promise(resolve => {
    setInterval(() => {
      if (idx <= 4) {
        sqrEls[currentRow * 5 + idx].classList.add(colorArr[idx], 'flip')
        if (sound) gameAudio.playFlip()
        idx++
      } else {
        resolve(true)
      }
    }, 500)
  })
}

function resetColors() {
  sqrEls.forEach((sqr) => sqr.className = 'sqr')
  document.querySelectorAll('.key').forEach((key) => key.className = 'key')
}

function resetGame() {
  diffBtnEls.style.visibility = 'visible'
  messageEl.style.visibility = 'visible'
  messageEl.textContent = 'CHOOSE A DIFFICULTY:'
  boardEl.style.visibility = 'hidden'
  keyboardEl.style.visibility = 'hidden'
  resetBtnEl.style.visibility = 'hidden'
}

function toggleSound() {
  sound = sound ? false : true
  soundBtnEl.textContent = sound ? '🔊' : '🔈'
  document.activeElement.blur()
}