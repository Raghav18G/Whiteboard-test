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

(function () {
  //Code isolation
  //Indicates the id of the shape the user is currently drawing or an empty string while the user is not drawing
  var ellipse =
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"  viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;"><g><path id="submenu-rect-path" fill="';
  var shapeSVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path d="M11.91,7A6.64,6.64,0,0,0,12,6a6,6,0,1,0-6,6,6.64,6.64,0,0,0,1-.09V17H17V7ZM6,11a5,5,0,1,1,5-5,5.47,5.47,0,0,1-.1,1H7v3.9A5.47,5.47,0,0,1,6,11Zm4.58-3A5.07,5.07,0,0,1,8,10.58V8ZM16,16H8V11.65A6,6,0,0,0,11.65,8H16Z"/></g></g></svg>';
  var ellipse2 =
    '" d="M435.204,126.967C387.398,94.1,324.11,76,257,76c-67.206,0-130.824,18.084-179.138,50.922C27.652,161.048,0,206.889,0,256c0,49.111,27.652,94.952,77.862,129.078C126.176,417.916,189.794,436,257,436c67.11,0,130.398-18.1,178.204-50.967C484.727,350.986,512,305.161,512,256S484.727,161.014,435.204,126.967z M418.208,360.312C375.354,389.774,318.103,406,257,406 c-61.254,0-118.884-16.242-162.273-45.733C52.986,331.898,30,294.868,30,256s22.986-75.898,64.727-104.267C138.116,122.242,195.746,106,257,106c61.103,0,118.354,16.226,161.208,45.688C459.345,179.97,482,217.015,482,256S459.345,332.03,418.208,360.312z"/></g></svg>';

  var icons = {
    Rectangle: {
      icon: "▭",
      isHTML: false,
      isSVG: false,
    },
    Circle: {
      icon: "◯",
      isHTML: false,
      isSVG: false,
    },
    Triangle: {
      icon: "◺",
      isHTML: false,
      isSVG: false,
    },
    EquiTriangle: {
      icon: "△",
      isHTML: false,
      isSVG: false,
    },
    Parallelogram: {
      icon: "▱",
      isHTML: false,
      isSVG: false,
    },
    Rombus: {
      icon: "◇",
      isHTML: false,
      isSVG: false,
    },
    Trapezoid: {
      icon: "⏢",
      isHTML: false,
      isSVG: false,
    },
    Pentagon: {
      icon: "⬠",
      isHTML: false,
      isSVG: false,
    },
    Hexagon: {
      icon: "⬡",
      isHTML: false,
      isSVG: false,
    },
    // Cube: {
    //   icon: "=",
    //   isHTML: false,
    //   isSVG: false,
    // },
    // Cone: {
    //   icon: "*",
    //   isHTML: false,
    //   isSVG: false,
    // },
    // Cylinder: {
    //   icon: "&",
    //   isHTML: false,
    //   isSVG: false,
    // },
    // Sphere: {
    //   icon: "@",
    //   isHTML: false,
    //   isSVG: false,
    // },
    Ellipse: {
      icon:
        `<span><img style = 'margin-top:-7px;' draggable="false" src='data:image/svg+xml;utf8,` +
        ellipse +
        `black` +
        ellipse2 +
        `' ></span>`,
      menuIcon:
        `<span><img style = 'margin-top:-7px;' draggable="false" src='data:image/svg+xml;utf8,` +
        ellipse +
        `gray` +
        ellipse2 +
        `' ></span>`,
      menuIconActive:
        `<span><img style = 'margin-top:-7px;' draggable="false" src='data:image/svg+xml;utf8,` +
        ellipse +
        `green` +
        ellipse2 +
        `' ></span>`,
      isHTML: true,
      isSVG: true,
    },
  };

  var curshape = "Rectangle",
    end = false,
    curId = "",
    lastX = 0,
    lastY = 0,
    dashed = false,
    lastTime = performance.now(); //The time at which the last point was drawn

  function start(x, y, evt) {
    //Prevent the press from being interpreted by the browser
    evt.preventDefault();
    Tools.suppressPointerMsg = true;
    curId = Tools.generateUID("r"); //"r" for rectangle
    Tools.drawAndSend({
      type: "rect",
      id: curId,
      shape: curshape,
      color: Tools.getColor(),
      size: Tools.getSize(),
      opacity: Tools.getOpacity(),
      dashed: dashed ? true : false,
      x: x,
      y: y,
      x2: x,
      y2: y,
    });

    lastX = x;
    lastY = y;
  }

  function move(x, y, evt) {
    /*Wait 20ms before adding any point to the currently drawing shape.
		This allows the animation to be smother*/
    if (curId !== "") {
      var curUpdate = {
        //The data of the message that will be sent for every new point
        type: "update",
        id: curId,
        shape: curshape,
        x: lastX,
        y: lastY,
      };
      curUpdate["x2"] = x;
      curUpdate["y2"] = y;
      if (performance.now() - lastTime > 70 || end) {
        Tools.drawAndSend(curUpdate);
        lastTime = performance.now();

        if (wb_comp.list["Measurement"]) {
          wb_comp.list["Measurement"].update({
            type: curshape,
            x: lastX,
            y: lastY,
            x2: x,
            y2: y,
          });
        }
      }
    }
    if (evt) evt.preventDefault();
  }

  function stop(x, y, evt) {
    evt.preventDefault();
    //Add a last point to the shape
    end = true;
    move(x, y);
    end = false;
    Tools.suppressPointerMsg = false;
    curId = "";
  }

  function draw(data) {
    Tools.drawingEvent = true;
    switch (data.type) {
      case "rect":
        createShape(data);
        break;
      case "update":
        var shape = svg.getElementById(data["id"]);
        if (!shape) {
          console.error(
            "Shape: Hmmm... I received a point of a shape that has not been created (%s).",
            data["id"]
          );
          return false;
        } else {
          if (Tools.useLayers) {
            if (shape.getAttribute("class") != "layer" + Tools.layer) {
              shape.setAttribute("class", "layer-" + Tools.layer);
              Tools.group.appendChild(shape);
            }
          }
        }

        if (data.shape == "Circle") {
          updateCircle(shape, data);
        } else if (data.shape == "Triangle") {
          updateTriangle(shape, data);
        } else if (data.shape == "EquiTriangle") {
          updateEquiTriangle(shape, data);
        } else if (data.shape == "Parallelogram") {
          updateParallelogram(shape, data);
        } else if (data.shape == "Rombus") {
          updateRombus(shape, data);
        } else if (data.shape == "Trapezoid") {
          updateTrapezoid(shape, data);
        } else if (data.shape == "Pentagon") {
          updatePentagon(shape, data);
        } else if (data.shape == "Hexagon") {
          updateHexagon(shape, data);
        } else if (data.shape == "Cube") {
          updateCube(shape, data);
        } else if (data.shape == "Cone") {
          updateCone(shape, data);
        } else if (data.shape == "Cylinder") {
          updateCylinder(shape, data);
        } else if (data.shape == "Sphere") {
          updateSphere(shape, data);
        } else if (data.shape == "Ellipse") {
          updateEllipse(shape, data);
        } else {
          updateRect(shape, data);
        }
        break;
      default:
        console.error(
          "Straight shape: Draw instruction with unknown type. ",
          data
        );
        break;
    }
  }

  var svg = Tools.svg;
  function createShape(data) {
    //Creates a new shape on the canvas, or update a shape that already exists with new information
    var shape = svg.getElementById(data.id);
    console.log("In SHAPE", data);
    if (data.shape == "Circle") {
      if (!shape) shape = Tools.createSVGElement("circle");
      updateCircle(shape, data);
    } else if (data.shape == "Triangle") {
      if (!shape) shape = Tools.createSVGElement("polygon");
      updateTriangle(shape, data);
    } else if (data.shape == "EquiTriangle") {
      if (!shape) shape = Tools.createSVGElement("polygon");
      updateEquiTriangle(shape, data);
    } else if (data.shape == "Parallelogram") {
      if (!shape) shape = Tools.createSVGElement("polygon");
      updateParallelogram(shape, data);
    } else if (data.shape == "Rombus") {
      if (!shape) shape = Tools.createSVGElement("polygon");
      updateRombus(shape, data);
    } else if (data.shape == "Trapezoid") {
      if (!shape) shape = Tools.createSVGElement("polygon");
      updateTrapezoid(shape, data);
    } else if (data.shape == "Pentagon") {
      if (!shape) shape = Tools.createSVGElement("polygon");
      updatePentagon(shape, data);
    } else if (data.shape == "Hexagon") {
      if (!shape) shape = Tools.createSVGElement("polygon");
      updateHexagon(shape, data);
    } else if (data.shape == "Cube") {
      if (!shape) shape = Tools.createSVGElement("polygon");
      updateCube(shape, data);
    } else if (data.shape == "Cone") {
      if (!shape) shape = Tools.createSVGElement("polygon");
      updateCone(shape, data);
    } else if (data.shape == "Cylinder") {
      if (!shape) shape = Tools.createSVGElement("polygon");
      updateCylinder(shape, data);
    } else if (data.shape == "Sphere") {
      if (!shape) shape = Tools.createSVGElement("polygon");
      updateSphere(shape, data);
    } else if (data.shape == "Ellipse") {
      if (!shape) shape = Tools.createSVGElement("ellipse");
      updateEllipse(shape, data);
    } else {
      if (!shape) shape = Tools.createSVGElement("rect");
      updateRect(shape, data);
    }
    shape.id = data.id;
    //If some data is not provided, choose default value. The shape may be updated later
    if (Tools.useLayers) shape.setAttribute("class", "layer-" + Tools.layer);
    shape.setAttribute("stroke", data.color || "black");
    shape.setAttribute("stroke-width", data.size || 10);
    if (data.dashed == true) {
      shape.setAttribute("stroke-dasharray", "10 10" || "10 10");
    }
    shape.setAttribute(
      "opacity",
      Math.max(0.1, Math.min(1, data.opacity)) || 1
    );
    Tools.group.appendChild(shape);
    return shape;
  }

  function updateRect(shape, data) {
    console.log(shape, "shape");
    shape.x.baseVal.value = Math.min(data["x2"], data["x"]);
    shape.y.baseVal.value = Math.min(data["y2"], data["y"]);
    shape.width.baseVal.value = Math.max(1, Math.abs(data["x2"] - data["x"]));
    shape.height.baseVal.value = Math.max(1, Math.abs(data["y2"] - data["y"]));
    shape.setAttribute("fill", "none");
    if (data.data) {
      shape.setAttribute("data-lock", data.data);
    }
    if (data.transform) shape.setAttribute("transform", data.transform);
  }

  function updateCircle(shape, data) {
    console.log("shapeCircle", shape);
    shape.cx.baseVal.value = Math.round((data["x2"] + data["x"]) / 2);
    shape.cy.baseVal.value = Math.round((data["y2"] + data["y"]) / 2);
    shape.r.baseVal.value = Math.max(
      1,
      Math.round(
        Math.sqrt(
          Math.pow(data["x2"] - data["x"], 2) +
            Math.pow(data["y2"] - data["y"], 2)
        ) / 2
      )
    );
    shape.setAttribute("fill", "none");
    if (data.data) {
      shape.setAttribute("data-lock", data.data);
    }
    if (data.transform) shape.setAttribute("transform", data.transform);
  }

  function updateTriangle(shape, data) {
    console.log("shapeTriangle", shape);
    var x1 = Math.min(data["x2"], data["x"]);
    var y1 = Math.max(data["y2"], data["y"]);
    var x2 = Math.max(data["x2"], data["x"]);
    var y2 = Math.min(data["y2"], data["y"]);

    var width = Math.abs(x2 - x1);
    var height = Math.abs(y2 - y1);

    var points;
    if (width > height) {
      // Make the base the longer side
      if (x1 < x2) {
        points = `${x1},${y1} ${x2},${y1} ${x1},${y2}`;
      } else {
        points = `${x1},${y1} ${x2},${y1} ${x2},${y2}`;
      }
    } else {
      // Make the height the longer side
      if (y1 < y2) {
        points = `${x1},${y1} ${x1},${y2} ${x2},${y1}`;
      } else {
        points = `${x1},${y1} ${x1},${y2} ${x2},${y2}`;
      }
    }

    shape.setAttribute("points", points);
    shape.setAttribute("fill", "white");
    if (data.data) {
      shape.setAttribute("data-lock", data.data);
    }
    if (data.transform) {
      shape.setAttribute("transform", data.transform);
    }
  }

  function updateEquiTriangle(shape, data) {
    console.log("shapeEquilateralTriangle", shape);
    var centerX = (data.x + data.x2) / 2;
    var centerY = (data.y + data.y2) / 2;
    var sideLength = Math.abs(data.x2 - data.x);

    var height = (Math.sqrt(3) / 2) * sideLength;

    var x1 = centerX;
    var y1 = centerY - height / 3;
    var x2 = centerX - sideLength / 2;
    var y2 = centerY + (2 * height) / 3;
    var x3 = centerX + sideLength / 2;
    var y3 = y2;

    var points = `${x1},${y1} ${x2},${y2} ${x3},${y3}`;

    shape.setAttribute("points", points);
    shape.setAttribute("fill", "white");
    if (data.data) {
      shape.setAttribute("data-lock", data.data);
    }
    if (data.transform) {
      shape.setAttribute("transform", data.transform);
    }
  }

  function updateParallelogram(shape, data) {
    // Extract the required properties from the data object
    console.log("Shape---Parallelogram", shape);
    var centerX = Math.round((data.x2 + data.x) / 2);
    var centerY = Math.round((data.y2 + data.y) / 2);
    var width = Math.abs(data.x2 - data.x);
    var height = Math.abs(data.y2 - data.y);

    // Calculate the coordinates of the parallelogram vertices
    var x1 = centerX - width / 2;
    var x2 = centerX + width / 2;
    var y1 = centerY - height / 2;
    var y2 = centerY + height / 2;

    var points =
      x1 +
      "," +
      y1 +
      " " +
      x2 +
      "," +
      y1 +
      " " +
      x2 +
      "," +
      y2 +
      " " +
      x1 +
      "," +
      y2;

    // Update the attributes of the polygon shape
    shape.setAttribute("points", points);
    shape.setAttribute("fill", "none");
    if (data.data) {
      shape.setAttribute("data-lock", data.data);
    }
    if (data.transform) {
      shape.setAttribute("transform", data.transform);
    }
  }
  // function updateParallelogram(shape, data) {
  //   // Extract the required properties from the data object
  //   console.log("Shape---Parallelogram", shape);
  //   var x1 = data.x;
  //   var y1 = data.y;
  //   var x2 = data.x2;
  //   var y2 = data.y2;

  //   // Calculate the coordinates of the parallelogram vertices
  //   var width = Math.abs(x2 - x1);
  //   var height = Math.abs(y2 - y1);

  //   var x3 = x1 + width;
  //   var y3 = y1;
  //   var x4 = x2 + width;
  //   var y4 = y2;

  //   var points =
  //     x1 +
  //     "," +
  //     y1 +
  //     " " +
  //     x2 +
  //     "," +
  //     y2 +
  //     " " +
  //     x3 +
  //     "," +
  //     y3 +
  //     " " +
  //     x4 +
  //     "," +
  //     y4;

  //   // Update the attributes of the polygon shape
  //   shape.setAttribute("points", points);
  //   shape.setAttribute("fill", "none");
  //   if (data.data) {
  //     shape.setAttribute("data-lock", data.data);
  //   }
  //   if (data.transform) {
  //     shape.setAttribute("transform", data.transform);
  //   }
  // }

  // function updateParallelogram(shape, data) {
  //   //undefined cordinates

  //   var x1 = data.x;
  //   console.log("x1", x1);

  //   var y1 = data.y;
  //   console.log(" y1 ", y1);

  //   var x2 = data.x2;
  //   console.log(" x2 ", x2);

  //   var y2 = data.y2;
  //   console.log("y2", y2);

  //   var width = Math.abs(x2 - x1);

  //   var height = Math.abs(y2 - y1);
  //   console.log("height", height);

  //   // Calculate the coordinates of the parallelogram vertices

  //   var x3 = x1;
  //   console.log("x3", x3);

  //   var y3 = y1 + height;
  //   console.log("y3", y3);

  //   var x4 = x2;

  //   var y4 = y2 - height;

  //   var points =
  //     x1 +
  //     "," +
  //     y1 +
  //     " " +
  //     x2 +
  //     "," +
  //     y2 +
  //     " " +
  //     x3 +
  //     "," +
  //     y3 +
  //     " " +
  //     x4 +
  //     "," +
  //     y4;
  //   console.log("ponits", points);

  //   // Update the attributes of the polygon shape

  //   shape.setAttribute("points", points);

  //   shape.setAttribute("fill", "none");

  //   if (data.data) {
  //     shape.setAttribute("data-lock", data.data);
  //   }

  //   if (data.transform) {
  //     shape.setAttribute("transform", data.transform);
  //   }
  // }

  function updateRombus(shape, data) {
    // Extract the required properties from the data object
    var centerX = Math.round((data.x2 + data.x) / 2);
    var centerY = Math.round((data.y2 + data.y) / 2);
    var width = Math.abs(Math.round(data.x2 - data.x));
    var height = Math.abs(Math.round(data.y2 - data.y));

    // Calculate the coordinates of the rhombus vertices
    var points = [
      centerX + "," + (centerY - height / 2),
      centerX + width / 2 + "," + centerY,
      centerX + "," + (centerY + height / 2),
      centerX - width / 2 + "," + centerY,
    ];

    // Update the attributes of the polygon shape
    shape.setAttribute("points", points.join(" "));
    shape.setAttribute("fill", "white");
    if (data.data) {
      shape.setAttribute("data-lock", data.data);
    }
    if (data.transform) {
      shape.setAttribute("transform", data.transform);
    }
  }

  function updateTrapezoid(shape, data) {
    console.log("shapeTrapezoid", shape);
    var x1 = Math.min(data["x2"], data["x"]);
    var y1 = Math.max(data["y2"], data["y"]);
    var x2 = Math.max(data["x2"], data["x"]);
    var y2 = Math.min(data["y2"], data["y"]);

    var width = Math.abs(x2 - x1);
    var height = Math.abs(y2 - y1);

    var topWidth = width * 0.6; // Adjust the top width ratio as needed

    var points = `${x1},${y1} ${x2},${y1} ${
      x2 - (width - topWidth) / 2
    },${y2} ${x1 + (width - topWidth) / 2},${y2}`;

    shape.setAttribute("points", points);
    shape.setAttribute("fill", "white");
    if (data.data) {
      shape.setAttribute("data-lock", data.data);
    }
    if (data.transform) {
      shape.setAttribute("transform", data.transform);
    }
  }

  function updatePentagon(shape, data) {
    // Extract the required properties from the data object
    var centerX = Math.round((data.x2 + data.x) / 2);
    var centerY = Math.round((data.y2 + data.y) / 2);
    var sideLength = Math.abs(Math.round((data.x2 - data.x) / 2));

    // Calculate the coordinates of the pentagon vertices
    var angle = (2 * Math.PI) / 5;
    var points = [];
    for (var i = 0; i < 5; i++) {
      var x = centerX + sideLength * Math.cos(angle * i);
      var y = centerY + sideLength * Math.sin(angle * i);
      points.push(x + "," + y);
    }

    // Update the attributes of the polygon shape
    shape.setAttribute("points", points.join(" "));
    shape.setAttribute("fill", "white");
    if (data.data) {
      shape.setAttribute("data-lock", data.data);
    }
    if (data.transform) {
      shape.setAttribute("transform", data.transform);
    }
  }

  function updateHexagon(shape, data) {
    // Extract the required properties from the data object
    var centerX = Math.round((data.x2 + data.x) / 2);
    var centerY = Math.round((data.y2 + data.y) / 2);
    var sideLength = Math.abs(Math.round((data.x2 - data.x) / 2));

    // Calculate the coordinates of the hexavertices
    var angle = Math.PI / 3;
    var points = [];
    for (var i = 0; i < 6; i++) {
      var x = centerX + sideLength * Math.cos(angle * i);
      var y = centerY + sideLength * Math.sin(angle * i);
      points.push(x + "," + y);
    }

    // Update the attributes of the polygon shape
    shape.setAttribute("points", points.join(" "));
    shape.setAttribute("fill", "white");
    if (data.data) {
      shape.setAttribute("data-lock", data.data);
    }
    if (data.transform) {
      shape.setAttribute("transform", data.transform);
    }
  }

  function updateEllipse(shape, data) {
    shape.cx.baseVal.value = Math.round((data["x2"] + data["x"]) / 2);
    shape.cy.baseVal.value = Math.round((data["y2"] + data["y"]) / 2);
    shape.rx.baseVal.value = Math.max(
      1,
      Math.abs(Math.round((data["x2"] - data["x"]) / 2))
    );
    shape.ry.baseVal.value = Math.max(
      1,
      Math.abs(Math.round((data["y2"] - data["y"]) / 2))
    );
    shape.setAttribute("fill", "none");
    if (data.data) {
      shape.setAttribute("data-lock", data.data);
    }
    if (data.transform) shape.setAttribute("transform", data.transform);
  }

  //  functions for 3D shapes
  function updateCone(shape, data) {
    var x1 = Math.min(data.x2, data.x);
    var y1 = Math.max(data.y2, data.y);
    var x2 = Math.max(data.x2, data.x);
    var y2 = Math.min(data.y2, data.y);

    var width = Math.abs(x2 - x1);
    var height = Math.abs(y2 - y1);
    var radius = width / 2;
    var heightCone = Math.min(width, height);

    var centerX = (x1 + x2) / 2;
    var centerY = (y1 + y2) / 2;

    // Define the base center and top vertex coordinates
    var baseCenterX = centerX;
    var baseCenterY = centerY + heightCone;
    var topVertexX = centerX;
    var topVertexY = centerY;

    // Define the number of segments for the cone base
    var numSegments = 30;

    // Calculate the points for the cone base circle
    var basePoints = [];
    var angleIncrement = (2 * Math.PI) / numSegments;
    for (var i = 0; i < numSegments; i++) {
      var angle = i * angleIncrement;
      var pointX = baseCenterX + radius * Math.cos(angle);
      var pointY = baseCenterY + radius * Math.sin(angle);
      basePoints.push(pointX + "," + pointY);
    }

    // Create the polygons for the cone
    var polygons = [];
    for (var j = 0; j < numSegments; j++) {
      var basePoint1 = basePoints[j];
      var basePoint2 = basePoints[(j + 1) % numSegments];
      var trianglePoints = [
        basePoint1,
        basePoint2,
        topVertexX + "," + topVertexY,
      ];
      polygons.push(trianglePoints.join(" "));
    }

    // Update the attributes of the shape
    shape.setAttribute("points", polygons.join(" "));
    shape.setAttribute("fill", "white");
    if (data.data) {
      shape.setAttribute("data-lock", data.data);
    }
    if (data.transform) {
      shape.setAttribute("transform", data.transform);
    }
  }

  // function updateCylinder(shape, data) {
  //   var x1 = Math.min(data.x2, data.x);
  //   var y1 = Math.max(data.y2, data.y);
  //   var x2 = Math.max(data.x2, data.x);
  //   var y2 = Math.min(data.y2, data.y);

  //   var width = Math.abs(x2 - x1);
  //   var height = Math.abs(y2 - y1);
  //   var radius = width / 2;
  //   var heightCylinder = Math.min(width, height);

  //   var centerX = (x1 + x2) / 2;
  //   var centerY = (y1 + y2) / 2;

  //   // Define the number of segments for the cylinder base
  //   var numSegments = 30;

  //   // Calculate the points for the top and bottom circles
  //   var basePoints = [];
  //   var topPoints = [];
  //   var angleIncrement = (2 * Math.PI) / numSegments;
  //   for (var i = 0; i < numSegments; i++) {
  //     var angle = i * angleIncrement;
  //     var basePointX = centerX + radius * Math.cos(angle);
  //     var basePointY = centerY + heightCylinder / 2;
  //     var topPointX = centerX + radius * Math.cos(angle);
  //     var topPointY = centerY - heightCylinder / 2;
  //     basePoints.push(basePointX + "," + basePointY);
  //     topPoints.push(topPointX + "," + topPointY);
  //   }

  //   // Create the polygons for the cylinder sides
  //   var polygons = [];
  //   for (var j = 0; j < numSegments; j++) {
  //     var basePoint1 = basePoints[j];
  //     var basePoint2 = basePoints[(j + 1) % numSegments];
  //     var topPoint1 = topPoints[j];
  //     var topPoint2 = topPoints[(j + 1) % numSegments];
  //     var quadPoints = [basePoint1, basePoint2, topPoint2, topPoint1];
  //     polygons.push(quadPoints.join(" "));
  //   }

  //   // Update the attributes of the shape
  //   shape.setAttribute("points", polygons.join(" "));
  //   shape.setAttribute("fill", "white");
  //   if (data.data) {
  //     shape.setAttribute("data-lock", data.data);
  //   }
  //   if (data.transform) {
  //     shape.setAttribute("transform", data.transform);
  //   }
  // }


  function updateCylinder(shape, data) {
    var x1 = Math.min(data.x2, data.x);
    var y1 = Math.max(data.y2, data.y);
    var x2 = Math.max(data.x2, data.x);
    var y2 = Math.min(data.y2, data.y);
    
    var width = Math.abs(x2 - x1);
    var height = Math.abs(y2 - y1);
    var size = Math.min(width, height);
    
    var centerX = (x1 + x2) / 2;
    var centerY = (y1 + y2) / 2;
    
    // Calculate the corner points of the cylinder base
    var baseXMin = centerX - size / 2;
    var baseXMax = centerX + size / 2;
    var baseYMin = centerY - size / 2;
    var baseYMax = centerY + size / 2;
    
    // Calculate the points for the cylinder base circle
    var basePoints = [];
    var numSegments = 50; // Number of segments for the base circle
    var angleIncrement = (2 * Math.PI) / numSegments;
    
    for (var i = 0; i < numSegments; i++) {
      var angle = i * angleIncrement;
      var pointX = centerX + (size / 2) * Math.cos(angle);
      var pointY = centerY + (size / 2) * Math.sin(angle);
      basePoints.push(pointX + "," + pointY);
    }
    
    // Create the polygons for the cylinder sides
    var polygons = [];
    
    for (var j = 0; j < numSegments; j++) {
      var basePoint1 = basePoints[j];
      var basePoint2 = basePoints[(j + 1) % numSegments];
      var topVertex1 = basePoint1.split(",").map(parseFloat);
      var topVertex2 = basePoint2.split(",").map(parseFloat);
      
      topVertex1[1] -= height;
      topVertex2[1] -= height;
      
      var sidePoints = [
        basePoint1,
        basePoint2,
        topVertex2.join(","),
        topVertex1.join(",")
      ];
      
      polygons.push(sidePoints.join(" "));
    }
    
    // Update the attributes of the shape
    shape.setAttribute("points", polygons.join(" "));
    shape.setAttribute("fill", "white");
    if (data.data) {
      shape.setAttribute("data-lock", data.data);
    }
    if (data.transform) {
      shape.setAttribute("transform", data.transform);
    }
  }

  
  
  
  function updateCube(shape, data) {
    var x1 = Math.min(data.x2, data.x);
    var y1 = Math.max(data.y2, data.y);
    var x2 = Math.max(data.x2, data.x);
    var y2 = Math.min(data.y2, data.y);
  
    var width = Math.abs(x2 - x1);
    var height = Math.abs(y2 - y1);
    var size = Math.min(width, height);
  
    var centerX = (x1 + x2) / 2;
    var centerY = (y1 + y2) / 2;
  
    // Calculate the corner points of the cube
    var xMin = centerX - size / 2;
    var xMax = centerX + size / 2;
    var yMin = centerY - size / 2;
    var yMax = centerY + size / 2;
  
    var points = [
      // Front face
      xMin + "," + yMin,
      xMax + "," + yMin,
      xMax + "," + yMax,
      xMin + "," + yMax,
  
      // Back face
      xMin + "," + yMin + "," + (yMin - size),
      xMax + "," + yMin + "," + (yMin - size),
      xMax + "," + yMax + "," + (yMin - size),
      xMin + "," + yMax + "," + (yMin - size)
    ];
  
    // Update the attributes of the shape
    shape.setAttribute("points", points.join(" "));
    shape.setAttribute("fill", "white");
    if (data.data) {
      shape.setAttribute("data-lock", data.data);
    }
    if (data.transform) {
      shape.setAttribute("transform", data.transform);
    }
  }
  
  
  
  function toggle(elem) {
    console.log("toggle", elem);
    if (Tools.menus["Rectangle"].menuOpen()) {
      Tools.menus["Rectangle"].show(false);
    } else {
      Tools.menus["Rectangle"].show(true);
    }
    if (!menuInitialized) initMenu(elem);
  }

  var menuInitialized = false;
  var menuShape = "Circle";
  var button;

  function initMenu(elem) {
    button = elem;
    var btns = document.getElementsByClassName("submenu-rect");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", menuButtonClicked);
    }
    var elem = document.getElementById("rect-dashed");
    elem.addEventListener("click", dashedClicked);
    updateMenu("Rectangle");
    menuInitialized = true;
  }

  var menuButtonClicked = function () {
    menuShape = this.id.substr(13);
    console.log(menuShape, "menuShape");
    curshape = menuShape;

    console.log("curshape", curshape);
    updateMenu(menuShape);
    console.log("updateMenu", updateMenu);
    changeButtonIcon();
  };

  var changeButtonIcon = function () {
    if (icons[curshape].isHTML) {
      button.getElementsByClassName("tool-icon")[0].innerHTML =
        icons[curshape].icon;
    } else {
      button.getElementsByClassName("tool-icon")[0].textContent =
        icons[curshape].icon;
    }
  };

  var updateMenu = function (shape) {
    var btns = document.getElementsByClassName("submenu-rect");
    for (var i = 0; i < btns.length; i++) {
      if (icons[btns[i].id.substr(13)].isSVG) {
        btns[i].getElementsByClassName("tool-icon")[0].innerHTML =
          icons[btns[i].id.substr(13)].menuIcon;
      }
      btns[i].style.backgroundColor = "#fff";
      btns[i].style.color = "gray";
      btns[i].style.borderRadius = "8px";
    }
    /*if(shape=="Ellipse"){
			var extender = document.getElementById("submenu-rect-extend")
			extender.style.display = 'block';
			$(extender).animate({width:250,height:200});
		}*/
    var btn = document.getElementById("submenu-rect-" + shape);
    if (icons[btn.id.substr(13)].isSVG) {
      btn.getElementsByClassName("tool-icon")[0].innerHTML =
        icons[btn.id.substr(13)].menuIconActive;
    }
    btn.style.backgroundColor = "#eeeeff";
    btn.style.color = "green";
    btn.style.borderRadius = "8px";
  };

  function dashedClicked() {
    var elem = document.getElementById("rect-dashed");
    if (dashed) {
      dashed = false;
      elem.setAttribute("class", "far fa-square");
    } else {
      elem.setAttribute("class", "far fa-check-square");
      dashed = true;
    }
  }

  function menuListener(elem, onButton, onMenu, e) {
    if (!onMenu && !onButton) {
      e.stopPropagation();
      return true;
    }
    return false;
  }

  Tools.add({
    //The new tool
    // "name": "Rectangle",
    //  "icon": "▢",
    iconHTML: shapeSVG,
    name: "Rectangle",
    title: "Shapes",
    listeners: {
      press: start,
      move: move,
      release: stop,
    },
    draw: draw,
    toggle: toggle,
    shortcuts: {
      changeTool: "3",
    },
    menu: {
      title: "Shapes",
      content:
        `<div class="tool-extra submenu-rect" id="submenu-rect-Rectangle">
							<span title = "rectangle" class="tool-icon">▭</span>
						</div>
						<div class="tool-extra submenu-rect" id="submenu-rect-Circle">
							<span title = "circle" class="tool-icon">◯</span>
						</div>
						<div class="tool-extra submenu-rect" id="submenu-rect-Triangle">
							<span title = "triangle" class="tool-icon">◺</span>
						</div>
						<div class="tool-extra submenu-rect" id="submenu-rect-EquiTriangle">
							<span title = "equiTriangle" class="tool-icon">△</span>
						</div>
						<div class="tool-extra submenu-rect" id="submenu-rect-Parallelogram">
							<span title = "parallelogram" class="tool-icon">▱</span>
						</div>
						<div class="tool-extra submenu-rect" id="submenu-rect-Trapezoid">
							<span title = "trapezoid" class="tool-icon">⏢</span>
						</div>
            <div class="tool-extra submenu-rect" id="submenu-rect-Rombus">
							<span title = "rombus" class="tool-icon">◇</span>
						</div>
						<div class="tool-extra submenu-rect" id="submenu-rect-Pentagon">
							<span title = "pentagon" class="tool-icon">⬠</span>
						</div>
						<div class="tool-extra submenu-rect" id="submenu-rect-Hexagon">
							<span title = "hexagon" class="tool-icon">⬡</span>
						</div>
            <div class="tool-extra submenu-rect" id="submenu-rect-Cube">
              <span title = "cube" class="tool-icon">=</span>
             </div>
            <div class="tool-extra submenu-rect" id="submenu-rect-Cone">
              <span title = "cone" class="tool-icon">*</span>
            </div>
            <div class="tool-extra submenu-rect" id="submenu-rect-Cylinder">
              <span title = "cylinder" class="tool-icon">&</span>
            </div>
            <div class="tool-extra submenu-rect" id="submenu-rect-Sphere">
							<span title = "sphere" class="tool-icon">@</span>
						</div>

           
						<div class="tool-extra submenu-rect" id="submenu-rect-Ellipse">
							<span title = "ellipse" class="tool-icon">` +
        icons["Ellipse"].icon +
        `</span>
						</div>
						<div style="width:143px;display:block" class="tool-extra"  id="submenu-rect-dashed">
							<div style="margin-top:5px;padding:5px;font-size:.8rem;color: gray"><i style="font-size:.8rem;margin-left:5px" id="rect-dashed" class="far fa-square"></i> &nbsp;dashed</div>
						</div>`,
      listener: menuListener,
    },
    mouseCursor: "crosshair",
    stylesheet: "tools/rect/rect.css",
  });
})(); //End of code isolation
