$guess = $('#btnSubmit')

$guess.on('click', async function(e){
    e.preventDefault()
    console.log("HELLO!")
    guessWord = document.querySelector('#inputGuess').value
    response = await axios.post("http://127.0.0.1:5000/check_word", {word: guessWord})
    console.log(response.data)
})
