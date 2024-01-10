from flask import Flask, render_template, request, redirect, session, flash
from boggle import Boggle
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config['SECRET_KEY'] = "abc123"
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

debug = DebugToolbarExtension(app)

boggle_game = Boggle()

@app.route("/")
def home():
    # Remake board each reload
    board = boggle_game.make_board()
    session["board"] = board
    return render_template("home.html", board=board)