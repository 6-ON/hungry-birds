const pregame = document.querySelectorAll('*[pregame]')
const inGame = document.querySelectorAll('*[ingame]')
const startBtn = document.querySelector('#start-btn')
const holes = document.querySelectorAll('.hole')
const worm = document.querySelector('#worm')
const game = {
    score: 0,
    interval: null,
}
let score = 0
let activeHoles = []

function startGame() {
    score = 0
    pregame.forEach((element) => {
        element.classList.add('hidden')
    })
    inGame.forEach((element) => {
        element.classList.remove('hidden')
    })
    game.interval = startSpawing()
    setTimeout(() => {}, 1000 * 60)
}
startBtn.addEventListener('click', startGame)

function spawnBaby() {
    let hole = Math.floor(Math.random() * holes.length)
    while (activeHoles.includes(hole)) {
        hole = Math.floor(Math.random() * holes.length)
    }
    activeHoles.push(hole)
    const baby = document.createElement('img')

    baby.src = 'assets/mole-game/hungry.png'
    baby.classList.add('baby')

    let birdState = 'hungry'
    baby.addEventListener('click', () => {
        if (birdState === 'hungry') {
            baby.src = 'assets/mole-game/fed.png'
            score += 10
            updateScore()
            birdState = 'fed'
        }
    })

    setTimeout(() => {
        if (birdState === 'hungry') {
            baby.src = 'assets/mole-game/sad.png'
            birdState = 'sad'
        }
    }, 1000)

    setTimeout(() => {
        baby.src = 'assets/mole-game/leaving.png'
    }, 1500)

    setTimeout(() => {
        console.log(birdState)
        activeHoles = activeHoles.filter((h) => h !== hole)
        baby.remove()
    }, 2000)
    holes[hole].appendChild(baby)
}
function updateScore() {
    worm.style.width = `${score}%`
    if (score === 100) {
        endGame()
    }
}
function startSpawing() {
    return setInterval(() => {
        spawnBaby()
    }, 1000)
}
function init() {
    inGame.forEach((element) => {
        element.classList.add('hidden')
    })
}
function endGame() {
    clearInterval(game.interval)
    pregame.forEach((element) => {
        element.classList.remove('hidden')
    })
    inGame.forEach((element) => {
        element.classList.add('hidden')
    })
    score = 0
    updateScore()
}
init()
