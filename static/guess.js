$guess = $('#btnSubmit')
$correctGuess = $('#displayGuess')

$guess.on('click', async function(e){
    e.preventDefault()
    // console.log("HELLO!")
    guessWord = document.querySelector('#inputGuess').value
    response = await axios.post("http://127.0.0.1:5000/check_word", {word: guessWord})
    console.log(response.data)
    $correctGuess.html("")
    $correctGuess.removeClass("d-none")
    if(response.data['message'] == "WORKS!"){
        $correctGuess.append(`${guessWord} works`)
    } 
    else if(response.data['message'] == "NOT A WORD"){
        $correctGuess.append("<p>not a word</p>")
    }
    else{
        $correctGuess.append("<p>Not on board</p>")
    }
})
