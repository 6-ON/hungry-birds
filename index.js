const pregame = document.querySelectorAll('*[pregame]')
const inGame = document.querySelectorAll('*[ingame]')
const postGame = document.querySelectorAll('*[postgame]')
const startBtn = document.querySelectorAll('*[start-btn]')
const holes = document.querySelectorAll('.hole')
const worm = document.querySelector('#worm')
const userName = document.querySelector('#user-name')
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || []
const leaderboardList = document.querySelector('#leaderboard-list')

function updateLeaderboard(user) {
    leaderboard = leaderboard.filter((u) => u.name !== user.name)
    leaderboard.push(user)
    leaderboard.sort((a, b) => a.score - b.score)
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard))
    leaderboardList.innerHTML = `<tr>
                        <th>Player Name</th>
                        <th>Best Time</th>
                        </tr>`
    leaderboard.forEach((user) => {
        leaderboardList.innerHTML += `<tr>
                        <td>${user.name}</td>
                        <td>${(user.score / 1000).toFixed(2)}s</td>
                        </tr>`
    })
}
const game = {
    score: 0,
    interval: null,
    started_at: null,
}
let activeHoles = []
const user = {
    name: '',
    score: null,
}
function startGame() {
    console.log('Game Started!');
    if (userName.value === '' && user.name === '') {
        alert('Please enter a name')
        return
    }
    if (user.name === '') {
    user.name = userName.value
    }

    game.score = 0
    game.started_at = Date.now()
    const l = [...pregame, ...postGame]
    l.forEach((element) => {
        console.log(element);
        element.classList.add('hidden')
    })

    inGame.forEach((element) => {
        element.classList.remove('hidden')
    })
    game.interval = startSpawing()
}

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
            game.score += 10
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
    worm.style.width = `${game.score}%`
    if (game.score === 100) {
        endGame()
    }
}
function startSpawing() {
    return setInterval(() => {
        spawnBaby()
    }, 1000)
}
function init() {
    const l = [...inGame, ...postGame]
    l.forEach((element) => {
        element.classList.add('hidden')
    })
    userName.value = 'Player' + Math.floor(Math.random() * 1000)
    startBtn.forEach((element) => {
        element.addEventListener('click', startGame)
    })
}
function endGame() {
    clearInterval(game.interval)
    console.log('Game Over!')
    user.score = Date.now() - game.started_at
    console.log(user)
    updateLeaderboard(user)
    postGame.forEach((element) => {
        element.classList.remove('hidden')
    })
    inGame.forEach((element) => {
        element.classList.add('hidden')
    })
    game.score = 0
    updateScore()
}
init()
