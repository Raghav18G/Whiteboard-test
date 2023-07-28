//Registering Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("../service-worker.js")
      .then((registration) => {
        console.log("Service worker registered!", registration);
      })
      .catch((error) => {
        console.error("Service worker registration failed:", error);
      });
  });
}

//initially disable button
var select = document.getElementById("newBoard--Select");
var btn = document.getElementById("go-btn");
if (!select.options[select.selectedIndex].value) {
  btn.disabled = true;
}
var Tools = {};

function SetData() {
  var select = document.getElementById("newBoard--Select");
  var myform = document.getElementById("existingBoardForm");
  var board_name = select.options[select.selectedIndex].value;
  myform.action = "board.html?board=" + board_name;
  myform.submit();
}
//after Selecting a board name unable the GO button
function checkDisable() {
  var select = document.getElementById("newBoard--Select");
  const btnCheck = document.getElementById("go-btn");
  if (select.options[select.selectedIndex].value) {
    btnCheck.classList.add("goSubmit");
    btnCheck.disabled = false;
  }
}

(Tools.socket = null),
  (Tools.connect = function () {
    var self = this;
    if (self.socket) {
      self.socket.destroy();
      delete self.socket;
      self.socket = null;
    }

    this.socket = io.connect("", {
      reconnection: true,
      reconnectionDelay: 100, //Make the xhr connections as fast as possible
      timeout: 1000 * 60 * 20, // Timeout after 20 minutes
    });

    this.socket.on("connect", function () {
      console.log("Connected to the Server on the Landing Page");
    });

    this.socket.on("disconnect", function () {
      //console.log( 'disconnected from server' );
      window.setTimeout("Tools.connect()", 20);
    });

    this.socket.on("reconnect", function onReconnection() {
      console.log("Reconnecting to the Server");
    });

    this.socket.on("boardName", function (data) {
      var dropdown = document.getElementsByClassName("newBoard--Select");
      data.boardNames.map((name) => {
        dropdown[0].innerHTML =
          dropdown[0].innerHTML + `<option  value=${name}>${name}</option>`;
      });

      console.log("DROPDOWN", dropdown[0].innerHTML);
    });
  });

Tools.connect();
