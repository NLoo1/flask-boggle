// Elements
$guess = $('#btnSubmit')
$correctGuess = $('#displayGuess')
$timer = $('#timer')
$usedwords = $('#words')
$wordslist=$('#words-list')
$score = $('#score')
$timesPlayed = $('#timesPlayed')
$topScore = $('#topScore')

// When a word is successfully identified, add it to used_words_list so it can't be used again
const used_words_list = []

let scoreCount = 0
let countdown = 60

// Init
$(document).ready(getScore)

// After 60 seconds, stop the game
$(document).ready(setTimeout(stopGame, 60000))

// Update the timer every second.
setInterval(updateTime, 1000)

// On document load, retrieves session top score and play times, if any
async function getScore(){
    response = await axios.get("http://127.0.0.1:5000/get_score")
    $timesPlayed.html(`You've played ${response.data['playTimes']} times`)
    $topScore.html(`Your top score is ${response.data['score']}`)
}

// Stops game by disabling the submit button. Afterwards, uses AJAX to update play times and update the high score.
async function stopGame(){
    // Disable button.
    $guess.prop('disabled', true)

    // After stopping game, make a request to update_score
    response = await axios.post("http://127.0.0.1:5000/update_score", {score: scoreCount})
    $timesPlayed.html(`You've played ${response.data['playTimes']} times`)
    $topScore.html(`Your top score is ${response.data['score']}`)
}

// Updates timer.
function updateTime(){
    if (countdown == 0){
        clearInterval(updateTime)
        $timer.html(`Time's up!`)
    } else{
    countdown = countdown - 1
    $timer.html(`Time remaining is ${countdown}s`)
    }
}

// On submit, check the input against words.txt. 
$guess.on('click', async function(e){
    e.preventDefault()
    guessWord = document.querySelector('#inputGuess').value
    response = await axios.post("http://127.0.0.1:5000/check_word", {word: guessWord})
    $correctGuess.html("")

    // Check if the input is a valid word
    if(response.data['message'] == "WORKS!"){
        // If the word exists on the board BUT was already used, inform the user
        if(used_words_list.includes(guessWord)){
            $correctGuess.append(`${guessWord} is already used`)
        }
        // If the word exists on the board and wasn't already used, update score.
        else{
            used_words_list.push(guessWord)
            $correctGuess.append(`${guessWord} works`)
            $wordslist.append($(`<ul>${guessWord}</ul>`))
            scoreCount = scoreCount + guessWord.length
            $score.html('Score is ' + scoreCount)
        }
        
    } // If it doesn't exist, don't update anything, but tell the user that word does not exist
    else if(response.data['message'] == "NOT A WORD"){
        $correctGuess.append(`${guessWord} is not a word`)
    } // If the word does exist, but isn't on the board
    else{
        $correctGuess.append(`${guessWord} is not on the board`)
    }
})
