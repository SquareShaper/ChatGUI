// Functions
drawBox = function(width, height, chars, textContent = "", backgroundChar = " ") {
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
                out += drawHorizontalLineWithText(width, backgroundChar, splitTextContent[h - spaceAboveContent])
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

drawHorizontalLineWithText = function(width, char, text) {
    // how much space left when taking text into account
    let leftOverSpace = width - text.length;
    
    // Left and right side spacing
    let leftSideMargin = Math.floor(leftOverSpace/2);
    let rightSideMargin = Math.ceil(leftOverSpace/2);
    
    let out = "";
    out += drawHorizontalLine(leftSideMargin, char);
    
    out += text;
    
    out += drawHorizontalLine(rightSideMargin, char);
    
    return out;
}

// https://stackoverflow.com/a/7033662
sliceTextIntoPieces = function(text, size) {
    return text.match(new RegExp('.{1,' + size + '}', 'g'));
}

// Initialize box drawing
let boxes = document.querySelectorAll(".box");

boxes.forEach((box, i) => {
    let width = box.getAttribute("width");
    let height = box.getAttribute("height");
    let chars = box.getAttribute("chars");
    let text = box.innerHTML;
    let backgroundChar = box.getAttribute("background");
    box.innerHTML = drawBox(width, height, chars, text, backgroundChar);
})