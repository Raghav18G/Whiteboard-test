(function documents() { //Code isolation


// This isn't an HTML5 canvas, it's an old svg hack, (the code is _that_ old!)
var uploadSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><polygon points="16 9 16 16 1 16 1 9 0 9 0 17 17 17 17 9 16 9"/><polygon points="8.5 0 15.15 6.65 14.44 7.35 9 1.91 9 13 8 13 8 1.91 2.56 7.35 1.85 6.65 8.5 0"/></g></g></svg>';
var xlinkNS = "http://www.w3.org/1999/xlink";
var imgCount = 1;
var fileInput;
function onstart() {
    fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.click();
    fileInput.addEventListener("change", function(){
        var reader = new FileReader();
        reader.readAsDataURL(fileInput.files[0]);
      
        reader.onload = function (e) {
            var image = new Image();
            image.src = e.target.result;
            image.onload = function () {
    
            var uid = Tools.generateUID("doc"); // doc for document
            // console.log(image.src.toString().length);
            
            var msg = {
                id: uid,
                type:"doc",
                src: image.src,
                w: this.width || 300,
                h: this.height || 300,
                x: (100+document.documentElement.scrollLeft)/Tools.scale+10*imgCount,
                y: (100+document.documentElement.scrollTop)/Tools.scale + 10*imgCount
                //fileType: fileInput.files[0].type
            };
            draw(msg);
            Tools.send(msg,"Document");
            imgCount++;
            };
        };
       // Tools.change(Tools.prevToolName);
    });
}

function draw(msg) {
    //const file = self ? msg.data : new Blob([msg.data], { type: msg.fileType });
    //const fileURL = URL.createObjectURL(file);

   // fakeCanvas.style.background = `url("${fileURL}") 170px 0px no-repeat`;
    //fakeCanvas.style.backgroundSize = "400px 500px";
    var aspect = msg.w/msg.h
    var img = Tools.createSVGElement("image");
    img.id=msg.id;
    img.setAttribute("class", "layer-"+Tools.layer);
    img.setAttributeNS(xlinkNS, "href", msg.src);
    img.x.baseVal.value = msg['x'];
    img.y.baseVal.value = msg['y'];
    img.setAttribute("width", 400*aspect);
    img.setAttribute("height", 400);
    if(msg.transform)
			img.setAttribute("transform",msg.transform);
    Tools.group.appendChild(img);
    
}

Tools.add({
    "name": "Document",
    // "icon": "🖼️",
    iconHTML: uploadSVG,
    "shortcuts": {
        "changeTool":"7"
    },
    "draw": draw,
    "onstart": onstart,
    "oneTouch":true
});

})(); //End of code isolation