console.log("JODD");

var Tools = {};

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
      console.log("JODDDDDDDDDDDDD BOARD NAME", data);
    });
  });

Tools.connect();