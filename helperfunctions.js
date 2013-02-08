//These are a couple of helper functions
//I wrote that go along with the main code

//finds the next empty seat in a room
function getEmptySeat(room) {
  for (i = 1; i < 5; i ++){
    console.log(room["player"+i]);
    if (room["player"+i] == "none"){
      return i
    }
  }
  return false
}

//updates the amount of mon
function updateContrib(round,contrib){
  roomData.child('game').child('roundContr' +round).child(playerID).set(parseInt(contrib));
}

//check if room is full
function checkRoomFull(room) {
  for (i = 1; i < 5; i ++){
    if (room["player"+i] == "none"){
      return false;
    }
  }
  return true;
}

//check if current round is completed
function checkCurrentRoundComplete(room){
  currentRound = room["roundNum"];
  currentRoundCash = room["game"]["roundContr" + currentRound];
  unreadyPlayers = 0;
  for (i = 1; i < 5; i++){
    if (currentRoundCash[i] == "none"){
      unreadyPlayers ++;
    }
  }
  console.log(currentRoundCash);
  console.log(unreadyPlayers);
  if (unreadyPlayers == 0){
    return -1
  }
  return unreadyPlayers
}

//returns the number of players left
function getPlayersLeft(room) {
  k = 0;
  for (i = 1; i < 5; i ++){
    if (room["player"+i] == "none"){
      k++;
    }
  }
  return k;
}

//calculates the next rounds of starting sums
function calcNextRound(room){
  currentRound = room["roundNum"];
  lastRound = currentRound - 1;
  currentRoundCash = room["game"]["round" + currentRound];
  lastRoundContr = room["game"]["roundContr" + lastRound];
  lastRoundCash = room["game"]["round" + lastRound];
  for (i = 1; i < 5; i ++){
    currentRoundCash[i] = lastRoundCash[i] - lastRoundContr[i];
  }
  roomData.child('game').child('round' + currentRound).set(currentRoundCash);
  
}

//updates the stat table
function updateTable(room){
  rowToAdd = "";
  currentRound = room["roundNum"];
  currentRoundCash = room["game"]["round" + currentRound];
  rowToAdd += "<td id='"+currentRound+"'>" + currentRound + "</td>";
  for (i = 1; i < 5; i ++){
    rowToAdd += "<td>" + currentRoundCash[i] + "</td>";
  }
  if ($("#"+currentRound).length == 0 && currentRoundCash[1] != "none"){
    return "<tr>" + rowToAdd + "</tr>";
  } else {
    return "";
  }
}