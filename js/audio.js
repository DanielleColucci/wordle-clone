let click = new Audio('../assets/click.wav')

function playClick() {
  click.volume = 0.1
  click.play()
}

export {
  playClick
}