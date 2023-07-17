(function mathematicalTools() {
  //Code isolation

  // This isn't an HTML5 canvas, it's an old svg hack, (the code is _that_ old!)
  var uploadSVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-projector" viewBox="0 0 16 16"><path d="M14 7.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM2.5 6a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4Zm0 2a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1h-4Z"/><path d="M0 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2 1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1H5a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1 2 2 0 0 1-2-2V6Zm2-1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H2Z"/></svg>';
  // var xlinkNS = "http://www.w3.org/1999/xlink";

  let selectedIcon = "scale.png";
  var toggle = 0;

  const bgImage = [
    "scale.png",
    "scale2.png",
    "scale3.png",
    "scale4.png",
    "scale10.png",
    "scale5.png",
    "scale6.png",
    "scale7.png",
    "scale8.png",
    "scale9.png"
  ];

  let modalContent = document.getElementById("tab1--mathematiclTool");

  let data = {
    type: "icon",
    toggle: 0,
  };

  // function setBg(bg) {
  //   selectedIcon = `./assets/${bg}`;
  //   data.type = "background";
  //   draw(data);
  // }

  bgImage.map((bg) => {
    var bgPattern = document.createElement("img");
    bgPattern.setAttribute("src", `./assets/${bg}`);
    bgPattern.className = "toolContainer";
    // bgPattern.onclick = function () {
    //   setBg(bg);
    // };
    modalContent?.appendChild(bgPattern);
  });

  function onstart(evt) {
    console.log(" tool clicked");
    mathematicalToolsModal.style.display = "block";
    if (evt) evt.preventDefault();
    if (toggle) {
      toggle = 0;
      mathematicalToolsModal.style.display = "none";
    } else {
      toggle = 1;
    }
    data.toggle = toggle;
    draw(data);
  }

  function draw() {
    var getImage = document.getElementById("setImagePattern");
    getImage.setAttribute("href", selectedIcon);
    var pattern = Tools.svg.getElementById("rect_1");
    pattern.setAttribute("fill", "url(#imagePattern)");
  }

  Tools.add({
    name: "Mathematical Tools",
    // "icon": "🖼️",
    iconHTML: uploadSVG,
    shortcuts: {
      actions: [{ key: "12", action: onstart }],
    },
    listeners: {},
    draw: draw,
    onstart: onstart,
    oneTouch: true,
    mouseCursor: "crosshair",
  });
})(); //End of code isolation

//Close the modal of Color Picker
var closeModalBtn = document.getElementById("closeToolModalBtn");

closeModalBtn.addEventListener("click", function () {
  mathematicalToolsModal.style.display = "none";
});
