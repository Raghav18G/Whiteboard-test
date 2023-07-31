const canvas = document.getElementById("canvas");
let contextMenuVisible = false;
let contextMenu;

canvas.addEventListener("touchstart", handleTouchStart);
canvas.addEventListener("touchend", handleTouchEnd);

function handleTouchStart(event) {
  event.preventDefault();
  event = event || window.event;
  // Prevent the default touch events

  // Remove any previous context menu
  removeContextMenu();

  contextMenuVisible = true;

  // Calculate the position of the context menu based on the touch event
  console.log("Event", event);
  const touchX = event.touches[0].clientX;
  const touchY = event.touches[0].clientY;
  console.log("TOUCH x", touchX, "Context MENU is VISIBLE");
  // Show the context menu with "Paste" option
  contextMenu = createContextMenu(touchX, touchY);
  document.body.appendChild(contextMenu);
}

function handleTouchEnd(event) {
  event = event || window.event;
  event.preventDefault(); // Prevent the default touch events

  // Check if the touchend occurred on the "Paste" option
  if (contextMenuVisible && event.target.classList.contains("paste-option")) {
    console.log("CALLLEDD PASTE");
    handlePaste();
  }

  // Remove the context menu
  // removeContextMenu();
}

function createContextMenu(x, y) {
  const contextMenu = document.createElement("div");
  contextMenu.className = "context-menu";
  contextMenu.style.position = "absolute";
  contextMenu.style.left = x + "px";
  contextMenu.style.top = y + "px";

  // Add context menu options (e.g., "Paste")
  const pasteOption = document.createElement("div");
  pasteOption.className = "context-menu-option paste-option";
  pasteOption.textContent = "Paste";
  pasteOption.addEventListener("click", handlePaste);
  contextMenu.appendChild(pasteOption);

  // Add any other context menu options you want

  return contextMenu;
}

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
  nnnnnnnnnn;
}

async function handlePaste() {
  try {
    const permission = await navigator.permissions.query({
      name: "clipboard-read",
    });
    console.log("PERMISSION", permission);
    if (permission.state === "denied") {
      throw new Error("Not allowed to read clipboard.");
    }
    const clipboardContents = await navigator.clipboard.read();
    console.log("Clipboard Contents", clipboardContents);
    for (const item of clipboardContents) {
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
  } finally {
    console.log("PASTE PASTE");
    removeContextMenu();
  }
}

function removeContextMenu() {
  if (contextMenu) {
    document.body.removeChild(contextMenu);
  }
  contextMenuVisible = false;
}
