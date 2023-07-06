console.log("IN PASTE FILE");

document.getElementById("board").addEventListener("paste", function (e) {
  console.log("IN PASTE FILE --> Paste Event Triggered", e);
});
const destinationImage = document.querySelector("#destination");

var imgCount = 1;
var xlinkNS = "http://www.w3.org/1999/xlink";

var curText = {
  x: 400,
  y: 400,
  size: 36,
  rawSize: 16,
  oldSize: 0,
  opacity: 1,
  color: "#000",
  id: 0,
  sentText: "",
  lastSending: 0,
};
function drawImage(msg) {
  var aspect = msg.w / msg.h;
  var img = Tools.createSVGElement("image");
  img.id = msg.id;
  img.setAttribute("class", "layer-" + Tools.layer);
  img.setAttributeNS(xlinkNS, "href", msg.src);
  img.x.baseVal.value = msg["x"];
  img.y.baseVal.value = msg["y"];
  img.setAttribute("width", 400 * aspect);
  img.setAttribute("height", 400);
  if (msg.transform) img.setAttribute("transform", msg.transform);
  Tools.group.appendChild(img);
}

function drawText(text) {
  var elem = Tools.createSVGElement("text");
  elem.setAttribute("x", curText.x);
  elem.setAttribute("y", curText.y);
  if (Tools.useLayers) elem.setAttribute("class", "layer-" + Tools.layer);
  elem.setAttribute("font-size", curText.size);
  elem.setAttribute("fill", curText.color);
  elem.setAttribute(
    "opacity",
    Math.max(0.1, Math.min(1, curText.opacity)) || 1
  );
  elem.textContent = text;

  Tools.group.appendChild(elem);
}
//Function For drawing Image
async function pasteImage() {
  try {
    const permission = await navigator.permissions.query({
      name: "clipboard-read",
    });
    if (permission.state === "denied") {
      throw new Error("Not allowed to read clipboard.");
    }
    const clipboardContents = await navigator.clipboard.read();
    console.log("Clipboard Contents", clipboardContents);
    for (const item of clipboardContents) {
      if (item.types.includes("text/plain")) {
        document.getElementById("toolID-Text").click();
        const text = await navigator.clipboard.readText();

        drawText(text);
      }
      if (!item.types.includes("image/png")) {
        throw new Error("Clipboard contains non-image data.");
      }
      const blob = await item.getType("image/png");
      console.log("BLOB", blob);
      console.log("IAMGE BLOB", URL.createObjectURL(blob));
      var image = new Image();
      image.src = URL.createObjectURL(blob);
      image.onload = function () {
        var uid = Tools.generateUID("doc");
        var msg = {
          id: uid,
          type: "doc",
          src: image.src,
          w: this.width || 300,
          h: this.height || 300,
          x:
            (100 + document.documentElement.scrollLeft) / Tools.scale +
            10 * imgCount,
          y:
            (100 + document.documentElement.scrollTop) / Tools.scale +
            10 * imgCount,
        };
        drawImage(msg);
      };
    }
  } catch (error) {
    console.error(error.message);
  }
}

window.addEventListener("paste", pasteImage);
