// Functions
generateBoxContents = function(width = "min10", height = "auto", chars = "┌┐└┘─│", boxTextContent = "", backgroundChar = " ", align = "center", textId = "defaultBoxContent") {
    let out = "";
    symbols = {"upperLeft":chars[0], "upperRight":chars[1], "lowerLeft":chars[2], "lowerRight":chars[3], "horizontal":chars[4], "vertical":chars[5]}
    
    // make the width auto adjust for width=minxxx, example min100 (100 chars long, or width of text, whichever is smaller)
    if (width.substring(0,3) === "min") {
        width = Math.min(Number(width.substring(3)), boxTextContent.length);
    }
    
    // top line
    out += symbols.upperLeft;
    out += drawHorizontalLine(width, symbols.horizontal);
    out += symbols.upperRight;
    out += "\n";
    
    // empty box
    if (boxTextContent === "") {
        for (h = 0; h < height; h++) {
            out += symbols.vertical;
            out += drawHorizontalLine(width, backgroundChar);
            out += symbols.vertical;
            out += "\n"
        }
    } else { // box with content
        let splitTextContent = sliceTextIntoPieces(boxTextContent, width);
        let contentHeight = splitTextContent.length;
        
        // make auto boxes actually set height automatically
        if (height === "auto") {
            height = contentHeight;
        }
        
        
        if (contentHeight > height) {
            throw new Error("Box too small for content!");
        }
        
        // calculate space margins above content
        let spaceAboveContent = Math.ceil((height - contentHeight) / 2);
        
        // loop to draw contents
        for (h = 0; h < height; h++) {
            out += symbols.vertical;
            // if it's outside of the content, draw spaces
            if (h < spaceAboveContent || h >= spaceAboveContent + contentHeight) {
                out += drawHorizontalLine(width, backgroundChar);
            } else { // else insert the content, center aligned
                out += "<span id='" + textId + "'>";
                out += drawHorizontalLineWithText(width, backgroundChar, splitTextContent[h - spaceAboveContent], align)
                out += "</span>"
            }
            out += symbols.vertical;
            out += "\n"
        }
    }
    
    // bottom line
    out += symbols.lowerLeft;
    out += drawHorizontalLine(width, symbols.horizontal);
    out += symbols.lowerRight;
    
    return out;
}

drawHorizontalLine = function(width, char) {
    let out = "";
    for (w = 0; w < width; w++) {
        out += char;
    }
    return out;
}

drawHorizontalLineWithText = function(width, char, text, align) {
    // how much space left when taking text into account
    let leftOverSpace = width - text.length;
    
    let out = "";
    
    if (align == "center") {
        // Left and right side spacing
        let leftSideMargin = Math.floor(leftOverSpace/2);
        let rightSideMargin = Math.ceil(leftOverSpace/2);
        
        out += drawHorizontalLine(leftSideMargin, char);
        
        out += text;
        
        out += drawHorizontalLine(rightSideMargin, char);
    } else {
        if (align == "right") {
            out += drawHorizontalLine(leftOverSpace, char);
        }
        
        out += text;
        
        if (align == "left") {
            out += drawHorizontalLine(leftOverSpace, char);
        }
    }
    
    
    return out;
}

// https://stackoverflow.com/a/7033662
sliceTextIntoPieces = function(text, size) {
    return text.match(new RegExp('.{1,' + size + '}', 'g'));
}

// WIP
sliceTextWordAware = function(text, size) {
    let words = text.split(" ");
    let workToDo = true;
    let outWords = [];
    let outWordIndex = 0;
    while(workToDo) {
        outWords[outWordIndex] = words[0];
        
        workToDo = false;
    }
    return outWords;
}

drawBox = function(box) {
    let width = box.getAttribute("width");
    let height = box.getAttribute("height");
    let chars = box.getAttribute("chars");
    let text = box.boxTextContent;
    let backgroundChar = box.getAttribute("background");
    let align = box.getAttribute("textAlign");
    let textId = box.getAttribute("textId");
    box.innerHTML = generateBoxContents(width, height, chars, text, backgroundChar, align, textId);
}

generateBoxObject = function(params) {
    params = params || {};
    content = params.content || "";
    classes = params.classes || "box";
    width = params.width || 10;
    height = params.height || "auto";
    chars = params.chars || "┌┐└┘─│";
    backgroundChar = params.backgroundChar || " ";
    textAlign = params.textAlign || "center";
    textId = params.textId || "defaultBoxContent";
    boxId = params.boxId || "";
    let newBox = document.createElement("div");
    newBox.setAttribute("class", classes);
    newBox.setAttribute("width", width);
    newBox.setAttribute("height", height);
    newBox.setAttribute("chars", chars);
    newBox.setAttribute("background", backgroundChar);
    newBox.setAttribute("textAlign", textAlign);
    newBox.setAttribute("textId", textId);
    newBox.setAttribute("id", boxId);
    newBox.boxTextContent = content;
    return newBox;
}

// Initially draw all boxes. 
let boxes = document.querySelectorAll(".box");
boxes.forEach((box, i) => {
    if (box.boxTextContent === undefined) {
        box.boxTextContent = box.textContent;
    }
    drawBox(box);
})

// Make the 'Type here...' box save it's content somewhere else
document.querySelector(".chatinput").inputText = document.querySelector(".chatinput").boxTextContent;


// everytime the inputfield is changed, check whether it is empty to show the
// Type here... behind it. 
document.querySelector("#inputField").addEventListener("input", function() {
    let chatInputText = document.querySelector(".chatinput");
    if (document.querySelector("#inputField").value !== "") {
        chatInputText.boxTextContent = "";
        drawBox(chatInputText);
    } else {
        chatInputText.boxTextContent = chatInputText.inputText;
        drawBox(chatInputText);
    }
});


document.querySelector("#inputField").addEventListener("keydown", (event) => {
    // if we press enter while having the input field selected
    if (event.key === "Enter") {
        // grab the input field
        let chatInputField = document.querySelector("#inputField");
        // make the chatbox. 
        let newBox = generateBoxObject({
            content:chatInputField.value,
            height:"auto",
            textId:"myMessages",
            width:"min100",
            textAlign:"left"
        });
        
        document.querySelector("#centerBox").prepend(newBox);
        drawBox(newBox);
        
        chatInputField.value = "";
        let chatInputText = document.querySelector(".chatinput");
        chatInputText.boxTextContent = chatInputText.inputText;
        drawBox(chatInputText);
    }
})