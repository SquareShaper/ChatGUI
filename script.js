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
        
        let clipText = false;
        if (contentHeight > height) {
            // no longer error on height diff, just force it down
            // should work just like this?
            clipText = true;
            console.log("clipping!");
            contentHeight = height;
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
                if (clipText && h == spaceAboveContent + contentHeight - 1) {
                    out += drawHorizontalLineWithText(width, backgroundChar, splitTextContent[h - spaceAboveContent].substring(0,splitTextContent[h-spaceAboveContent].length-3)+"...", align)
                } else {
                    out += drawHorizontalLineWithText(width, backgroundChar, splitTextContent[h - spaceAboveContent], align)
                }
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

let currentRoomName = "General";
let username = "";
let password = "";

// Initially draw all boxes. 
let boxes = document.querySelectorAll(".box");
boxes.forEach((box, i) => {
    if (box.boxTextContent === undefined) {
        box.boxTextContent = box.textContent;
    }
    drawBox(box);
});

// Make all input boxes save their content somewhere else
    let inputBoxes = document.querySelectorAll(".inputBox");
inputBoxes.forEach((box, i) => {
    box.inputText = box.boxTextContent;
});

// Make all input fields clear and re-set their background default text
let inputFields = document.querySelectorAll(".textInputField");
inputFields.forEach((field, i) => {
    field.value = "";
    field.addEventListener("input", (event) => {
        let textBox = document.querySelector("#"+event.target.getAttribute("boxIdToClear"))
        if (event.target.value !== "") {
            textBox.boxTextContent = " ";
        } else {
            textBox.boxTextContent = textBox.inputText;
        }
        drawBox(textBox);
    })
});

// Sending texts
document.querySelector("#inputField").addEventListener("keydown", (event) => {
    // if we press enter while having the input field selected
    if (event.key === "Enter") {
        // grab the input field
        let chatInputField = document.querySelector("#inputField");
        
        currentRoom.send(chatInputField.value);
        
        
        // and clear the input field
        chatInputField.value = "";
        let chatInputText = document.querySelector("#chatinput");
        chatInputText.boxTextContent = chatInputText.inputText;
        drawBox(chatInputText);
    }
});

// This is where we should connect to WarpTalk initially
let wt = new WarpTalk("wss", "warp.cs.au.dk/talk/");

let loginBox = document.querySelector("#sendLoginBox");
loginBox.addEventListener("click", (event) => {
    console.log("Logging in...");
    
    username = document.querySelector("#userInputField").value;
    password = document.querySelector("#passwordInputField").value;
    
    if (password === "") {
        console.log("guest login as: " + username);
        wt.isLoggedIn(function(isLoggedIn){
            if (isLoggedIn) {
                wt.connect(sessionHandler);
            } else {
                wt.connect(sessionHandler, username);
            }
        });
    } else { 
        console.log("sign in as: " + username);
        wt.isLoggedIn(function(isLoggedIn){
            if (isLoggedIn) {
                wt.connect(sessionHandler);
            } else {
                wt.connect(sessionHandler, username+"12988912749813fillertomakesurethisain'tregistered");
                wt.login(username, password);
            }
        });
    }
    
    document.querySelector("#loginPrompt").classList.add("hidden");
    document.querySelector("#loginBackgroundBox").classList.add("hidden");
    
    // update username thingy in the header
    document.querySelector("#usernameDisplay").innerHTML = username;
    if (password === "") {
        document.querySelector("#userType").innerHTML = "(guest)";
    } else {
        document.querySelector("#userType").innerHTML = "(registered)";
    }
    
});

let currentRoom = "";
let rooms = "";

let listeningOn = {};

// Called when WarpTalk connects
function sessionHandler() {
    console.log("Successfully established connection to WarpTalk!");
    
    rooms = wt.availableRooms;
    rooms.forEach((r) => {
        // make a room box (for listing the room on the side)
        let newRoom = generateBoxObject({
            content:r.name,
            height:"auto",
            textId:"room"+r.name,
            width:"min100",
            textAlign:"left",
            classes:"roomBox box",
            boxId:r.name+"Box"
        });
        // add and draw
        document.querySelector("#roomsContainer").append(newRoom);
        drawBox(newRoom);
        
        // make them clickable so you can switch
        newRoom.addEventListener("click", (event) => {
            let roomBoxName = event.target.getAttribute("id");
            let roomName;
            if (event.target.classList.contains("box")) {
                roomName = roomBoxName.substring(0, roomBoxName.length - 3);
            } else {
                roomName = roomBoxName.substring(4);
            }
            joinRoom(roomName);
        });
        
        let roomContentContainer = document.querySelector("#roomContentContainer");
        let roomElement = document.createElement("div");
        roomElement.classList.add("room");
        roomElement.classList.add("hidden");
        roomElement.setAttribute("id", r.name);
        roomContentContainer.append(roomElement);
        
        let usersContainer = document.querySelector("#usersContainer");
        let usersElement = document.createElement("div");
        usersElement.classList.add("users");
        usersElement.classList.add("hidden");
        usersElement.setAttribute("id", "users"+r.name);
        usersContainer.append(usersElement);
        
        listeningOn[r.name] = false;
    });
    
    let roomsBox = document.querySelector("#roomsBox");
    roomsBox.setAttribute("height", rooms.length * 3 + 1);
    drawBox(roomsBox);
    
    // This shi- don't work :(
    // setInterval(function(){
    //     if (currentRoom != "") {
    //         updateUsersBox(currentRoom);
    //     }
    // }, 1000);
}

function appendUserBox(usersList, name, roomName) {
    let userBox = generateBoxObject({
        content:name,
        height:"1",
        textId:"users",
        width:"min22",
        textAlign:"left",
        classes:"usersBox box",
        boxId:name+roomName+"Box"
    });
    usersList.append(userBox);
    drawBox(userBox);
    
    // resize users background box
    adjustUsersBox();
}

// check if a user already exists
function userExists(room, name) {
    let usersList = document.querySelector("#users"+room.name);
    
    for (child of usersList.children) {
        if (child.boxTextContent === name) {
            return true; // user exists already, so don't add another box
        }
    }
    
    return false;
}

function adjustUsersBox() {
    // resize users background box
    let usersBox = document.querySelector("#usersBox");
    let currentUsersList = document.querySelector("#users"+currentRoomName);
    usersBox.setAttribute("height", currentUsersList.children.length * 3);
    drawBox(usersBox);
}

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function messageSent(room, msg) {
    // msg shape:
    // message: "kjljkl"
    // room: "General"
    // sender: "fisk"
    // type: "message"
    
    
    
    // check which room to send to
    let roomDiv = document.querySelector("#"+room.name);
    
    // if there's no room, stop execution
    if (roomDiv === null) {
        console.log("Received a message, but for some reason the div for: "+ room.name + " doesn't exist...");;
        return;
    }
    
    // get the current time to use for timestamping
    let date = new Date;
    let timestamp = date.getDate() + "/" + months[date.getMonth()] + "/" + date.getFullYear().toString().substring(2);
    let messageTextId = "otherMessages";
    let messageTextAlign = "right";
    let boxClasses = "reply box"
    
    // take care of which user sent it
    if (msg.sender === username) {
        messageTextId = "myMessages";
        messageTextAlign = "left";
        boxClasses = "box"
    }
    
    // make the chatbox. 
    let newBox = generateBoxObject({
        content:"["+msg.sender+"|"+timestamp+"] "+msg.message,
        height:"auto",
        textId:messageTextId,
        width:"min100",
        textAlign:messageTextAlign,
        classes:boxClasses
    });
    
    // add the new text
    roomDiv.prepend(newBox);
    drawBox(newBox);
}

function joinRoom(room) {
    console.log("Attempting to join: " + room);
    currentRoom = wt.join(room);
    currentRoomName = room;
    
    // Make the text input field show that you can send messages now
    let inputTextBox = document.querySelector("#chatinput");
    let inputTextBoxContent = " Start typing to send a message in " + room + "...";
    inputTextBox.boxTextContent = inputTextBoxContent;
    inputTextBox.inputText = inputTextBoxContent;
    drawBox(inputTextBox);
    
    // make the heading show current room
    document.querySelector("#selectedRoomDisplay").innerHTML = room;
    
    // update username thingy in the header
    document.querySelector("#usernameDisplay").innerHTML = username;
    
    // hide the user and message pane for the other rooms
    let containers = document.querySelectorAll(".room, .users");
    containers.forEach(c => {
        c.classList.add("hidden");
    });
    
    // show the current room messages and users
    document.querySelector("#"+currentRoomName).classList.remove("hidden");
    document.querySelector("#users"+currentRoomName).classList.remove("hidden");
    
    // add listeners, if they didn't exist yet
    if (!listeningOn[currentRoomName]) {
        currentRoom.onJoin((room, name) => {
            setTimeout(updateUsersBox(room), 200);
        });
        currentRoom.onLeave((room, name) => {
            setTimeout(updateUsersBox(room), 200);
        })
        currentRoom.onMessage((room, msg) => {
            messageSent(room, msg);
        });
        listeningOn[currentRoomName] = true;
    }
    
    // highlight the joined room
    document.querySelector("#"+currentRoomName+"Box").classList.replace("roomBox", "selectedRoomBox");
    
    // grab the users already in the room and add them to the userslist
    // very hacky...
    setTimeout(updateUsersBox(currentRoom), 1500);
}

function updateUsersBox(room) {
    let usersList = document.querySelector("#users"+room.name);
    let usersInRoom = room.clients;
    for (child of usersList.children) {
        child.remove();
    }
    
    
    let sortedUsers = [];
    for (userInRoom of usersInRoom) {
        sortedUsers.push(userInRoom.nickname);
    }
    
    sortedUsers.sort();
    
    console.log(sortedUsers);
    for (i = 0; i < sortedUsers.length; i++) {
        let usernameInRoom = sortedUsers[i];
        if (!userExists(room, usernameInRoom)) {
            appendUserBox(usersList, usernameInRoom, room.name);
        }
    }
    adjustUsersBox();
}

// // This function is called when the connection to the server is established (we give it as argument to connect above).
// function connected() {
//     console.log("Connection established.");
//     // We can now list the rooms available on the server
//     console.log("The server has the following rooms:");
//     wt.availableRooms.forEach(r => {
    //         console.log(`- ${r.name}: ${r.description}`);
//     });

//     // Let's join a room. We'll take the first one in the list. That's 'General'.
//     let room = wt.join(wt.availableRooms[0].name);

//     // We can now use the room object to send a message to that room.
//     room.send("Hello, room!");

//     // We can subscribe to messages.
//     // Note that the callback function has two parameters: the room and the message.
//     room.onMessage((room, msg) => {
    //         console.log(`${room.name} - ${msg.sender}: ${msg.message}`);
//     });

//     // We can also subscribe to notifications of clients joining the room
//     room.onJoin((room, nickname) => {
    //        console.log(`${nickname} joined ${room.name}`);
//     });

//     // ... and leaving the room
//     room.onLeave((room, nickname) => {
    //         console.log(`${nickname} left ${room.name}`);
//     });

//     // Also to get a notification if the connection to the server is lost
//     // The client will automatically try to reconnect
//     room.onDisconnect((room) => {
    //        console.log(`Connection to server lost`);
//     });

//     // These two lines puts the functions on the global window object so
//     // so they can be called from the JavaScript console
//     window.send = function(msg) {
//         room.send(msg);
//     };
//     window.login = function(username, password) {
//         wt.login(username, password);
//     }
//     window.logout = function() {
//         wt.logout();
//     }
// };