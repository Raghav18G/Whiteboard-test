﻿/**
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
    var ZOOM_FACTOR = .6;
    var origin = {
        scrollX: window.scrollX,
        scrollY: window.scrollY,
        x: 0.0,
        y: 0.0,
        clientY: 0,
        scale: 1.0
    };
    var moved = false, pressed = false;

    function zoom(origin, scale) {
        var oldScale = origin.scale;
        var newScale = Tools.setScale(scale);
        window.scrollTo(
            origin.scrollX + origin.x * (newScale - oldScale),
            origin.scrollY + origin.y * (newScale - oldScale)
        );
    }

    var animation = null;
    function animate(scale) {
        cancelAnimationFrame(animation);
        animation = requestAnimationFrame(function () {
            zoom(origin, scale);
        });
    }

    function setOrigin(x, y, evt, isTouchEvent) {
        origin.scrollX = window.scrollX;
        origin.scrollY = window.scrollY;
        origin.x = x;
        origin.y = y;
        origin.clientY = getClientY(evt, isTouchEvent);
        origin.scale = Tools.getScale();
    }

    function press(x, y, evt, isTouchEvent) {
        if($("#menu").width()>Tools.menu_width+3)return;
        evt.preventDefault();
        setOrigin(x, y, evt, isTouchEvent);
        moved = false;
        pressed = true;
    }

    function move(x, y, evt, isTouchEvent) {
        if (pressed) {
            evt.preventDefault();
            var delta = getClientY(evt, isTouchEvent) - origin.clientY;
            var scale = origin.scale * (1 + delta * ZOOM_FACTOR / 100);
            if (Math.abs(delta) > 1) moved = true;
            animation = animate(scale);
        }
    }

    function onwheel(evt) {
        evt.preventDefault();
        if (evt.ctrlKey) {
            var scale = Tools.getScale();
            var x = evt.pageX / scale;
            var y = evt.pageY / scale;
            setOrigin(x, y, evt, false);
            animate((1 - evt.deltaY * ZOOM_FACTOR / 10) * Tools.getScale());
        } else {
            window.scrollTo(window.scrollX + evt.deltaX, window.scrollY + evt.deltaY);
        }
    }
    Tools.board.addEventListener("wheel", onwheel);

    function release(x, y, evt, isTouchEvent) {
        if (pressed && !moved) {
            var delta = (evt.shiftKey === true) ? -.625 : 1;
            var scale = Tools.getScale() * (1 + delta * ZOOM_FACTOR);
            zoom(origin, scale);
        }
        pressed = false;
    }

    function key(down) {
        return function (evt) {
            if (evt.key === "Shift") {
                Tools.svg.style.cursor = "zoom-" + (down ? "out" : "in");
            }
        }
    }

    function getClientY(evt, isTouchEvent) {
        return isTouchEvent ? evt.changedTouches[0].clientY : evt.clientY;
    }

    var keydown = key(true);
    var keyup = key(false);

    function onstart() {
        window.addEventListener("keydown", keydown);
        window.addEventListener("keyup", keyup);
    }
    function onquit() {
        window.removeEventListener("keydown", keydown);
        window.removeEventListener("keyup", keyup);
    }

    Tools.add({ //The new tool
        // "name": "Zoom",
        isExtra:true,
         "icon": "🔎",
	"iconHTML":"<i style='color: #B10DC9;margin-top:7px' class='fas fa-search-plus'></i>",
        "name": "Zoom",
        //"icon": "",
        "listeners": {
            "press": press,
            "move": move,
            "release": release,
        },
        "onstart": onstart,
        "onquit": onquit,
        "mouseCursor": "zoom-in",
        "helpText": "Click to zoom in\nPress shift and click to zoom out",
    });
})(); //End of code isolation
