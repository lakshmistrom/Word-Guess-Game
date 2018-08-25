//object build
function Hangman() {
  //initializes list of artists to be guessed by user
  this.artistsToBeGuessed = ["pink", "rihanna", "beyonce", "katy perry", "bruno mars", "kesha", "maroon 5", "miley cyrus", "spice girls", "shakira", "britney spears", "madonna", "demi lovato", "adele", "carly rae", "sia", "gwen stefani", "alicia keys", "john legend", "fergie", "ed sheran", "lady gaga", "the black eyed peas", "ismael kamawool"];

  //initializes images for the hangman figure
  this.hangmanImages = ["assets/images/hangman-1.png", "assets/images/hangman-2.png", "assets/images/hangman-3.png", "assets/images/hangman-4.png", "assets/images/hangman-5.png", "assets/images/hangman-6.png", "assets/images/hangman-7.png", "assets/images/hangman-8.png", "assets/images/hangman-9.png"];

  //initializes letters that were guessed wrong
  this.usedLetters = "";

  //initializes the artist that will be guessed by the user
  this.artistToGuess = "";

  //initializes the underscores and spaces string
  this.wordToGuess = "";

  //initializes wins counter
  this.wins = 0;

  //initializes audio file for the won rounds
  this.audioWins = new Audio("assets/music/171670__fins__success-2.wav");

  //initializes the number of times there is a loss
  this.losses = 0;

  //initializes the music file to be played when the round is lost
  this.audioLosses = new Audio("assets/music/364929__josepharaoh99__game-die.mp3");
}
//initializing data to be used for the hangman game
Hangman.prototype.init = function () {
  //initializes data
  //holds string of wrong used letters
  this.usedLetters = "";

  //initializes the losses
  this.losses = 0;

  //choose an artist at random from the artistsToBeGuessedArray 
  this.artistToGuess = this.artistsToBeGuessed[Math.floor(Math.random() * this.artistsToBeGuessed.length)];

  //represents the word that was converted
  this.wordToGuess = artistToUnderScore(this.artistToGuess);

  //display UnderScores to user
  var emptyGuess = document.getElementById("displayProgress");

  // display letters already used to the user
  var alreadyUsedLetters = document.getElementById("displayAlreadyUsedLetters");

  //display wins to the user
  var numberOfWins = document.getElementById("displayEveryWin");

  //display number of guesses remaining
  var numberOfGuessesRemaining = document.getElementById("displayGuessesRemaining");

  //display hangman images
  var hangmanRemains = document.getElementById("hangman");

  //load the word to be guessed
  displayProgress.textContent = this.wordToGuess;

  //load letters that were already guessed in the html
  displayAlreadyUsedLetters.textContent = this.usedLetters;

  //load wins to the html
  displayEveryWin.textContent = this.wins;

  //load guesses remaining to the html
  displayGuessesRemaining.textContent = 8 - this.losses;

  //load hangman's first image
  hangman.src = this.hangmanImages[0];

};

//handles choosing between right guesses and wrong guesses
Hangman.prototype.guess = function(userGuess) {
  //set up flag for wrong guesses
  var wrongGuessMade = false;

  //makes the right guess
  if (this.artistToGuess.indexOf(userGuess) !== -1) {
    //userGuess is the guess input by the user
    //wordToGuess is the current string holding underScores and spaces
    //artistToGuess represents the chosen artist to be guesssed
    //display correct letters
    var revealArtist = displayUnderScoresConvertedBack(userGuess, this.wordToGuess, this.artistToGuess);

    //update user guess in the html
    displayProgress.textContent = revealArtist;

    //load the user guess back in
    this.wordToGuess = revealArtist;

  } else {
    //makes wrong guess

    //display wrong displayed letters
    var wrongGuessedLetters = wrongGuesses(userGuess, this.artistToGuess, this.usedLetters);

    //update flag
    wrongGuessMade = true;

    //load letters that were already guessed in the html
    displayAlreadyUsedLetters.textContent = wrongGuessedLetters;

    //update usedLetters
    this.usedLetters = wrongGuessedLetters;

    // as the user guesses the wrong letter the hangman starts to be drawn piece by piece--------
    if (wrongGuessMade === true) {
      //increments losses
      this.losses++;

      //decrease number of guesses remaining
      //update html with guesses remaining
      displayGuessesRemaining.textContent = 8 - this.losses;

      //find hangman image to associate with number of guessees remaining
      hangman.src = this.hangmanImages[this.losses];
    }
  }

  //return string with the guessed artist
  return revealArtist;
};

//handle user guess entries
Hangman.prototype.entries = function(userGuess){
  //ignore lost game before refresh happens to load new word
  if (this.losses >= 8) {
    return;
  }
  //ignore bad input
  if (userGuess.length === 1 && userGuess.match(/([a-z0-9 ])/g)) {
    //handles guessin wrong/right letters guess(userGuess)
    //if the user has succesfully put in all the characters needed to guess the word increase wins by one
    if (this.guess(userGuess) === this.artistToGuess) {
      //initialize data with a delay
      setTimeout(this.init.bind(this), 3000);

      //increment wins
      this.wins++;

      // and update wins in the html
      displayEveryWin.textContent = this.wins;

      //output audio file
      this.audioWins.play();
    } else if (this.losses >= 8) {
      //initialize data with a delay
      setTimeout(this.init.bind(this), 3000);

      //output audio file
      this.audioLosses.play();
    }
    //if the user has run out of guesses the user has lost, all the hangman images are on the screen, and there would be a new word to be guessed presented
  }
};
//initialize data to be used by the key up event
var hangmanGame = new Hangman();

//initialize data
hangmanGame.init();


//function is run whenever the user presses a key
document.onkeyup = function displayChoices(event) {
  //determines which key is pressed
  var userGuess = event.key.toLowerCase();

  //handles user entries
  hangmanGame.entries(userGuess);
};

//helper functions
//output the string of wrong guessed letters
function wrongGuesses(userGuess, artistToGuess, usedLetters) {
  //return the letters that don't match the artistToGuess
  return usedLetters + userGuess;
}

//As the letters are guessed correctly replace the underScores with letters that were used by the user
function displayUnderScoresConvertedBack(userGuess, underScoreString, artistToGuess) {
  //turn underScoreString into array
  var tempArray = underScoreString.split("");

  //need to iterate over the artistToGuess to find if the letter 
  //that was input by the user is there
  for (var i = 0; i < artistToGuess.length; i++) {

    //if the userGuess equals the character at that index
    if (userGuess === artistToGuess[i]) {
      //add back in the userGuess at that index in underScoreString
      tempArray[i] = userGuess;
    }
  }

  //turn array back to a string
  var guessedLettersIn = tempArray.join("");

  //returns string of characters and underScores
  return guessedLettersIn;
}

//go through each element of the array and count how many underScores are needed to be displayed before the user starts guessing the word
function artistToUnderScore(artistToGuess) {

  //create a new string to hold underScores based on the number of characters found in the string
  var underScoreString = "";

  //go through the artistToGuess string and count how many characters are inside then convert it to underscores
  underScoreString = artistToGuess.replace(/[a-z0-9]/g, "_");

  //returns new string of underScores and spaces
  return underScoreString;
};