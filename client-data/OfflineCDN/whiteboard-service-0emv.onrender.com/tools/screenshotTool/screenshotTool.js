var screenshotSVG =
  '<?xml version="1.0" ?><svg id="Layer_1" style="enable-background:new 0 0 30 30;" version="1.1" viewBox="0 0 30 30" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M6,19V17c0-0.552-0.448-1-1-1H5c-0.552,0-1,0.448-1,1V19c0,0.552,0.448,1,1,1H5C5.552,20,6,19.552,6,19z"/><path d="M10,5L10,5c0,0.553,0.448,1,1,1H13c0.552,0,1-0.448,1-1V5c0-0.552-0.448-1-1-1H11C10.448,4,10,4.448,10,5z"/><path d="M5,14L5,14c0.553,0,1-0.448,1-1V11c0-0.552-0.448-1-1-1H5c-0.552,0-1,0.448-1,1V13C4,13.552,4.448,14,5,14z"/><path d="M23,6h1l0,1c0,0.552,0.448,1,1,1h0c0.552,0,1-0.448,1-1V6c0-1.105-0.895-2-2-2h-1c-0.552,0-1,0.448-1,1v0   C22,5.552,22.448,6,23,6z"/><path d="M16,5L16,5c0,0.552,0.448,1,1,1h2c0.552,0,1-0.448,1-1v0c0-0.552-0.448-1-1-1h-2C16.448,4,16,4.448,16,5z"/><path d="M7,24H6v-1c0-0.552-0.448-1-1-1H5c-0.552,0-1,0.448-1,1v1c0,1.105,0.895,2,2,2h1c0.552,0,1-0.448,1-1V25   C8,24.448,7.552,24,7,24z"/><path d="M6,7V6h1c0.552,0,1-0.448,1-1V5c0-0.552-0.448-1-1-1H6C4.895,4,4,4.895,4,6v1c0,0.552,0.448,1,1,1H5C5.552,8,6,7.552,6,7z"/><path d="M24,11l0,2.001c0,0.552,0.448,1,1,1h0c0.552,0,1-0.448,1-1V11c0-0.552-0.448-1-1-1h0C24.448,10,24,10.448,24,11z"/></g><g><path d="M25,16h-1.764c-0.758,0-1.45-0.428-1.789-1.106l-0.171-0.342C21.107,14.214,20.761,14,20.382,14h-4.764   c-0.379,0-0.725,0.214-0.894,0.553l-0.171,0.342C14.214,15.572,13.521,16,12.764,16H11c-0.552,0-1,0.448-1,1v8c0,0.552,0.448,1,1,1   h14c0.552,0,1-0.448,1-1v-8C26,16.448,25.552,16,25,16z M18,25c-2.209,0-4-1.791-4-4c0-2.209,1.791-4,4-4s4,1.791,4,4   C22,23.209,20.209,25,18,25z"/><circle cx="18" cy="21" r="2"/></g></svg>';

(function Screenshot() {
  let imgCount = 1;
  var xlinkNS = "http://www.w3.org/1999/xlink";
  var msg = {
    type: "doc",
    src: "",
    w: 100,
    h: 100,
    x:
      (100 + document.documentElement.scrollLeft) / Tools.scale + 10 * imgCount,
    y: (100 + document.documentElement.scrollTop) / Tools.scale + 10 * imgCount,
  };

  console.log("SCREENSHOT TOOL");

  function onStart() {
    let canvas = document.getElementById("canvas");
    console.log("CANVAS", canvas);
    html2canvas(canvas, {
      x: window.scrollX,
      y: window.scrollY,
      width: window.innerWidth,
      height: window.innerHeight,
    }).then(function (res) {
      console.log("AFTER CONVERTING RES", res);
      var dataURL = res.toDataURL();
      console.log("DATA URL", dataURL);
      var aspect = msg.w / msg.h;
      var img = Tools.createSVGElement("image");
      // img.id = msg.id;
      img.setAttribute("class", "layer-" + Tools.layer);
      img.setAttributeNS(xlinkNS, "href", dataURL);
      console.log("IMAGE TAG", img);
      img.x.baseVal.value = msg["x"];
      img.y.baseVal.value = msg["y"];
      img.setAttribute("width", 400 * aspect);
      img.setAttribute("height", 400);
      if (msg.transform) img.setAttribute("transform", msg.transform);
      Tools.group.appendChild(img);
      const createEl = document.createElement("a");
      createEl.href = dataURL;

      // This is the name of our downloaded file
      createEl.download = "download-this-screenshot";

      createEl.click();
      createEl.remove();
      console.log("aFTER APPENDING");
    });
  }

  Tools.add({
    name: "Screenshot",
    // "icon": "🖼️",
    iconHTML: screenshotSVG,
    shortcuts: {
      changeTool: "s",
    },
    //   draw: draw,
    onstart: onStart,
    oneTouch: true,
  });
})();
