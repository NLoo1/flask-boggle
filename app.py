from flask import Flask, jsonify, render_template, request, redirect, session, flash
from boggle import Boggle
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config['SECRET_KEY'] = "abc123"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

debug = DebugToolbarExtension(app)

boggle_game = Boggle()
board = boggle_game.make_board()

with open("words.txt") as file:
  words = [word.strip() for word in file.readlines()]

# print(words)

@app.route("/")
def home():
    # Remake board each reload
    global board 
    board = boggle_game.make_board()
    session["board"] = board
    return render_template("home.html", board=board)

@app.route("/check_word", methods=["POST"])
def check_word():
    data = request.get_json()
    word_to_check = data.get('word')
    if word_to_check in words:
        global board
        result = boggle_game.check_valid_word(board, word_to_check)
        if result == "ok":
            return jsonify({'message': 'WORKS!'})
        elif result == "not-on-board":
            return jsonify({'message': 'NOT ON BOARD'})
    else:
        return jsonify({'message': 'NOT A WORD'})
    
if __name__ == '__main__':
    app.run(debug=True, port=5000)