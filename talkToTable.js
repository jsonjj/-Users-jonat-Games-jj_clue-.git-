var dbApiCorsKey = "69db2f664dada2bee5bc3e76865f336cf576e";
var baseTableUrl = "https://cluesolver-0d89.restdb.io/rest";
var windowQs = window.location.search;
var urlParams = new URLSearchParams(windowQs);
var setupForm = document.getElementById("setupForm");
var yourNameInput = document.getElementById("yourName");
var turnForm = document.getElementById("turnForm");
var whoInput = document.getElementById("who");
var whatInput = document.getElementById("what");
var whereInput = document.getElementById("where");
var turnNum = 0;
var lastTurn = 0;
var numOfPlayers;
var turnsPassed = 0;
var number = 1;
var orderNum = 0;
var answererInput = document.getElementById("whoAnswered");
if (setupForm) {
    var playerNamesInputs = setupForm.elements["player[]"];
    var board = setupForm.elements.boardCards;
    var mineCards = setupForm.elements.yourCards;
}
if (turnForm) {
    var answerInput = turnForm.elements.shownCard;
}
if (!gameKey) {
    var gameKey = urlParams.get('gameKey');
}
function insert(tableName, data, callback, badcallback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
      console.log(`Inserting data w/ ready State: ${this.readyState}`);
    if (this.readyState == 4) {
      if (this.status >= 200 && this.status < 300) {
        if (callback) {
          callback(this.responseText);
        }
      } else {
        if (badcallback) {
          badcallback(this);
        }
      }
    }
  };

  xhttp.open("POST", `${baseTableUrl}/${tableName}`, true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.setRequestHeader("x-apikey", dbApiCorsKey);
  var stringifiedData = JSON.stringify(data);
  console.log(`Generating New '${tableName}' Record: ${stringifiedData}...`);
  xhttp.send(stringifiedData);
}

function select(tableName, filter, callback, badcallback) {
  var xhttp = new XMLHttpRequest();
  // xhttp.timeout = 10000;
  xhttp.onreadystatechange = function () {
      console.log(`Selecting data w/ ready State: ${this.readyState}`);
    if (this.readyState == 4) {
        console.log(`Selecting data w/ status: ${this.status}, & response: ${this.responseText}`);
      if (this.status >= 200 && this.status < 300) {
        if (callback) {
        console.log(`wdqwdqwdqw: ${tableName}`);
          callback(this.responseText);
        }
      } else {
        if (badcallback) {
          badcallback(this);
        }
      }
    }
  };

  var stringifiedFilter = JSON.stringify(filter);
  var encoded = encodeURI(stringifiedFilter);
  encoded=`%7B\"gameKey\":\"${filter.gameKey}\"%7D`;
//  xhttp.open("GET", `${baseTableUrl}/${tableName}?q=${stringifiedFilter}`, true);
  encoded=`%7B"gameKey":"${filter.gameKey}"%7D`;
var url = `${baseTableUrl}/${tableName}?q=${encoded}`;
 url = `${baseTableUrl}/${tableName}`;
console.log(`the uri: ${url}`);
  //xhttp.open("GET", url, true);
  
  xhttp.open("GET", `${baseTableUrl}/${tableName}?q=${encoded}`, false);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.setRequestHeader("x-apikey", dbApiCorsKey);
  // var stringifiedData = JSON.stringify(filter);
  console.log(`Generating New '${tableName}' Record: ${stringifiedFilter}`);
  xhttp.send();
  console.log("holllaaa vamos aqui");
}

function getURLParam(key,target){
        var values = [];

		key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        
        var pattern = key + '=([^&#]+)';
        var o_reg = new RegExp(pattern,'ig');
		while(true){
			var matches = o_reg.exec(target);
			if(matches && matches[1]){
				values.push(matches[1]);
			}
			else{
				break;
			}
		}
        if(!values.length){
             return null;   
        }
        else{
            return values.length == 1 ? values[0] : values;
        }
    }
function boardCards() {
    return Object.values(board).map(function(x) {
        if (x.checked !== true) {
            return null;
        } else {
            return x.id;
        }
    }).filter(elements => {
    return elements !== null;
    });
}
function myCards() {
    return Object.values(mineCards).map(function(x) {
        if (x.checked !== true) {
            return null;
        } else {
            return x.id;
        }
    }).filter(elements => {
    return elements !== null;
    });
}

function whatIsShown() {
    return Object.values(answerInput).map(function(x) {
        if (x.checked !== true) {
            return null;
        } else {
            return x.id;
        }
    }).filter(elements => {
    return elements !== null;
    });
}

function playerNames() {
    if (playerNamesInputs) {
        return Object.values(playerNamesInputs).map((x) => {return x.value});
    } else {
      if (urlParams) {
        playerNamesString = urlParams.get('playerNames');
        return playerNamesString.split(", ");
      } else {
          console.warn("FAIL: missing playerName info...");
          return [];
      }
    }
}
 
function setupInfo() {
    yourName = yourNameInput.value;
    playerNames = playerNames();
    numOfPlayers = parseInt(urlParams.get('numOfPlayers'))
  return {
    "numOfPlayers": parseInt(urlParams.get('numOfPlayers')),
    "yourName": yourName,
    "playerNames": playerNames,
    "boardCards": boardCards(),
    "yourCards": myCards(),
    "gameKey": gameKey,
  };
}

function order() {
    orderNum = orderNum + 1
    return orderNum
}

function turnNumber() {
    turnNum = turnNum + 1
    if (turnNum > playerNames().length) {
        number = number + 1
        turnNum = 0
    }
    return number;
}


function turnInfo() {
    var who = whoInput.value;
    var what = whatInput.value;
    var where = whereInput.value;
    var whoAnswered = answererInput.value;
  return {
      "whoInQuestion": who,
      "whatInQuestion": what,
      "whereInQuestion": where,
      "order": order(),
      "turnNum": turnNumber(),
      "gameKey": gameKey,
      "whoAnswered": whoAnswered,
      "whatWasShown": whatIsShown(),
  };
}

function setResults(res) {
    document.getElementById("results").innerHTML = JSON.stringify(res);
    document.getElementById("results").style.display = "block";
}

function goFromFirstTurnToMoreTurns(res) {
    console.log(`I just gained ${res}`);
    addHiddenFieldToForm(turnForm, "gameKey", gameKey);
    getDataFromTables();
    turnForm.reset(); // inplace of submit we are just resetting the form

}
function gameTurn() {
    insert("turn", turnInfo(), goFromFirstTurnToMoreTurns);
}

function addHiddenFieldToForm(form, name, value) {
    var box = document.createElement("input");
    box.type = "hidden";
    box.name = name;
    box.value = value;
    form.prepend(box);
}


function goFromSetupToTurnPage(res) {
    console.log(`I recieved got ${res}`);
    window.location = `./turn.html?playerNames=${playerNames.join(", ")}&gameKey=${gameKey}`
    //  addHiddenFieldToForm(setupForm, "gameKey", gameKey);
//     addHiddenFieldToForm(setupForm, "playerNames", playerNames);
//     setupForm.submit();
}
function setupGame() {
    insert("gamesetup", setupInfo(), goFromSetupToTurnPage);
}

function setupResults(res) {
    console.log(`i got ${res} from gamesetup table`);
    getDataFromGameTurnTable(res);
}

function turnResults(res1, res2) {
   var obj1 = JSON.parse(res1);
   var obj2 = JSON.parse(res2);
   var mergedObj = { ...obj1,  ...obj2 };
   
   setResults(mergedObj);
}

function handleError(res) {
    console.log(`got an error: ${JSON.stringify(res)}`);
}

function getDataFromTables() {
    getDataFromGameSetupTable();
}

function getDataFromGameSetupTable() {
    console.log(`gonnna get ${gameKey} from gamesetup table`)
    select("gamesetup", {"gameKey": gameKey}, setupResults, handleError);
}

function getDataFromGameTurnTable(res1) {
    console.log(`gonnna get ${gameKey} from turn table`)
    select("turn", {"gameKey": gameKey}, function(res2) { turnResults(res1, res2) }, handleError);
}