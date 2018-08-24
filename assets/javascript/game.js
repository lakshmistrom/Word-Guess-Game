// list of artists to be guessed by user
var artistsToBeGuessed = ["pink", "rihanna", "beyonce", "katy perry", "bruno mars", "kesha", "maroon 5", "miley cyrus", "spice girls", "shakira", "britney spears", "madonna", "demi lovato", "adele", "carly rae", "sia", "gwen stefani", "alicia keys", "john legend", "fergie", "ed sheran", "lady gaga", "the black eyed peas", "ismael kamawool"];

//hangman images
var hangmanImages = ["assets/images/hangman-1.png", "assets/images/hangman-2.png", "assets/images/hangman-3.png", "assets/images/hangman-4.png", "assets/images/hangman-5.png", "assets/images/hangman-6.png", "assets/images/hangman-7.png", "assets/images/hangman-8.png", "assets/images/hangman-9.png"];

//initializes string of wrong used letters
var usedLetters = "";

//initializes artist to be guessed from the array of artistsToBeGuessed
var artistToGuess = "";

//represents the word that was converted to underscores and spaces
var wordToGuess = "";

//represents the number of times the user wins by guessing the word
var wins = 0;

//initializes the audio file to be played once a round is won
var audioWins = new Audio("assets/music/171670__fins__success-2.wav");

//represents the number of times the user lost by guessing the wrong word
var losses = 0;

//initializes the audio file to be placed once a round is lost
var audioLosses = new Audio("assets/music/364929__josepharaoh99__game-die.mp3");

//initialize data to be used by the key up event
init();

//function is run whenever the user presses a key
document.onkeyup = function displayChoices(event) {
  //determines which key is pressed
  var userGuess = event.key.toLowerCase();
  //ignore lost game before refresh happens to load new word
  if(losses >= 8){
    return;
  }
  //ignore bad input
  if (userGuess.length === 1 && userGuess.match(/([a-z0-9 ])/g)) {
console.log(userGuess);
    //handles guessin wrong/right letters guess(userGuess)
    //if the user has succesfully put in all the characters needed to guess the word increase wins by one
    if (guess(userGuess) === artistToGuess) {
      //initialize data with a delay
      setTimeout(init,3000);

      //increment wins
      wins++;

      // and update wins in the html
      displayEveryWin.textContent = wins;

      //output audio file
      audioWins.play();
    } else if(losses >= 8){
      //initialize data with a delay
      setTimeout(init,3000);
      
      //output audio file
      audioLosses.play();
    }
    //if the user has run out of guesses the user has lost, all the hangman images are on the screen, and there would be a new word to be guessed presented
  }
};

//helper functions

//initializes data
function init() {
  //holds string of wrong used letters
  usedLetters = "";

  //initializes the losses
  losses = 0;

  //choose an artist at random from the artistsToBeGuessedArray 
  artistToGuess = artistsToBeGuessed[Math.floor(Math.random() * artistsToBeGuessed.length)];

  //represents the word that was converted
  wordToGuess = artistToHyphen(artistToGuess);

  //display hyphens to user
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
  displayProgress.textContent = wordToGuess;

  //load letters that were already guessed in the html
  displayAlreadyUsedLetters.textContent = usedLetters;

  //load wins to the html
  displayEveryWin.textContent = wins;

  //load guesses remaining to the html
  displayGuessesRemaining.textContent = 8 - losses;

  //load hangman's first image
  hangman.src = hangmanImages[0];
}

//handles choosing between right guesses and wrong guesses
function guess(userGuess) {

  //set up flag for wrong guesses
  var wrongGuessMade = false;

  //makes the right guess
  if (artistToGuess.indexOf(userGuess) !== -1) {
    //userGuess is the guess input by the user
    //hyphenString is the current string holding hyphens and spaces
    //artistToGuess represents the chosen artist to be guesssed
    //display correct letters
    var revealArtist = displayUnderScoresConvertedBack(userGuess, wordToGuess, artistToGuess);

    //update user guess in the html
    displayProgress.textContent = revealArtist;

    //load the user guess back in
    wordToGuess = revealArtist;

  } else {
    //makes wrong guess

    //display wrong displayed letters
    var wrongGuessedLetters = wrongGuesses(userGuess, artistToGuess, usedLetters);

    //update flag
    wrongGuessMade = true;

    //load letters that were already guessed in the html
    displayAlreadyUsedLetters.textContent = wrongGuessedLetters;

    //update usedLetters
    usedLetters = wrongGuessedLetters;

    // as the user guesses the wrong letter the hangman starts to be drawn piece by piece--------
    if (wrongGuessMade === true) {
      console.log(losses);
      //increments losses
      losses++;
      console.log(losses);
      //decrease number of guesses remaining

      //update html with guesses remaining
      displayGuessesRemaining.textContent = 8 - losses;

      //find hangman image to associate with number of guessees remaining
      hangman.src = hangmanImages[losses];

    }
  }

  //return string with the guessed artist
  return revealArtist;
}

//output the string of wrong guessed letters
function wrongGuesses(userGuess, artistToGuess, usedLetters) {
  //return the letters that don't match the artistToGuess
  return usedLetters + userGuess;
}

//As the letters are guessed correctly replace the hyphens with letters that were used by the user
function displayUnderScoresConvertedBack(userGuess, hyphenString, artistToGuess) {
  //turn hyphenString into array
  var tempArray = hyphenString.split("");

  //need to iterate over the artistToGuess to find if the letter 
  //that was input by the user is there
  for (var i = 0; i < artistToGuess.length; i++) {

    //if the userGuess equals the character at that index
    if (userGuess === artistToGuess[i]) {
      //add back in the userGuess at that index in hyphenString
      tempArray[i] = userGuess;
    }
  }

  //turn array back to a string
  var guessedLettersIn = tempArray.join("");

  //returns string of characters and hyphens
  return guessedLettersIn;
}

//go through each element of the array and count how many hyphens are needed to be displayed before the user starts guessing the word
function artistToHyphen(artistToGuess) {
  // checks artist that was chosen randomly 
  console.log(artistToGuess);

  //create a new string to hold hyphens based on the number of characters found in the string
  var hyphenString = "";

  //go through the artistToGuess string and count how many characters are inside then convert it to underscores
  hyphenString = artistToGuess.replace(/[a-z0-9]/g, "_");

  //returns new string of hyphens and spaces
  return hyphenString;
};