var boardCards = [];
var yourCards = [];
var numOfPlayers;
var yourName;
var playerNames = [];
var whoCards = ["green", "mustard", "peacock", "plum", "scarlet", "white"];
var whatCards = ["candlestick", "dagger", "pistol", "lead_pipe", "rope", "wrench"];
var whereCards = ["bathroom", "bedroom", "courtyard", "dining_room", "game_room", "garage", "kitchen", "living_room", "office"];
var allCards = ["green", "mustard", "peacock", "plum", "scarlet", "white", "candlestick", "dagger", "pistol", "lead_pipe", "rope", "wrench", "bathroom", "bedroom", "courtyard", "dining_room", "game_room", "garage", "kitchen", "living_room", "office"];
var yourPosition;
var possibleWhoAnswers = ["green", "mustard", "peacock", "plum", "scarlet", "white"];
var possibleWhatAnswers = ["candlestick", "dagger", "pistol", "lead_pipe", "rope", "wrench"];
var possibleWhereAnswers = ["bathroom", "bedroom", "courtyard", "dining_room", "game_room", "garage", "kitchen", "living_room", "office"];
var whoSolution;
var whatSolution;
var whereSolution;
var cardsOnBoard = {};
var cardsInHand = {};
var cards = {boardCards: cardsOnBoard, yourCards: cardsInHand};
var dontHaves = [];
var playersWorked = 0;
var identifier = [0];
var allPossibleAns = {};
var howManyOneOfs = 0;
var IsItGood = 0;
var possibleAnsAry = [];
var orderNumber = 1;
var cardShown = "";
var whoAnswered = "";
var whoQuestion = "";
var whatQuestion = "";
var whereQuestion = "";
var fullQuestion = [];
var boardUpdate = [];

console.log("RELOADING THE PAGE")

function setPlayerCards() {
    for (let i = 0; i < numOfPlayers; i++) {
        playerNames[i];
    }
}



function setupObj(boardCards, yourCards, playerNames) {
    createBoardObj(boardCards);
    createPlayerObj(playerNames);
}

function createBoardObj(boardCards) {
    cards.boardCards.defHasCards = boardCards;
    var dontHaveBoardCards = doesntHaves(boardCards);
    cards.boardCards.donthaves = dontHaveBoardCards;
    createYourObj(yourCards);
}

function createYourObj(yourCards) {
    var yourCardsNow = [];
    for (let i = 0; i < yourCards.length; i++) {
        yourCardsNow.push(yourCards[i]);
    }
    cards.yourCards.defHasCards = yourCardsNow;
    var myDontHaveCards = doesntHaves(yourCardsNow);
    cards.yourCards.donthaves = myDontHaveCards;
}

function createPlayerObj(playerNames) {
    for (let i = 0; i < playerNames.length; i++) {
        console.log(`Player Name: ${playerNames[i]}`);
        if (playerNames[i] !== yourName) {
            cards[playerNames[i]] = {defHasCards: [], doesntHaveCards: [], hasOneOfCards: {}};
        }
    }
    console.log(`Cards: ${JSON.stringify(cards)}`);
}

function doesntHaves(haves) {
var setA = new Set(haves);
var setB = new Set(allCards);
var newSet = JSON.stringify(difference(setB, setA));
console.log(`difference(setB, setA): ${newSet}`);
var newAry = new Array(newSet);
var aryString = newAry[0];
var coolAry = JSON.parse(aryString);
return coolAry;
}

function difference(s1, s2) {
  return [...s1].filter(function(x) { return [...s2].indexOf(x) < 0 });
}

function addingToPlayerHas(obj, cardPlayingWith, playerName) {
    if (!(cardPlayingWith instanceof Array)) {
        return addingToPlayerHas(obj, [cardPlayingWith], playerName);
    }
    for (let i = 0; i < cardPlayingWith.length; i++) {
        console.log(`Player Name: ${playerName}, Player cards: ${cards[playerName]}, Cards: ${JSON.stringify(cards)}`);
        console.log(`Your Cards Var: ${yourCards}, Board Cards: ${boardCards}`);
        if (cards[playerName].defHasCards.includes(cardPlayingWith[i])) {
            console.log("We already know that ${playerName} has ${cardPlayingWith}");
        } else {
            updateDefHasObj(obj, cardPlayingWith[i]);
            for (let i = 0; i < numOfPlayers; i++) {
                if (playerNames[i] != playerName) {
                    addingToPlayerDontHaves(cards[playerNames[i]] ,cardPlayingWith[i], playerName);
                }
            }
            for (let i = 0; i < identifier.length; i++) {
                for (let j = 0; j < cardPlayingWith.length; j++) {
                    if (obj.hasOneOfCards[indetifier[i]].cards.includes(cardPlayingWith[j])) {
                        obj.hasOneOfCards[indetifier[i]].cards.splice(obj.hasOneOfCards[indetifier[i]].cards.indexOf(cardPlayingWith[j]), 1);
                        obj.hasOneOfCards[indetifier[i]].status = true;
                    }
                }
            }
        }
    }
}

function addingToPlayerDontHaves(obj, cardPlayingWith, playerName) {
    for (let i = 0; i < cardPlayingWith.length; i++) {
        if (cards[playerName].doesntHaveCards.includes(cardPlayingWith[i])) {
            console.log("We already know that ${playerName} doesn't have ${cardPlayingWith}");
        } else {
            updateDoesntHaveObj(obj, cardPlayingWith[i]);
            for (let i = 0; i < identifier.length; i++) {
                for (let j = 0; j < cardPlayingWith.length; j++) {
                    if (obj.hasOneOfCards[indetifier[i]].cards.includes(cardPlayingWith[j])) {
                        obj.hasOneOfCards[indetifier[i]].cards.splice(obj.hasOneOfCards[indetifier[i]].cards.indexOf(cardPlayingWith[j]), 1);
                    }
                }
            }
        }
    }
}
    


function updateDefHasObj(obj, defHasCards) {
    if (defHasCards.length > 1) {
        for (let i = 0; i < defHasCards.length; i++)  {
            obj.defHasCards.push(defHasCards[i]);
        }
    } else {
        obj.defHasCards.push(defHasCards);
    }
    console.log(obj.defHasCards)
    checkIfAllAnsForPlayer(obj);
}
function updateDoesntHaveObj(obj, doesntHaveCards) {
   if (doesntHaveCards.length > 1) {
        for (let i = 0; i < doesntHaveCards.length; i++)  {
            obj.doesntHaveCards.push(doesntHaveCards[i]);
        }
    } else {
        obj.doesntHaveCards.push(doesntHaveCards);
    } 
    console.log(obj.doesntHaveCards)

}
function updateHasOneOfObj(obj, hasOneOfCards) {
    if (identifier.length > 1) {
        identifier.push(identifier[identifier.length - 1] + 1);
    }
    obj.hasOneOfCards[indetifier[identifier.length - 1]] = {};
    obj.hasOneOfCards[indetifier[identifier.length - 1]].cards = hasOneOfCards;
    obj.hasOneOfCards[indetifier[identifier.length - 1]].status = false;
    for (let i = 0; i < identifier.length; i++) {
        for (let j = 0; j < obj.defHasCards.length; j++) {
            if (obj.hasOneOfCards[indetifier[i]].cards.includes(obj.defHasCards[j])) {
                obj.hasOneOfCards[indetifier[i]].cards.splice(obj.hasOneOfCards[indetifier[i]].cards.indexOf(obj.defHasCards[j]), 1);
                obj.hasOneOfCards[indetifier[i]].status = true;
            }
        }
    }
    console.log(obj.hasOneOfCards)
    checkIfAllAnsForPlayer(obj);
} 

function checkIfAnswer() {
    if (whoCards.includes(whoSolution) && whatCards.includes(whatSolution) && whereCards.includes(whereSolution)) {
        window.location = './answer.html';
        setAnswer(whoSolution, whatSolution, whereSolution);
        
    }
}

function setAnswer(who, what, where) {
    document.getElementById("answer").innerHTML = `It is ${who} with the ${what} in the ${where}`;
}

function checkAnsType(ans) {
    if (whoCards.includes(ans)) {
        whoSolution = ans
    }
    if (whatCards.includes(ans)) {
        whatSolution = ans
    }
    if (whereCards.includes(ans)) {
        whereSolution = ans
    }
    checkIfAnswer();
}

function checkIfAllAnsForPlayer(obj) {
    if (obj.defHasCards.length == 3) {
        var dontHavePlayerCards = doesntHaves(obj.defHasCards)
        obj.doesntHaveCards = dontHavePlayerCards
        checkAnswer()
    } else {
        for (let i = 0; i < indetifier.length; i++) {
            if (obj.hasOneOfCards[indetifier[i]].status == false) {
                allPossibleAns[howManyOneOfs] = obj.hasOneOfCards[indetifier[i]].cards
                howManyOneOfs = howManyOneOfs + 1
                for (let a = 0; a < Object.keys(allPossibleAns).length; a++) {
                    for (let j = 0; j < allPossibleAns[a].length; j++) {
                        for (let q = 0; q < Object.keys(allPossibleAns).length; q++) {
                            if (q != a) {
                                if (allPossibleAns[q].includes(allPossibleAns[a][j])) {
                                    console.log("Can't quite just give this person all doesn't haves")
                                    IsItGood = IsItGood + 1
                                } 
                            }
                        }
                    }
                }
                if (IsItGood != 0) {
                    console.log(`You have ${IsItGood} has one ofs that match another one`)
                    howManyOneOfs = 0
                } else {
                    if (obj.defHasCards.length + howManyOneOfs == 3) {
                        possibleAnsAry = obj.defHasCards
                        for (let i = 0; i < Object.keys(allPossibleAns).length; i++) {
                            for (let j = 0; j < allPossibleAns[i].length; j++) {
                                possibleAnsAry.push(allPossibleAns[i][j])
                            }
                        }
                        var iDontHaveIt = doesntHaves(possibleAnsAry)
                        obj.doesntHaveCards = iDontHaveIt
                        checkAnswer()
                    }
                }
            }
        }
    }
}

function checkAnswer() {
    for (let i = 0; i < cards.boardCards.donthaves.length; i++) {
        if (cards.yourCards.donthaves.includes(cards.boardCards.donthaves[i])) {
            for (let j = 0; j < numOfPlayers; j++) {
                if (cards[playerNames[j]].donthaves.includes(cards.boardCards.donthaves[i])) {
                    console.log(`You, the board, and ${playerNames[j]} don't have ${cards.boardCards.donthaves[i]}`)
                    playersWorked = playersWorked + 1
                    if (playersWorked == numOfPlayers) {
                        checkAnsType(cards.boardCards.donthaves[i]);
                    }
                } else {
                    playersWorked = 0
                    break;
                }
            }
        }   
    }
}

function yourPosition() {
    for (let i = 0; i < numOfPlayers; i++) {
        if (playerNames[i] == yourName) {
            yourPosition = i
        }
    }
}




function handleTurnResults(res2) {
    var obj2 = JSON.parse(res2);
    turnData(obj2);
}

function handleSetupResults(res1) {
    var obj1 = JSON.parse(res1);
    setupData(obj1);
}

function turnData(obj2) {
    var results = JSON.stringify(obj2);
    whatWasShown(results);
    personThatAnswered(results);
    whatWasQuestion(results);
    checkWhatToDo(cardShown, whoAnswered, fullQuestion)
    
}

function checkWhatToDo(cardShown, whoAnswered, fullQuestion) {
    if (isCardShownToMe(cardShown)) {
        if (amICurrentPlayer())  {
            for (let i = 0; i < numOfPlayers; i++) {
                if (playerNames[i] != yourName) {
                    addingToPlayerDontHaves(cards[playerNames[i]], fullQuestion, playerNames[i])
                }
            }
        } else  if (didPlayerAnswer(whoAnswered)) {
            updateHasOneOfObj(cards[playerNames[playerNames.indexOf(whoAnswered)]], fullQuestion)
        } else {
            for (let i = 0; i < numOfPlayers; i++) {
                if (playerNames[i] != determineCurrentPlayer(orderNumber)) {
                    addingToPlayerDontHaves(cards[playerNames[i]], fullQuestion, playerNames[i])
                }
            }
        }
    } else {
        addingToPlayerHas(cards[playerNames[playerNames.indexOf(whoAnswered)]], cardShown, whoAnswered)
    }
}

function determineCurrentPlayer(orderNumber) {
    return playerNames[(orderNumber % numOfPlayers) - 1]
}
    
function amICurrentPlayer() {
    if (determineCurrentPlayer(orderNumber) == yourName) {
        return true
    } else {
        return false
    }
}

function isCardShownToMe(cardShown) {
    if (cardShown !== '""') {
        return false
    } else {
        return true
    }
}

function didPlayerAnswer(whoAnswered) {
    if (whoAnswered !== '""') {
        return false
    } else {
        return true
    }
}


function whatWasShown(results) {
    var shownPlus = results.slice(results.indexOf('"whatWasShown"'));
    cardShown = shownPlus.slice((shownPlus.indexOf(':') + 1), (shownPlus.indexOf(',')));
    if (cardShown.includes("}")) {
            cardShown = cardShown.slice(cardShown.indexOf('}'))
        }
    //return cardShown;
    console.log(`Card Shown: ${cardShown}`)
}

function personThatAnswered(results) {
    var answerer = results.slice(results.indexOf('"whoAnswered"'));
    whoAnswered = answerer.slice((answerer.indexOf(':') + 1), (answerer.indexOf(',')));
    //return whoAnswered;
    console.log(`Who Answered: ${whoAnswered}`)
}

 function whatWasQuestion(results) {
     var whoQuestionPlus = results.slice(results.indexOf('"whoInQuestion"'));
     var whatQuestionPlus = results.slice(results.indexOf('"whatInQuestion"'));
     var whereQuestionPlus = results.slice(results.indexOf('"whereInQuestion"'));
     whoQuestion = whoQuestionPlus.slice((whoQuestionPlus.indexOf(':') + 1), (whoQuestionPlus.indexOf(',')));
     whatQuestion = whatQuestionPlus.slice((whatQuestionPlus.indexOf(':') + 1), (whatQuestionPlus.indexOf(',')));
     whereQuestion = whereQuestionPlus.slice((whereQuestionPlus.indexOf(':') + 1), (whereQuestionPlus.indexOf(',')));
     fullQuestion = [whoQuestion, whatQuestion, whereQuestion]
     //return fullQuestion;
     console.log(`The question: ${fullQuestion}`)
}
    
function setupData(obj1) {
    var results = JSON.stringify(obj1);
    numberOfPlayers(results);
    name(results);
    namesOfPlayers(results);
    whatCardsOnBoard(results);
    myCards(results);
    setupObj(boardCards, yourCards, playerNames)
}

function numberOfPlayers(results) {
    var playersAndBeyond = results.slice(results.indexOf('"numOfPlayers"'));
    numOfPlayers = playersAndBeyond.slice((playersAndBeyond.indexOf(':') + 1), (playersAndBeyond.indexOf(',')));
    //return numOfPlayers;
    console.log(`Player #: ${numOfPlayers}`)
}

function name(results) {
    var nameAndMore = results.slice(results.indexOf('"yourName"'));
    yourName = nameAndMore.slice((nameAndMore.indexOf(':') + 1), (nameAndMore.indexOf(',')));
    yourName = JSON.parse(yourName);
    //return yourName;
    console.log(`Your Name: ${yourName}`)
}

function namesOfPlayers(results) {
    var playerNam = results.slice(results.indexOf('"playerNames"'));
    playerNames = playerNam.slice((playerNam.indexOf(':') + 1), (playerNam.indexOf(']')) + 1);
    playerNames = JSON.parse(playerNames);
    //return playerNames;
    console.log(`Player Names: ${playerNames}`)
}

function whatCardsOnBoard(results) {
    var cardBoard = results.slice(results.indexOf('"boardCards"'));
    boardCardsUn = cardBoard.slice((cardBoard.indexOf(':') + 1), (cardBoard.indexOf(']')) + 1);
    boardCards = JSON.parse(boardCardsUn)
    //boardCardsUpdate = JSON.parse(boardCardsUpdate);
    //for (let i = 0; i < boardCardsUpdate; i++) {
    //    boardCards = boardCardsUpdate.split(",")
    //}
    //return boardCards;
    console.log(`Board Cards: ${boardCards}`)
}

function myCards(results) {
    var mine = results.slice(results.indexOf('"yourCards"'));
    yourCardsUn = mine.slice((mine.indexOf(':') + 1), (mine.indexOf(']')) + 1);
    yourCards = JSON.parse(yourCardsUn)
    //return yourCards;
    console.log(`your Cards: ${yourCards}`)
}

function getSetupData() {
    select("gamesetup", {"gameKey": gameKey}, handleSetupResults, handleError);
}

function getTurnData() {
    select("turn", {"gameKey": gameKey, "order": orderNumber}, handleTurnResults, handleError);
} 

//getTurnData()
//getSetupData()