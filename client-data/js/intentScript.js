function launchScannerApp() {
  console.log("U3RhcnRSZWNvcmRpbmc=");
}

function updateColor(selectedColor) {
  // Get the div element for displaying the color
  const colorDisplay = document.getElementById("colorStatus");
  console.log("Color Display", colorDisplay);

  // Set the background color of the div to the selected color
  colorDisplay.style.backgroundColor = selectedColor;
  colorDisplay.style.border = "1px solid black";
}
