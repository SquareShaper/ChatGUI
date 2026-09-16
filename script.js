// Functions
generateBoxContents = function(width, height, chars, textContent = "", backgroundChar = " ", align = "center") {
    let out = "";
    symbols = {"upperLeft":chars[0], "upperRight":chars[1], "lowerLeft":chars[2], "lowerRight":chars[3], "horizontal":chars[4], "vertical":chars[5]}
    
    // top line
    out += symbols.upperLeft;
    out += drawHorizontalLine(width, symbols.horizontal);
    out += symbols.upperRight;
    out += "\n";
    
    // empty box
    if (textContent === "") {
        for (h = 0; h < height; h++) {
            out += symbols.vertical;
            out += drawHorizontalLine(width, backgroundChar);
            out += symbols.vertical;
            out += "\n"
        }
    } else { // box with content
        let splitTextContent = sliceTextIntoPieces(textContent, width);
        let contentHeight = splitTextContent.length;
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
                out += drawHorizontalLineWithText(width, backgroundChar, splitTextContent[h - spaceAboveContent], align)
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
    let text = box.textContent;
    let backgroundChar = box.getAttribute("background");
    let align = box.getAttribute("textAlign");
    box.innerHTML = generateBoxContents(width, height, chars, text, backgroundChar, align);
}

generateBoxObject = function(content, classes = "box", width = 10, height = 10, chars = "┌┐└┘─│", backgroundChar = " ", textAlign = "center") {
    let newBox = document.createElement("div");
    newBox.setAttribute("class", classes);
    newBox.setAttribute("width", width);
    newBox.setAttribute("height", height);
    newBox.setAttribute("chars", chars);
    newBox.setAttribute("background", backgroundChar);
    newBox.setAttribute("textAlign", textAlign);
    newBox.textContent = content;
    newBox.innerHTML = content;
    return newBox;
}

// Initialize box drawing
let boxes = document.querySelectorAll(".box");
boxes.forEach((box, i) => {
    box.textContent = box.innerHTML;
    drawBox(box);
})

// Make the 'Type here...' box save it's content somewhere else
document.querySelector(".chatinput").inputText = document.querySelector(".chatinput").originalText;

document.querySelector("#inputField").addEventListener("input", function() {
    let chatInputText = document.querySelector(".chatinput");
    if (document.querySelector("#inputField").value !== "") {
        chatInputText.originalText = "";
        drawBox(chatInputText);
    } else {
        chatInputText.originalText = chatInputText.inputText;
        drawBox(chatInputText);
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === " ") {
        let newBox = generateBoxObject("Test box");
        drawBox(newBox);
        document.querySelector("#centerBox").appendChild(newBox);
    }
})