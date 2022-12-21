let click = new Audio('../assets/click.wav')
let flip = new Audio('../assets/flip.wav')

function playClick() {
  click.volume = 0.3
  click.play()
}

function playFlip() {
  flip.volume = 0.4
  flip.play()
}

export {
  playClick,
  playFlip
}