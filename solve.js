var boardCards = []
var yourCards = []
var numOfPlayers;
var yourName;
var playerNames = []
var whoCards = [green, mustard, peacock, plum, scarlet, white]
var whatCards = [candlestick, dagger, pistol, lead_pipe, rope, wrench]
var whereCards = [bathroom, bedroom, courtyard, dining_room, game_room, garage, kitchen, living_room, office]
var allCards = [green, mustard, peacock, plum, scarlet, white, candlestick, dagger, pistol, lead_pipe, rope, wrench, bathroom, bedroom, courtyard, dining_room, game_room, garage, kitchen, living_room, office]
var yourPosition;
var possibleWhoAnswers = [green, mustard, peacock, plum, scarlet, white]
var possibleWhatAnswers = [candlestick, dagger, pistol, lead_pipe, rope, wrench]
var possibleWhereAnswers = [bathroom, bedroom, courtyard, dining_room, game_room, garage, kitchen, living_room, office]
var whoSolution;
var whatSolution;
var whereSolution;
var cardsOnBoard = {}
var cardsInHand = {}
var cards = {boardCards: cardsOnBoard, yourCards: cardsInHand};
var doesntHaves = []
var playersWorked = 0
var identifier = [0]
var allPossibleAns = {};
var howManyOneOfs = 0
var IsItGood = 0
var possibleAnsAry = [];
var orderNumber = 1
var cardShown = ""
var whoAnswered = ""
var whoQuestion = ""
var whatQuestion = ""
var whereQuestion = ""
var fullQuestion = []

function setPlayerCards() {
    for (let i = 0; i < numOfPlayers; i++) {
        playerNames[i]
    }
}



function setupObj(boardCards, yourCards, playerNames) {
    createBoardObj(boardCards);
    createYourObj(yourCards);
    createPlayerObj(playerNames);
}

function createBoardObj(boardCards) {
    cards.boardCards.defHasCards = boardCards
    cards.boardCards.donthaves = doesntHaves(boardCards)
}

function createYourObj(yourCards) {
    cards.yourCards.defHasCards = yourCards
    cards.yourCards.donthaves = doesntHaves(yourCards)
}

function createPlayerObj(playerNames) {
    for (let i = 0; i < playerNames.length; i++) {
    cards.[playerNames[i]] = {defHasCards: [], doesntHaveCards: [], hasOneOfCards: {}}
    }
}

function doesntHaves(haves) {
    for (let i = 0; i < haves.length; i++) {
        doesntHaves = allCards.splice(allCards.indexOf(haves[i]), 1)
    }
    return doesntHaves
}

function addingToPlayerHas(obj, cardPlayingWith, playerName) {
    for (let i = 0; i < cardPlayingWith.length; i++) {
        if (cards[playerName].defHasCards.includes(cardPlayingWith[i])) {
            console.log("We already know that ${playerName} has ${cardPlayingWith}")
        } else {
            updateDefHasObj(obj, cardPlayingWith[i])
            for (let i = 0; i < numOfPlayers; i++) {
                if (playerNames[i] != playerName) {
                    addingToPlayerDontHaves(cards[playerNames[i]] ,cardPlayingWith[i], playerName)
                }
            }
            for (let i = 0; i < identifier.length; i++) {
                for (let j = 0; j < cardPlayingWith.length; j++) {
                    if (obj.hasOneOfCards[indetifier[i]].cards.includes(cardPlayingWith[j])) {
                        obj.hasOneOfCards[indetifier[i]].cards.splice(obj.hasOneOfCards[indetifier[i]].cards.indexOf(cardPlayingWith[j]), 1)
                        obj.hasOneOfCards[indetifier[i]].status = true
                    }
                }
            }
        }
    }
}

function addingToPlayerDontHaves(obj, cardPlayingWith, playerName) {
    for (let i = 0; i < cardPlayingWith.length; i++) {
        if (cards[playerName].doesntHaveCards.includes(cardPlayingWith[i])) {
            console.log("We already know that ${playerName} doesn't have ${cardPlayingWith}")
        } else {
            updateDoesntHaveObj(obj, cardPlayingWith[i])
            for (let i = 0; i < identifier.length; i++) {
                for (let j = 0; j < cardPlayingWith.length; j++) {
                    if (obj.hasOneOfCards[indetifier[i]].cards.includes(cardPlayingWith[j])) {
                        obj.hasOneOfCards[indetifier[i]].cards.splice(obj.hasOneOfCards[indetifier[i]].cards.indexOf(cardPlayingWith[j]), 1)
                    }
                }
            }
        }
}
    


function updateDefHasObj(obj, defHasCards) {
    if (defHasCards.length > 1) {
        for (let i = 0; i < defHasCards.length; i++)  {
            obj.defHasCards.push(defHasCards[i])
        }
    } else {
        obj.defHasCards.push(defHasCards)
    }
    checkIfAllAnsForPlayer(obj)
}
function updateDoesntHaveObj(obj, doesntHaveCards) {
   if (doesntHaveCards.length > 1) {
        for (let i = 0; i < doesntHaveCards.length; i++)  {
            obj.doesntHaveCards.push(doesntHaveCards[i])
        }
    } else {
        obj.doesntHaveCards.push(doesntHaveCards)
    } 
}
function updateHasOneOfObj(obj, hasOneOfCards) {
    if (identifier.length > 1) {
        identifier.push(identifier[identifier.length - 1] + 1)
    }
    obj.hasOneOfCards[indetifier[identifier.length - 1]] = {}
    obj.hasOneOfCards[indetifier[identifier.length - 1]].cards = hasOneOfCards
    obj.hasOneOfCards[indetifier[identifier.length - 1]].status = false
    for (let i = 0; i < identifier.length; i++) {
        for (let j = 0; j < obj.defHasCards.length; j++) {
            if (obj.hasOneOfCards[indetifier[i]].cards.includes(obj.defHasCards[j])) {
                obj.hasOneOfCards[indetifier[i]].cards.splice(obj.hasOneOfCards[indetifier[i]].cards.indexOf(obj.defHasCards[j]), 1)
                obj.hasOneOfCards[indetifier[i]].status = true
            }
        }
    }
    checkIfAllAnsForPlayer(obj)
} 

function checkIfAnswer() {
    if (whoCards.includes(whoSolution) && whatCards.includes(whatSolution) &&       whereCards.includes(whereSolution)) {
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
        obj.doesntHaveCards = doesntHaves(obj.defHasCards)
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
                        obj.doesntHaveCards = doesntHaves(possibleAnsAry)
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

function yourPosition {
    for (let i = 0; i < numOfPlayers; i++) {
        if (playerNames[i] == yourName) {
            yourPosition = i
        }
    }
}


    
function handleResults(res1) {
    select("turn", {"gameKey": gameKey, "order": orderNumber}, function(res2) { handleTurnResults(res1, res2) }, handleError);
} 

function handleTurnResults(res1, res2) {
    var obj1 = JSON.parse(res1);
    var obj2 = JSON.parse(res2);
    setupData(obj1);
    turnData(obj2);
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
        } else {
            updateHasOneOfObj(cards.[playerNames[playerNames.indexOf(whoAnswered)]], fullQuestion)
        }
    } else {
        addingToPlayerHas(cards.[playerNames[playerNames.indexOf(whoAnswered)]], cardShown, whoAnswered)
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
    cardsOnBoard(results);
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
    //return yourName;
    console.log(`Your Name: ${yourName}`)
}

function namesOfPlayers(results) {
    var playerNam = results.slice(results.indexOf('"playerNames"'));
    playerNames = playerNam.slice((playerNam.indexOf(':') + 1), (playerNam.indexOf(']')) + 1);
    //return playerNames;
    console.log(`Player Names: ${playerNames}`)
}

function cardsOnBoard(results) {
    var cardBoard = results.slice(results.indexOf('"boardCards"'));
    boardCards = cardBoard.slice((cardBoard.indexOf(':') + 1), (cardBoard.indexOf(']')) + 1);
    //return boardCards;
    console.log(`Board Cards: ${boardCards}`)
}

function myCards(results) {
    var mine = results.slice(results.indexOf('"yourCards"'));
    yourCards = mine.slice((mine.indexOf(':') + 1), (mine.indexOf(']')) + 1);
    //return yourCards;
    console.log(`your Cards: ${yourCards}`)
}

function getSetupData() {
    select("gamesetup", {"gameKey": gameKey}, handleResults, handleError);
}


getSetupData()
//{"_id":"63b0f995cbd79f6600040923","whoInQuestion":"peacock","whatInQuestion":"dagger","whereInQuestion":"game_room","whoAnswered":"ascasc","whatWasShown":["green"],"order":1,"turnNum":1,"gameKey":"17eb6ee2-ce63-ef59-4baf-7924dc00d2b3"}}