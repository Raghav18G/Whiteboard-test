console.log("BROWSER");

var span = document.getElementsByClassName("close")[0];
// When the user clicks on <span> (x), close the modal
span.onclick = () => {
  document.getElementById("iframeModal").style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
  if (event.target == modal) {
    console.log("JOD");
    modal.style.display = "none";
  }
};

(function SearchStart() {
  //Code isolation

  const SearchSVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id="search"><polygon fill="#78909c" points="357.95 351.03 346.98 361.26 314.42 326.35 302.86 313.95 313.83 303.72 325.39 316.12 357.95 351.03"></polygon><path fill="#465e66" d="M325.39 316.12c-1.75 1.77-3.55 3.51-5.38 5.22s-3.7 3.39-5.59 5l-11.56-12.4 11-10.23zM359.71 352.67c-1.75 1.77-3.55 3.51-5.38 5.22s-3.7 3.39-5.59 5l-11.56-12.4 11-10.23z"></path><path fill="#546e7a" d="M370.91,188.21A181.13,181.13,0,0,1,57.53,305.42,181.1,181.1,0,0,1,66.44,49.49c73-68.1,187.82-64.11,255.92,8.91A179.87,179.87,0,0,1,370.91,188.21Z"></path><path fill="#90caf9" d="M337.09,187.1a147.21,147.21,0,0,1-147,142.1q-2.61,0-5.25-.09a149.23,149.23,0,0,1-27.17-3.45,145.62,145.62,0,0,1-47.8-20.08A148.49,148.49,0,0,1,82.31,282.4,147.22,147.22,0,0,1,297.62,81.57a148.87,148.87,0,0,1,15.92,20.34,145.48,145.48,0,0,1,20.11,47.77A148,148,0,0,1,337.09,187.1Z"></path><path fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="15" d="M238.65,103.16A103.19,103.19,0,0,0,98,141.92"></path><path fill="#5e35b1" d="M493.22,502.58a33.33,33.33,0,0,1-22.84,9l-1.19,0A33.27,33.27,0,0,1,445.89,501L322.71,373.65l49-45.73L494.87,455.2A33.58,33.58,0,0,1,493.22,502.58Z"></path><path fill="#4a2a96" d="M497.58,497.62a33.5,33.5,0,0,1-27.2,14l-1.19,0A33.27,33.27,0,0,1,445.89,501L322.71,373.65l7.94-7.41L453.57,493.3a33.27,33.27,0,0,0,23.3,10.59l1.19,0A33.27,33.27,0,0,0,497.58,497.62Z"></path><line x1="371.02" x2="487.01" y1="343" y2="458.99" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"></line><path fill="#546e7a" d="M305.86,73.88A158.49,158.49,0,0,0,74.07,290.09a157.44,157.44,0,0,0,110.38,50.28c1.89.07,3.77.1,5.65.1A158.49,158.49,0,0,0,305.86,73.88ZM337.09,187.1a147.21,147.21,0,0,1-147,142.1q-2.61,0-5.25-.09A147.26,147.26,0,0,1,89.55,74.33,147.21,147.21,0,0,1,337.09,187.1Z"></path><path fill="#465e66" d="M305.86,73.88A158.49,158.49,0,0,0,74.07,290.09a157.44,157.44,0,0,0,110.38,50.28c1.89.07,3.77.1,5.65.1A158.49,158.49,0,0,0,305.86,73.88ZM337.09,187.1a147.21,147.21,0,0,1-147,142.1q-2.61,0-5.25-.09A147.26,147.26,0,0,1,89.55,74.33,147.21,147.21,0,0,1,337.09,187.1Z"></path></svg>';
  var msg = {
    type: "search",
  };

  function search(evt) {
    if (evt) evt.preventDefault();
    document.getElementById("iframeModal").style.display = "block";
    let frame = document.getElementById("browserIframe");
    frame.style.display = "block";
    frame.src = "https://www.google.com/search?igu=1&ei=&q=YOUR+WORD";
    // draw(msg);
    // Tools.send(msg, "Undo");
  }

  function draw(data) {
    // var elem;
    // switch (data.type) {
    //   //TODO: add the ability to erase only some points in a line
    //   case "undo":
    //     break;
    //   default:
    //     console.error("Clear: 'clear' instruction with unknown type. ", data);
    //     break;
    // }
  }

  Tools.add({
    //The new tool
    class: "mySearch",
    name: "Search",
    // "icon": "🗑",
    // "icon": "Undo",
    // "iconHTML":"<i style='color: #39CCCC;margin-top:7px' class='fas fa-undo-alt'></i>",
    iconHTML: SearchSVG,
    shortcuts: {
      actions: [{ key: "shift-s", action: search }],
    },
    listeners: {},
    draw: draw,
    isExtra: false,
    oneTouch: true,
    onstart: search,
    mouseCursor: "crosshair",
  });
})(); //End of code isolation
