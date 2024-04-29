var scores = [0, 0]; //x, o
var board = ["", "", "", "", "", "", "", "", ""];
var xturn = true;
var game_over = true;
var turn_count = 0;

var vscomputer = false;
var isplayerturn = true;

const win_combinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Columns
  [0, 4, 8],
  [2, 4, 6], // Diagonals
];

const name = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

//resets the board and score
function reset() {
  reset_board();
  game_over = true;
  scores = [0, 0];
  document.getElementById(
    "score"
  ).innerHTML = `Score: X:${scores[0]} O:${scores[1]}`;
  document.getElementById("current_player").innerHTML = "";
}

//starts new game
function new_game(pc) {
  reset_board();
  xturn = true;
  game_over = false;
  vscomputer = pc;
  isplayerturn = pc;
  document.getElementById("current_player").innerHTML = "X";
}

//clears the board array and html
function reset_board() {
  board = ["", "", "", "", "", "", "", "", ""];
  const allBoxes = document.querySelectorAll(".xo");
  for (let i = 0; i < allBoxes.length; i++) {
    allBoxes[i].innerHTML = "";
  }
  document.getElementById("result").innerHTML = "";
  turn_count = 0;
}

//updates board at pos depending on who's turn it is
//returns false if board state was not updated OR game finished after updating
//returns true if board state updates and game did not finish
function update_board(pos) {
  //if spot is taken or not in a game, return
  if (board[pos] != "" || game_over === true) {
    return false;
  }

  if (xturn) {
    board[pos] = "X";
    document.querySelector(`.${name[pos]} .xo`).innerHTML = "X";
  } else {
    board[pos] = "O";
    document.querySelector(`.${name[pos]} .xo`).innerHTML = "O";
  }

  //increment turns and check if win/tie
  turn_count = turn_count + 1;
  if (check_win()) {
    return false;
  }

  //change x's turn
  xturn = !xturn;
  document.getElementById("current_player").innerHTML = xturn ? "X" : "O";
  return true;
}

function player_turn(pos) {
  if (game_over) {
    return;
  }
  if (vscomputer && isplayerturn === false) {
    console.log("not your turn!");
    return;
  } else {
    if (update_board(pos) && vscomputer) {
      computer_turn();
    }
  }
}

//computer's turn
function computer_turn() {
  if (game_over) {
    return;
  }
  //isplayerturn to determine if player can move
  isplayerturn = false;
  document.getElementById("pc_wait").innerHTML = "Computer is thinking...";
  sleep(1500).then(() => {
    update_board(random_choice());
    document.getElementById("pc_wait").innerHTML = "";
    isplayerturn = true;
  });
}

//returns true if game ended, false otherwise
function check_win() {
  //iterate combo through win_combination board states
  for (let combo of win_combinations) {
    const [a, b, c] = combo;
    //check if all x/o match
    if (board[a] !== "" && board[a] === board[b] && board[b] === board[c]) {
      document.getElementById("result").innerText = `${board[a]} wins!`;
      game_over = true;
      if (xturn) {
        scores[0] = scores[0] + 1;
      } else {
        scores[1] = scores[1] + 1;
      }
      document.getElementById(
        "score"
      ).innerHTML = `Score: X:${scores[0]} O:${scores[1]}`;
      return true;
    }
  }
  if (turn_count >= 9) {
    game_over = true;
    document.getElementById("result").innerText = "Tie!";
    return true;
  }
  return false;
}

//returns position of random free spot in board
function random_choice() {
  let free_spots = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] == "") {
      free_spots.push(i);
    }
  }
  console.log(free_spots);
  choice = free_spots[Math.floor(Math.random() * free_spots.length)];
  return choice;
}

// waits for ms time
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
