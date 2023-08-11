/**
 *						  WHITEBOPHIR
 *********************************************************
 * @licstart  The following is the entire license notice for the 
 *	JavaScript code in this page.
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

// const { func } = require("calculator");

 (function hand() { //Code isolation
	var selectorStates = {
		pointing: 0,
		selecting: 1,
		transform: 2
	}
	var selected = null;
	var selected_els = [];
	var selectionRect = createSelectorRect();
	var selectionRectTransform;
	var currentTransform = null;
	var transform_elements = [];
	var selectorState = selectorStates.pointing;
	var last_sent = 0;
	var blockedSelectionButtons = [""]
	var selectionButtons = [
		createButton("delete", "delete", 24, 24,
			function (me, bbox, s) {
				me.width.baseVal.value = me.origWidth / s;
				me.height.baseVal.value = me.origHeight / s;
				me.x.baseVal.value = bbox.r[0];
				me.y.baseVal.value = bbox.r[1] - (me.origHeight + 3) / s;
				me.style.display = "";
			},
			deleteSelection),

		createButton("duplicate", "duplicate", 24, 24,
			function (me, bbox, s) {
				me.width.baseVal.value = me.origWidth / s;
				me.height.baseVal.value = me.origHeight / s;
				me.x.baseVal.value = bbox.r[0] + (me.origWidth + 2) / s;
				me.y.baseVal.value = bbox.r[1] - (me.origHeight + 3) / s;
				me.style.display = "";
			},
			duplicateSelection),

		createButton("scaleHandle", "handle", 14, 14,
			function (me, bbox, s) {
				me.width.baseVal.value = me.origWidth / s;
				me.height.baseVal.value = me.origHeight / s;
				me.x.baseVal.value = bbox.r[0] + bbox.a[0] - me.origWidth / (2 * s);
				me.y.baseVal.value = bbox.r[1] + bbox.b[1] - me.origHeight / (2 * s);
				me.style.display = "";
			},
			startScalingTransform)
	];

	for (i in blockedSelectionButtons) {
		delete selectionButtons[blockedSelectionButtons[i]];
	}

	var getScale = Tools.getScale;

	function getParentMathematics(el) {
		var target;
		var a = el;
		var els = [];
		while (a) {
			els.unshift(a);
			a = a.parentElement;
		}
		var parentMathematics = els.find(function (el) {
			return el.getAttribute("class") === "MathElement";
		});
		if ((parentMathematics) && parentMathematics.tagName === "svg") {
			target = parentMathematics;
		}
		return target || el;
	}

	function deleteSelection() {
		var msgs = selected_els.map(function (el) {
			return ({
				"type": "delete",
				"id": el.id
			});
		});
		var data = {
			_children: msgs
		}
		Tools.drawAndSend(data);
		selected_els = [];
		hideSelectionUI();
	}

	function duplicateSelection() {
		if (!(selectorState == selectorStates.pointing)
			|| (selected_els.length == 0)) return;
		var msgs = [];
		var newids = [];
		for (var i = 0; i < selected_els.length; i++) {
			var id = selected_els[i].id;
			msgs[i] = {
				type: "copy",
				id: id,
				newid: Tools.generateUID(id[0])
			};
			newids[i] = id;
		}
		Tools.drawAndSend({ _children: msgs });
		selected_els = newids.map(function (id) {
			return Tools.svg.getElementById(id);
		});
	}

  function pointInTransformedBBox(point, transformedBBox) {
    // transformedBBox is an object representing the bounding box after transformations
    // It may contain properties like 'x', 'y', 'width', 'height', and others.
  
    const { x, y, width, height } = transformedBBox;
    const [px, py] = point;
  
    // Check if the point lies within the transformed bounding box
    return px >= x && px <= x + width && py >= y && py <= y + height;
  }
  

	function createSelectorRect() {
		var shape = Tools.createSVGElement("rect"); 
		shape.id = "selectionRect";
		shape.x.baseVal.value = 0;
		shape.y.baseVal.value = 0;
		shape.width.baseVal.value = 0;
		shape.height.baseVal.value = 0;
		shape.setAttribute("stroke", "black");
		shape.setAttribute("stroke-width", 1);
		shape.setAttribute("vector-effect", "non-scaling-stroke");
		shape.setAttribute("fill", "none");
		shape.setAttribute("stroke-dasharray", "5 5");
		shape.setAttribute("opacity", 1);
		Tools.svg.appendChild(shape);
		return shape;
	}

	function createButton(name, icon, width, height, drawCallback, clickCallback) {
		var shape = Tools.createSVGElement("image", {
			href: "tools/hand/" + icon + ".svg",
			width: width, height: height
		});
		shape.style.display = "none";
		shape.origWidth = width;
		shape.origHeight = height;
		shape.drawCallback = drawCallback;
		shape.clickCallback = clickCallback;
		Tools.svg.appendChild(shape);
		return shape;
	}

	function showSelectionButtons() {
		var scale = getScale();
		var selectionBBox = selectionRect.transformedBBox();
		for (var i = 0; i < selectionButtons.length; i++) {
			selectionButtons[i].drawCallback(selectionButtons[i],
				selectionBBox,
				scale);
		}
	}

	function hideSelectionButtons() {
		for (var i = 0; i < selectionButtons.length; i++) {
			selectionButtons[i].style.display = "none";
		}
	}

	function hideSelectionUI() {
		hideSelectionButtons();
		selectionRect.style.display = "none";
	}

	function startMovingElements(x, y, evt) {
		evt.preventDefault();
		selectorState = selectorStates.transform;
		currentTransform = moveSelection;
		selected = { x: x, y: y };
		// Some of the selected elements could have been deleted
		selected_els = selected_els.filter(function (el) {
			return Tools.svg.getElementById(el.id) !== null;
		});
		transform_elements = selected_els.map(function (el) {
			var tmatrix = get_transform_matrix(el);
			return {
				a: tmatrix.a, b: tmatrix.b, c: tmatrix.c,
				d: tmatrix.d, e: tmatrix.e, f: tmatrix.f
			};
		});
		var tmatrix = get_transform_matrix(selectionRect);
		selectionRectTransform = { x: tmatrix.e, y: tmatrix.f };
	}

	function startScalingTransform(x, y, evt) {
		evt.preventDefault();
		hideSelectionButtons();
		selectorState = selectorStates.transform;
		var bbox = selectionRect.transformedBBox();
		selected = {
			x: bbox.r[0],
			y: bbox.r[1],
			w: bbox.a[0],
			h: bbox.b[1],
		};
		transform_elements = selected_els.map(function (el) {
			var tmatrix = get_transform_matrix(el);
			return {
				a: tmatrix.a, b: tmatrix.b, c: tmatrix.c,
				d: tmatrix.d, e: tmatrix.e, f: tmatrix.f
			};
		});
		var tmatrix = get_transform_matrix(selectionRect);
		selectionRectTransform = {
			a: tmatrix.a, d: tmatrix.d,
			e: tmatrix.e, f: tmatrix.f
		};
		currentTransform = scaleSelection;
	}

	function startSelector(x, y, evt) {
		evt.preventDefault();
		selected = { x: x, y: y };
		selected_els = [];
		selectorState = selectorStates.selecting;
		selectionRect.x.baseVal.value = x;
		selectionRect.y.baseVal.value = y;
		selectionRect.width.baseVal.value = 0;
		selectionRect.height.baseVal.value = 0;
		selectionRect.style.display = "";
		tmatrix = get_transform_matrix(selectionRect);
		tmatrix.e = 0;
		tmatrix.f = 0;
	}


	function calculateSelection() {
		var selectionTBBox = selectionRect.transformedBBox();
		var elements = Tools.drawingArea.children;
		var selected = [];
		for (var i = 0; i < elements.length; i++) {
			if (transformedBBoxIntersects(selectionTBBox, elements[i].transformedBBox()))
				selected.push(Tools.drawingArea.children[i]);
		}
		return selected;
	}

	function moveSelection(x, y) {
		var dx = x - selected.x;
		var dy = y - selected.y;
		var msgs = selected_els.map(function (el, i) {
			var oldTransform = transform_elements[i];
			return {
				type: "update",
				id: el.id,
				transform: {
					a: oldTransform.a,
					b: oldTransform.b,
					c: oldTransform.c,
					d: oldTransform.d,
					e: dx + oldTransform.e,
					f: dy + oldTransform.f
				}
			};
		})
		var msg = {
			_children: msgs
		};
		var tmatrix = get_transform_matrix(selectionRect);
		tmatrix.e = dx + selectionRectTransform.x;
		tmatrix.f = dy + selectionRectTransform.y;
		var now = performance.now();
		if (now - last_sent > 70) {
			last_sent = now;
			Tools.drawAndSend(msg);
		} else {
			draw(msg);
		}
	}

	function scaleSelection(x, y) {
		var rx = (x - selected.x) / (selected.w);
		var ry = (y - selected.y) / (selected.h);
		var msgs = selected_els.map(function (el, i) {
			var oldTransform = transform_elements[i];
			var x = el.transformedBBox().r[0];
			var y = el.transformedBBox().r[1];
			var a = oldTransform.a * rx;
			var d = oldTransform.d * ry;
			var e = selected.x * (1 - rx) - x * a +
				(x * oldTransform.a + oldTransform.e) * rx
			var f = selected.y * (1 - ry) - y * d +
				(y * oldTransform.d + oldTransform.f) * ry
			return {
				type: "update",
				id: el.id,
				transform: {
					a: a,
					b: oldTransform.b,
					c: oldTransform.c,
					d: d,
					e: e,
					f: f
				}
			};
		})
		var msg = {
			_children: msgs
		};

		var tmatrix = get_transform_matrix(selectionRect);
		tmatrix.a = rx;
		tmatrix.d = ry;
		tmatrix.e = selectionRectTransform.e +
			selectionRect.x.baseVal.value * (selectionRectTransform.a - rx)
		tmatrix.f = selectionRectTransform.f +
			selectionRect.y.baseVal.value * (selectionRectTransform.d - ry)
		var now = performance.now();
		if (now - last_sent > 70) {
			last_sent = now;
			Tools.drawAndSend(msg);
		} else {
			draw(msg);
		}
	}

	function updateRect(x, y, rect) {
		rect.x.baseVal.value = Math.min(x, selected.x);
		rect.y.baseVal.value = Math.min(y, selected.y);
		rect.width.baseVal.value = Math.abs(x - selected.x);
		rect.height.baseVal.value = Math.abs(y - selected.y);
	}

	function resetSelectionRect() {
		var bbox = selectionRect.transformedBBox();
		var tmatrix = get_transform_matrix(selectionRect);
		selectionRect.x.baseVal.value = bbox.r[0];
		selectionRect.y.baseVal.value = bbox.r[1];
		selectionRect.width.baseVal.value = bbox.a[0];
		selectionRect.height.baseVal.value = bbox.b[1];
		tmatrix.a = 1; tmatrix.b = 0; tmatrix.c = 0;
		tmatrix.d = 1; tmatrix.e = 0; tmatrix.f = 0;
	}

	function get_transform_matrix(elem) {
		// Returns the first translate or transform matrix or makes one
		var transform = null;
		for (var i = 0; i < elem.transform.baseVal.numberOfItems; ++i) {
			var baseVal = elem.transform.baseVal[i];
			// quick tests showed that even if one changes only the fields e and f or uses createSVGTransformFromMatrix
			// the brower may add a SVG_TRANSFORM_MATRIX instead of a SVG_TRANSFORM_TRANSLATE
			if (baseVal.type === SVGTransform.SVG_TRANSFORM_MATRIX) {
				transform = baseVal;
				break;
			}
		}
		if (transform == null) {
			transform = elem.transform.baseVal.createSVGTransformFromMatrix(Tools.svg.createSVGMatrix());
			elem.transform.baseVal.appendItem(transform);
		}
		return transform.matrix;
	}

	function draw(data) {
		if (data._children) {
			batchCall(draw, data._children);
		}
		else {
			switch (data.type) {
				case "update":
					var elem = Tools.svg.getElementById(data.id);
					if (!elem) throw new Error("Mover: Tried to move an element that does not exist.");
					var tmatrix = get_transform_matrix(elem);
					for (i in data.transform) {
						tmatrix[i] = data.transform[i]
					}
					break;
				case "copy":
					var newElement = Tools.svg.getElementById(data.id).cloneNode(true);
					newElement.id = data.newid;
					Tools.drawingArea.appendChild(newElement);
					break;
				case "delete":
					data.tool = "Eraser";
					messageForTool(data);
					break;
				default:
					throw new Error("Mover: 'move' instruction with unknown type. ", data);
			}
		}
	}

	function clickSelector(x, y, evt) {
		selectionRect = selectionRect || createSelectorRect();
		for (var i = 0; i < selectionButtons.length; i++) {
			if (selectionButtons[i].contains(evt.target)) {
				var button = selectionButtons[i];
			}
		}
		if (button) {
			button.clickCallback(x, y, evt);
		} else if (pointInTransformedBBox([x, y], selectionRect.transformedBBox())) {
			hideSelectionButtons();
			startMovingElements(x, y, evt);
		} else if (Tools.drawingArea.contains(evt.target)) {
			hideSelectionUI();
			selected_els = [getParentMathematics(evt.target)];
			startMovingElements(x, y, evt);
		} else {
			hideSelectionButtons();
			startSelector(x, y, evt);
		}
	}

	function releaseSelector(x, y, evt) {
		if (selectorState == selectorStates.selecting) {
			selected_els = calculateSelection();
			if (selected_els.length == 0) {
				hideSelectionUI();
			}
		} else if (selectorState == selectorStates.transform)
			resetSelectionRect();
		if (selected_els.length != 0) showSelectionButtons();
		transform_elements = [];
		selectorState = selectorStates.pointing;
	}

	function moveSelector(x, y, evt) {
		if (selectorState == selectorStates.selecting) {
			updateRect(x, y, selectionRect);
		} else if (selectorState == selectorStates.transform && currentTransform) {
			currentTransform(x, y);
		}
	}

	function startHand(x, y, evt, isTouchEvent) {
		evt.preventDefault()
        evt.stopPropagation();
		if (!isTouchEvent) {
			selected = {
				x: document.documentElement.scrollLeft + evt.clientX,
				y: document.documentElement.scrollTop + evt.clientY,
			}
			console.log('harsh moce called')
		
		}
		else{
			selected = {
				x: document.documentElement.scrollLeft + evt.touches[0].clientX,
				y: document.documentElement.scrollTop + evt.touches[0].clientY,
			}
		}
	}
	
	function moveHand(x, y, evt, isTouchEvent) {
		evt.preventDefault()
        evt.stopPropagation();
		if (selected && !isTouchEvent) { //Let the browser handle touch to scroll
			console.log(selected.x ,evt, selected.y , evt.clientY,selected)
			window.scrollTo(selected.x - evt.clientX, selected.y - evt.clientY);
		}
		else{
			if(selected){
				const touch = evt.touches[0]
			window.scrollTo(selected.x - touch.clientX, selected.y - touch.clientY);
			}
		}
	}

	
	function press(x, y, evt, isTouchEvent) {
		console.log("press",isTouchEvent)
		evt.preventDefault()
        evt.stopPropagation();
		if (!handTool.secondary.active) startHand(x, y, evt, isTouchEvent);
		else clickSelector(x, y, evt, isTouchEvent);
	}


	function move(x, y, evt, isTouchEvent) {
		console.log('move')
        evt.stopPropagation();
		evt.preventDefault()
		if (!handTool.secondary.active) moveHand(x, y, evt, isTouchEvent);
		else moveSelector(x, y, evt, isTouchEvent);
	}

	function release(x, y, evt, isTouchEvent) {
		console.log('release')
		evt.preventDefault()
        evt.stopPropagation();
		move(x, y, evt, isTouchEvent);
		if (handTool.secondary.active) releaseSelector(x, y, evt, isTouchEvent);
		selected = null;

	}

	function deleteShortcut(e) {
		if (e.key == "Delete" &&
			!e.target.matches("input[type=text], textarea"))
			deleteSelection();
	}

	function duplicateShortcut(e) {
		if (e.key == "d" &&
			!e.target.matches("input[type=text], textarea"))
			duplicateSelection();
	}

	function switchTool() {
		onquit();
		if (handTool.secondary.active) {
			window.addEventListener("keydown", deleteShortcut);
			window.addEventListener("keydown", duplicateShortcut);
		}
	}

	function onquit() {
		selected = null;
		hideSelectionUI();
		window.removeEventListener("keydown", deleteShortcut);
		window.removeEventListener("keydown", duplicateShortcut);
	}
  var gridSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path d="M0,0V17H17V0ZM12,1V4H9V1ZM8,9v3H5V9ZM5,8V5H8V8ZM9,9h3v3H9ZM9,8V5h3V8ZM8,1V4H5V1ZM1,1H4V4H1ZM1,5H4V8H1ZM1,9H4v3H1Zm0,7V13H4v3Zm4,0V13H8v3Zm4,0V13h3v3Zm7,0H13V13h3Zm0-4H13V9h3Zm0-4H13V5h3Zm0-4H13V1h3Z"/></g></g></svg>';
  var handSvg = `<svg class="tool-icon-svg" width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M0.445312 26.82H26.4453V0.819998H0.445312V26.82Z" fill="url(#pattern0)"/><defs><pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1"><use xlink:href="#image0_8294_29572" transform="scale(0.00625)"/></pattern><image id="image0_8294_29572" width="160" height="160" xlink:href="data:image/png;base64,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"/></defs></svg><label id="tool-hand-localization" class="label-tool" style="font-size:10px;line-height: 2px;font-weight:400; margin-top: 14px;"><p>Hand</p></label>`;
   var handTool = {
    //The new tool
    name: "Hand",
    // shortcut: "h",
    listeners: {
      press: press,
      move: move,
      release: release,
    },
    onquit: onquit,
    secondary: {
      name: "Selector",
      icon: gridSVG,
      active: false,
      switch: switchTool,
    },
    draw: draw,
    iconHTML: handSvg,
    mouseCursor: "pointer",
    showMarker: true,
  };

  Tools.add(handTool);
//   Tools.change("Hand"); // Use the hand tool by default 
})(); //End of code isolation
