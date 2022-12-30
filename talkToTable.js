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
var turnNum = 1;
var lastTurn = 0;
var order = 1;
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
  xhttp.onreadystatechange = function () {
              console.log(`Selecting data w/ ready State: ${this.readyState}`);
    if (this.readyState == 4) {
        console.log(`Selecting data and ready w/ status: ${this.status}`);
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

  var stringifiedFilter = JSON.stringify(filter);
  var encoded = encodeURI(stringifiedFilter);
//  xhttp.open("GET", `${baseTableUrl}/${tableName}?q=${stringifiedFilter}`, true);

  xhttp.open("GET", `${baseTableUrl}/${tableName}?q=${encoded}`, true);
    // xhttp.setRequestHeader("Accept", "application/json");
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.setRequestHeader("x-apikey", dbApiCorsKey);
  console.log(`Looking '${tableName}' Record where: ${stringifiedFilter}...`);
  xhttp.send();
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

 
function setupInfo() {
    yourName = yourNameInput.value;
    playerNames = Object.values(playerNamesInputs).map((x) => {return x.value})
;
  return {
    "numOfPlayers": parseInt(urlParams.get('numOfPlayers')),
    "yourName": yourName,
    "playerNames": playerNames,
    "boardCards": boardCards(),
    "yourCards": myCards(),
    "gameKey": gameKey,
  };
}

function turnNum(turnNum, order) {
    if (lastTurn > 0) {     
        turnNum = turnNum + 1;
        lastTurn = 0;
    }
    if (order == parseInt(urlParams.get('numOfPlayers'))) {
        lastTurn = 1;
    }
}

function order(order) {
    if (order > parseInt(urlParams.get('numOfPlayers'))) {
        order = 1;
    } else {
        order = order + 1;
    }
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
      "turnNum": turnNum,
      "gameKey": gameKey,
      "order": order,
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
    turnForm.submit();

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
    addHiddenFieldToForm(setupForm, "gameKey", gameKey);
    setupForm.submit();
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