
var myDataRef = new Firebase('https://banker.firebaseio.com');
var internalRoundCounter = null;
var internalState = "NEW_ROUND";

//connect to a room
var roomData = new Firebase('https://banker.firebaseio.com/roomData');
roomData.once('value', function(snapshot) {
  room = snapshot.val();
  playerID = getEmptySeat(room);
  if (playerID != false){
    $("#messagebox").append("<h2>you are PLAYER" + playerID + "</h2><h3>Waiting for others to join the room</h3>");
    roomData.child('player'+playerID).set('True');
  } else {
    alert("all seats are full in this room");
  }
});

//listener- anytime any value of the database is changed, this function will be fired
roomData.on('value', function(snapshot){
  room = snapshot.val()
  $("#statTable").append(updateTable(room));
  
  //if the global round number has incremented, but this particular room hasnt, the round has moved on
  if (room['roundNum'] != internalRoundCounter){
    internalState = "NEW_ROUND";
    internalRoundCounter = room['roundNum'];
  }
  
  //if the room is full
  if(checkRoomFull(room)){
    console.log("state: " + internalState)
    
    //******************************
    //The state machine begins here:
    //******************************
    
    if (internalState == "NEW_ROUND"){
      console.log(room);
      //Beginning of a new round, displays the message for players
      $("#messagebox").append("This is round " + internalRoundCounter + ".<br />");
      $("#inputTxt").removeAttr('disabled');
    inputAmount = $("#inputTxt").val("");
      $("#inputTxt").focus();
      internalState = "WAITING_FOR_PLAYER_INPUT";
    
    } else if (internalState == "WAITING_FOR_PLAYER_INPUT"){
      //We're waiting for the player to input a value
    
    } else if (internalState == "WAITING_MESSAGE"){
      //Player has finished entering a value, display message
      $("#messagebox").append("Waiting for other players...<br />");
      $("#inputTxt").attr('disabled', 'disabled');
      internalState = "WAITING_READY";
      
    } else if (internalState == "WAITING_READY"){
      //Player is now waiting for other players.
      
      if (checkCurrentRoundComplete(room) == -1){
        //This player has detected the round is complete! Move onto the next round, please
        roomData.child('roundNum').set(internalRoundCounter+1);
        //Do the calculations before beginning the next round
        calcNextRound(room);
      }
    }
  } else {
    
    //If we are still waiting for people to join the room, display number of players left
    $("#messagebox").append("WAITING FOR " + getPlayersLeft(room) + " PLAYERS<br />");
  }
});

//detect if a person leaves the room.
window.onbeforeunload = function (e) {
    e = e || window.event;
    var closingMessage = 'Closing this window will likely cause you cancer';
    if (playerID != false){
      roomData.child('player'+playerID).set('none');
    }
    if (e) {
      e.returnValue = closingMessage;
    }
    return closingMessage;
};

$(document).ready(function(){
  
  //sets the cursor on the input text
  $("#inputTxt").focus();
  
  //whenever the user hits submit or hits enter
  function submitEnter(){
    inputAmount = $("#inputTxt").val();
    internalState = "WAITING_MESSAGE";
    updateContrib(internalRoundCounter, inputAmount);
  }
  
  //listening to submitbutton being clicked
  $("#submitBtn").click(function(){
    submitEnter();
  });
  //listening to hiting enter key
  $(document).keypress(function(e) {
    if(e.which == 13) {
      submitEnter();
    }
  });
});