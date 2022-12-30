function select(tableName, filter, callback, badcallback) {
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
}

var gameKey = 1

function setupResults(res) {
  return res
}

function turnResults(res) {
  return res
}

function getDataFromTables() {
    select("gamesetup", {
        "gameKey": gameKey
    }, setupResults);

    select("players", {
        "gameKey": gameKey,
    }, turnResults);
}

getDataFromTables()