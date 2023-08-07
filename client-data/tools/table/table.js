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

let TableObjectsId = [];

(function Table() {
  var curText = {
    x: 0,
    y: 0,
    size: 36,
    rawSize: 16,
    oldSize: 0,
    opacity: 1,
    color: "#000",
    id: 0,
    sentText: "",
    lastSending: 0,
  };

  var tableSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="currentColor" class="bi bi-table" viewBox="0 0 16 16" id="IconChangeColor"> <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z" id="mainIconPathAttribute" fill="#000000"></path> </svg>';
  function draw() {
    Tools.drawingEvent = true;
    switch (data.type) {
      case "new":
        draw;
        createTable(data);
        break;
      case "update":
        var table = document.getElementById(data.id);
        if (table === null) {
          console.error(
            "Text: Hmmm... I received text that belongs to an unknown text field"
          );
          return false;
        } else {
          if (Tools.useLayers) {
            if (table.getAttribute("class") != "layer" + Tools.layer) {
              table.setAttribute("class", "layer-" + Tools.layer);
              Tools.group.appendChild(textField);
            }
          }
        }
        // updateText(table, data.txt);
        break;
      default:
        console.error("Text: Draw instruction with unknown type. ", data);
        break;
    }
  }

  const createTable = (e, fieldData) => {
    console.log(e);
    Tools.curTool = null;
    seclectedTable = null;
    const foreignObject = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "foreignObject"
    );
    TableObjectsId.push(foreignObject);

    foreignObject.style.position = 'relative';
    foreignObject.setAttribute("overflow", "visible");
    const foreignObjectUid = Tools.generateUID("doc");
    foreignObject.setAttribute("id", foreignObjectUid)
    const table = document.createElement("table");
    table.style.position = "absolute";
    foreignObject.style.x = 250 + Math.random() * 100;
    foreignObject.style.y = 300 + Math.random() * 100;
    foreignObject.style.width = "1px";
    foreignObject.style.height = "1px";
    
    // Tools.positionElement(table, 100, 100);

    for (let i = 0; i < 2; i++) {
      const tr = document.createElement("tr");
      for (let j = 0; j < 3; j++) {
        addInputElement(tr);
      }
      //append tr in table
      table.appendChild(tr);
    }
    const editTableButton = document.createElement("button");
    editTableButton.innerHTML = '<i class="fa fa-pencil">&#xf040;</i>';
    //editTableButton.innerHTML =  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7.127 22.562l-7.127 1.438 1.438-7.128 5.689 5.69zm1.414-1.414l11.228-11.225-5.69-5.692-11.227 11.227 5.689 5.69zm9.768-21.148l-2.816 2.817 5.691 5.691 2.816-2.819-5.691-5.689z"/></svg>
    editTableButton.classList.add('btn-edit-table')
    editTableButton.style.border = 'none';

    foreignObject.appendChild(editTableButton);
    
    const Options = document.createElement('div')
    Options.style.top = 0;
    Options.style.left = 0;
    Options.style.backgroundColor = 'white'
    Options.style.border="1px solid black"
    Options.style.width = '12rem'
    Options.classList.add('table-modal')
    Options.style.position = 'absolute'
    Options.style.top = '0px'
    Options.style.left = '0px'
    Options.style.zIndex = '99';
    foreignObject.appendChild(Options)

    // Add an event listener to the edit button
    let toggleOption = true;
    editTableButton.addEventListener("click", function (e) {
      toggleOption = !toggleOption;
      Options.style.display = toggleOption ? "none" : "block";
    });

    // add actions
    const action = ['Add Row', 'Add Column', 'Delete Row', 'Delete Column'];
    action.forEach(ele => {
      createTableActions(ele, Options, table, foreignObject);
    })

    table.style.border = "1px solid #000";
    table.style.borderCollapse = "collapse";

    foreignObject.append(table);

    if (Tools.useLayers) table.setAttribute("class", "layer-" + Tools.layer);
    table.setAttribute(
      "opacity",
      Math.max(0.1, Math.min(1, fieldData?.opacity)) || 1
    );
    if (fieldData?.txt) elem.textContent = fieldData?.txt;
    if (fieldData?.data) {
      elem.setAttribute("data-lock", fieldData?.data);
    }
    if (fieldData?.transform)
      elem.setAttribute("transform", fieldData?.transform);
    Tools.group.appendChild(foreignObject);
    makeDraggeble(foreignObject)
    return Table;
  };

  Tools.add({
    name: "Table",
    iconHTML: tableSvg,
    listeners: {},
    // draw: backgroundChange,
    //"oneTouch":true,
    onstart: createTable, // start the fn while tool is selected
    mouseCursor: "auto",
    draw: draw,
  });
})(); //End of code isolation




const addInputElement = (row) => {
  const td = document.createElement("td");
  td.style.border = "1px solid #000";
  let input = document.createElement("input");
  input.style.outline = "none";
  input.style.padding = "4px 10px";
  td.appendChild(input);
  if (row)
    row.appendChild(td);
  input.type = "text";
  input.addEventListener("contextmenu", (e) => {
    e.preventDefault()
    cell = e.target;
  });

  return td;
};


const createTableActions = (action, parentRef, tableRef, superElement) => {
  const currentRef = document.createElement('p');
  currentRef.innerHTML = action;
  currentRef.classList.add('action');
  parentRef.appendChild(currentRef);
  switch (action) {
    case 'Add Row':
      currentRef.addEventListener('click', () => addRow(tableRef));
      break;
    case 'Delete Row':
      currentRef.addEventListener('click', () => deleteRow(tableRef, superElement));
      break;
    case 'Delete Column':
      currentRef.addEventListener('click', () => deleteColumn(tableRef, superElement));
      break;
    case 'Add Column':
      currentRef.addEventListener('click', () => addColumn(tableRef));
      break;


  }

}
const addRow = (ref) => {
  if (ref.tagName === 'TABLE') {
    const tableColumns = ref.rows[0].getElementsByTagName("td");
    const tr = document.createElement("tr");
    for (let i = 0; i < tableColumns.length; i++) {
      addInputElement(tr);
    }
    ref.appendChild(tr);
  }
}
const deleteRow = (ref, superElement) => {
  ref.removeChild(ref.lastElementChild)
  if (Array.from(ref.children).length == 0) {
    superElement.remove()
    TableObjectsId = TableObjectsId.filter(obj => obj != superElement);
  }
}
const deleteColumn = (ref, superElement, tableRef) => {

  let removeSuperElement = false;
  Array.from(ref.children).forEach(obj => {
    obj.removeChild(obj.lastElementChild);
    if (Array.from(obj.children).length == 0) {
      removeSuperElement = true;
    }
  })
  if (removeSuperElement){
    superElement.remove();
    TableObjectsId = TableObjectsId.filter(obj => obj != superElement);
  }
  console.log(TableObjectsId.length)
}
const addColumn = (ref) => {
  Array.from(ref.children).forEach(obj => {
    let lastColumn = addInputElement(null);
    obj.appendChild(lastColumn);
  })
}
