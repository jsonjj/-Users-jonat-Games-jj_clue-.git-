var boardCards = []
var yourCards = []
var boardCardDontHave = []
var yourCardsDontHave = []
var numOfPlayers;
var yourName;
var playerNames = []



function handleResults(res1) {
    select("turn", {"gameKey": gameKey}, function(res2) { handleTurnResults(res1, res2) }, handleError);
} 

function handleTurnResults(res1, res2) {
    var obj1 = JSON.parse(res1);
    var obj2 = JSON.parse(res2);
    setupData(obj1);
    turnData(obj2);
}

function setupData(obj1) {
    var results = JSON.stringify(obj1);
    numberOfPlayers(results);
    name(results);
    namesOfPlayers(results);
    cardsOnBoard(results);
    myCards(results);
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