/**
 *                        WHITEBOPHIR
 *********************************************************
 * @licstart  The following is the entire license notice for the
 *  JavaScript code in this page.
 *
 * Copyright (C) 2013  Ophir LOJKINE
 *
 *
 * The JavaScript code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * @licend
 */

(function () { //Code isolation

	var dragHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><polygon points="16 15.29 10.35 9.65 9.65 10.35 15.29 16 11 16 11 17 17 17 17 11 16 11 16 15.29"/><polygon points="11 0 11 1 15.29 1 9.65 6.65 10.35 7.35 16 1.71 16 6 17 6 17 0 11 0"/><polygon points="6.65 9.65 1 15.29 1 11 0 11 0 17 6 17 6 16 1.71 16 7.35 10.35 6.65 9.65"/><polygon points="6 1 6 0 0 0 0 6 1 6 1 1.71 6.65 7.35 7.35 6.65 1.71 1 6 1"/></g></g></svg>';
	var orig = { x: 0, y: 0 };
	var pressed = false;
	function press(x, y, evt, isTouchEvent) {
		if (!isTouchEvent) {
			pressed = true;
			orig.x = scrollX + evt.clientX;
			orig.y = scrollY + evt.clientY;
		}
	}
	function move(x, y, evt, isTouchEvent) {
		if (pressed && !isTouchEvent) { //Let the browser handle touch to scroll
			window.scrollTo(orig.x - evt.clientX, orig.y - evt.clientY);
		}
	}
	function release() {
		pressed = false;
	}

	Tools.add({ //The new tool
		// "name": "Hand",
	// "icon": "✋",
	"iconHTML": dragHTML,
        "name": "Hand",
		//"icon": "",
		"shortcuts": {
            "changeTool":"8"
        },
		"listeners": {
			"press": press,
			"move": move,
			"release": release
		},
		"mouseCursor": "move"
	});

	//The hand tool is selected by default
	Tools.change("Hand");
})(); //End of code isolation
