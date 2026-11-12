import os

from cs50 import SQL
from flask import Flask, jsonify, flash, redirect, render_template, request, session
from flask_session import Session
from werkzeug.security import check_password_hash, generate_password_hash
from datetime import datetime

from helpers import apology, login_required

# Configure application
app = Flask(__name__)

# Configure session to use filesystem (instead of signed cookies)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# Configure CS50 Library to use SQLite database
db = SQL("sqlite:///project.db")


@app.after_request
def after_request(response):
    """Ensure responses aren't cached"""
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


@app.route("/")
@login_required
def index():
    return render_template("index.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    # Forget any user_id
    session.clear()
    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        # Ensure username was submitted
        username = request.form.get("username")
        if not username:
            return apology("must provide username", 403)

        # Ensure password was submitted
        password = request.form.get("password")
        if not password:
            return apology("must provide password", 403)

        # Query database for username
        rows = db.execute(
            "SELECT * FROM users WHERE username = ?", request.form.get("username")
        )

        # Ensure username exists and password is correct
        if len(rows) != 1 or not check_password_hash(
            rows[0]["hash"], request.form.get("password")
        ):
            return apology("invalid username and/or password", 403)

        # Remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # Redirect user to home page
        return redirect("/")

    # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/logout")
@login_required
def logout():
    # Forget any user_id
    session.clear()
    # Redirect user to login form
    return redirect("/")


@app.route("/register", methods=["GET", "POST"])
def register():
    # User reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        # Ensure username was submitted
        username = request.form.get("username")
        if not username:
            return apology("must provide username", 400)
        # Ensure password was submitted
        password = request.form.get("password")
        if not password:
            return apology("must provide password", 400)
        confirmation = request.form.get("confirmation")
        if not confirmation:
            return apology("must confirm password", 400)
        if confirmation != password:
            return apology("passwords don't match", 400)
        strhash = generate_password_hash(password, method='scrypt', salt_length=16)
        try:
            db.execute("INSERT INTO users (username, hash) VALUES(?, ?)", username, strhash)
        except ValueError:
            return apology("username already exists", 400)
        return redirect("/")
     # User reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("register.html")


@app.route("/state", methods=["POST"])
@login_required
def save_state():
    data = request.get_json()
    total_score = data["totalScore"]
    state = data["state"]
    user_id = session["user_id"]
    db.execute("INSERT INTO state_history (user_id, total_score, state) VALUES (?, ?, ?)",
               user_id, total_score, state)
    return jsonify({"success": True})


@app.route("/statehistory")
@login_required
def statehistory():
    user_id = session["user_id"]
    state_history = db.execute("SELECT total_score, state, datetime(created_at, 'localtime') AS created_at FROM state_history WHERE user_id = ? ORDER BY created_at DESC", user_id)
    return render_template("statehistory.html", state_history=state_history)


@app.route("/vulnerability", methods=["POST"])
@login_required
def save_vulnerability():
    data = request.get_json()
    total_score = data["score"]
    user_id = session["user_id"]
    if total_score <= 2:
        category = "🎒 Light backpack"
    elif total_score <= 5:
        category = "🎒🎒 Medium backpack"
    elif total_score <= 7:
        category = "🎒🎒🎒 Heavy backpack"
    else:
        category = "🎒🎒🎒🎒 REALLY Heavy backpack"
    db.execute("INSERT INTO vulnerability_history (user_id, total_score, category) VALUES (?, ?, ?)",
               user_id, total_score, category)
    return jsonify({"success": True})


@app.route("/vulnerabilityhistory")
@login_required
def vulnerabilityhistory():
    user_id = session["user_id"]
    vulnerability_history = db.execute("SELECT total_score, category, datetime(created_at, 'localtime') AS created_at FROM vulnerability_history WHERE user_id = ? ORDER BY created_at DESC", user_id)
    return render_template("vulnerabilityhistory.html", vulnerability_history=vulnerability_history)


@app.route("/vulnerabilitytracker")
@login_required
def vulnerabilitytracker():
    return render_template("vulnerabilitytracker.html")
