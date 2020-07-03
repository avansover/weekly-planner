var dataBase = []

for (j = 1; j <= 3; j++) {

    dataBase.push(JSON.parse(`{ "post${j}":[] }`))

    for (i = 1; i <= 168; i++) {

        dataBase[j - 1][`post${j}`].push({ status: 'U', id: 'none' });

    }

}

console.log(dataBase[0].post1);

var dataBaseJSON = JSON.stringify(dataBase)

console.log(dataBaseJSON);




var personalDB = [
    { id: 0, name: 'close', color: '#999999' },
    { id: 1, name: 'Am', color: '#ff0000' },
    { id: 2, name: 'Se', color: '#00ff00' },
    { id: 3, name: 'Li', color: '#0000ff' },
];



function allowDrop(ev) {
    ev.preventDefault();

    if (ev.target.className == 'endHourDiv' || ev.target.className == 'startHourDiv' || ev.target.className == 'nameDiv') {

        event.dataTransfer.dropEffect = "none";

    }

    if (ev.target.className == 'hourDiv') {

        let mrkAry = shiftDropMarkerPosition(ev.target.id);
        shiftDropMarkerCreation(mrkAry);

    }

}

function drag(ev) {

    ev.dataTransfer.setData("src", ev.target.id);

}

// function drop(ev, el) {
//     ev.preventDefault();
//     var data = ev.dataTransfer.getData("text");
//     el.appendChild(document.getElementById(data));
//   }


function drop(ev, el) {

    ev.preventDefault();

    shiftIntialStyle(ev.currentTarget);

    let src = document.getElementById(ev.dataTransfer.getData("src"));

    let test = document.getElementById(src)

    console.log(test);




    //console.log(src);

    //console.log(ev.currentTarget);

    // --- first "if" is for handeling clonning to empty cell ---
    if (src.parentNode.className == 'guardSourceDiv' && ev.currentTarget.className == 'hourDiv' && ev.currentTarget.firstElementChild == null) {

        let mrkAry = shiftDropMarkerPosition(ev.currentTarget.id);

        console.log('clone');

        let guardId = getShiftDetailsFromId(src.id);

        addShiftToDatabase(mrkAry, guardId);

        setHourStatus(dataBase);

        // --- second "if" is for handeling normal trasfer form cell to  cell ---
    } else if (src.className == 'shiftDiv' && ev.currentTarget.className == 'hourDiv' && ev.currentTarget.firstElementChild == null) {


        let mrkAry = shiftDropMarkerPosition(ev.currentTarget.id);

        console.log('transfer');

        let guardId = getShiftDetailsFromId(src.id);

        addShiftToDatabase(mrkAry, guardId);

        removeShiftFromDBalsoDelete(src.id);

        setHourStatus(dataBase);

        // --- third if is for handeling swap betwin normal cells ---
    } else if (src.className == 'shiftDiv' && ev.currentTarget.className == 'shiftDiv' && ev.currentTarget.firstElementChild != null) {


        console.log('Swap');

        swapShift(src.id, ev.target.id);

        setHourStatus(dataBase);

        // --- forth "if" is for handeling source div runnung over normal cells ---
    } else if (src.parentNode.className == 'guardSourceDiv' && ev.currentTarget.className == 'shiftDiv' && ev.currentTarget.firstElementChild != null) {

        console.log('Run Over');

        runOverShift(src.id, ev.target.id);

        setHourStatus(dataBase);

        // --- fifth "if" is for handeling delete shift when dragged into source div ---
    } else if (src.className == 'shiftDiv' && ev.currentTarget.className == 'guardSourceDiv' && ev.currentTarget.firstElementChild != null) {

        console.log('Delete');

        removeShiftFromDBalsoDelete(src.id);

        setHourStatus(dataBase);

    }

    deleteAllShiftDiv(dataBase);
    shiftPresentation(dataBase);

}

//guard pool creation

for (i = 1; i < personalDB.length; i++) {

    let guardDivBox = document.createElement("div");
    guardDivBox.id = `guard${personalDB[i].id}`;
    guardDivBox.className = 'guardsTicket';
    guardDivBox.style.borderColor = `${personalDB[i].color}`;
    guardDivBox.innerHTML = `${personalDB[i].name}`
    guardDivBox.draggable = 'true';
    guardDivBox.setAttribute('ondragstart', 'drag(event)');
    document.getElementById('guardsSourceDiv').appendChild(guardDivBox);

}

//weeklyPlanner creation
for (let j = 1; j <= 7; j++) {

    for (let post = 1; post <= dataBase.length; post++) {

        let postDivBox = document.createElement("div");
        postDivBox.id = `postBox${post}Day${j}`;
        postDivBox.className = 'postDivBox';
        document.getElementById(`day${j}ShiftDiv`).appendChild(postDivBox);

        let postNameDiv = document.createElement("div");
        postNameDiv.id = `post${post}Nameday${j}`;
        postNameDiv.className = 'postName';
        postNameDiv.innerHTML = `post${post}`;
        document.getElementById(`postBox${post}Day${j}`).appendChild(postNameDiv);

        let postDiv = document.createElement("div");
        postDiv.id = `post${post}Day${j}`;
        postDiv.className = 'postDiv';
        document.getElementById(`postBox${post}Day${j}`).appendChild(postDiv);

        for (let i = 0; i < 24; i++) {

            let hourDivBox = document.createElement("div");
            hourDivBox.id = `hourBox${(i + 1) + (j - 1) * 24}post${post}`;
            hourDivBox.className = 'hourBoxes';
            document.getElementById(`post${post}Day${j}`).appendChild(hourDivBox);

            let hourDiv = document.createElement("div");
            hourDiv.id = `post${post}Hour${(i + 1) + (j - 1) * 24}`;
            hourDiv.className = 'hourDiv';
            hourDiv.setAttribute('ondrop', 'drop(event)');
            hourDiv.setAttribute('ondragover', 'allowDrop(event)');
            hourDiv.setAttribute('ondragleave', 'shiftIntialStyle(this)');
            document.getElementById(`hourBox${(i + 1) + (j - 1) * 24}post${post}`).appendChild(hourDiv);

            let statusDiv = document.createElement("div");
            statusDiv.id = `post${post}status${(i + 1) + (j - 1) * 24}`;
            statusDiv.className = 'statuses';
            document.getElementById(`hourBox${(i + 1) + (j - 1) * 24}post${post}`).appendChild(statusDiv);

        }

    }

}




function getHeightFromElement(element) {
    let style = getComputedStyle(element);
    let height = style.height;
    let pixels = parseInt(height.slice(0, height.length - 2));
    return pixels;
}

function getWidthFromElement(element) {
    let style = getComputedStyle(element);
    let width = style.width;
    let pixels = parseInt(width.slice(0, width.length - 2));
    return pixels;
}

function getBorderFromElement(element) {
    let style = getComputedStyle(element);
    let border = style.borderWidth;
    let pixels = parseInt(border.slice(0, border.length - 2));
    return pixels;
}

function getMarginFromElement(element) {
    let style = getComputedStyle(element);
    let margin = style.margin;
    let pixels = parseInt(margin.slice(0, margin.length - 2));
    return pixels;
}


function getMidNumFromString(string) {

    for (let i = 0; i <= string.length; i++) {

        if (string.charAt(i) >= '0' && string.charAt(i) <= '9') {
            var guardNumFirstCharIndex = i;
            break;
        }

    }

    for (let i = guardNumFirstCharIndex; i <= string.length - guardNumFirstCharIndex; i++) {

        if (string.charAt(i) < '0' || string.charAt(i) > '9') {
            var guardNumLastCharIndex = i;
            break;
        }

    }

    let guardNum = parseInt(string.slice(guardNumFirstCharIndex, guardNumLastCharIndex))

    return guardNum;

}


function getLastNumFromString(string) {

    //console.log(string);

    for (let i = string.length - 1; i > 0; i--) {

        if (string.charAt(i) < '0' || string.charAt(i) > '9') {
            var guardShiftFirstCharIndex = i + 1;
            break;
        }

    }

    //console.log(guardShiftFirstCharIndex);

    let GuardShiftNum = parseInt(string.slice(guardShiftFirstCharIndex, string.length));

    //console.log(GuardShiftNum);

    return GuardShiftNum;

}

function babbleSorter(arrayForBS) {

    for (j = 0; j < arrayForBS.length - 1; j++) {
        for (i = 0; i < arrayForBS.length - 1 - j; i++) {
            if (arrayForBS[i].copy > arrayForBS[i + 1].copy) {
                let temp = arrayForBS[i]
                arrayForBS[i] = arrayForBS[i + 1]
                arrayForBS[i + 1] = temp
            }
        }
    }

    return arrayForBS

}

function idChooser(arrayForIC) {

    for (var i = 0; i < arrayForIC.length; i++) {
        //debugger
        if (i != arrayForIC[i].copy) {

            break

        }

    }

    newId = `guard${getMidNumFromString(arrayForIC[0].copyId)}Shift${i}`

    return newId

}

function removeShift(shiftNum, array) {

    for (var i = 0; i < array.length; i++) {
        if (array[i].copy == shiftNum) {
            //console.log(i);
            break
        }

    }

    array[i] = array[array.length - 1]

    array.pop()

    return array
}

function shiftDropMarkerPosition(elementId) {

    let element = document.getElementById(elementId);

    let markerDivExist = document.getElementById('markerDiv');

    let markerPositionNum = getLastNumFromString(elementId);

    //console.log(elementId);
    let postIndFrom1 = getMidNumFromString(elementId);
    //console.log(postIndFrom1);
    let hourInd1to168 = getLastNumFromString(elementId);
    //console.log(hourInd1to168);
    checkforCinDB = dataBase[postIndFrom1 - 1][`post${postIndFrom1}`][hourInd1to168 - 1]['status']
    //console.log(checkforCinDB);

    if (getLastNumFromString(document.getElementById(elementId).parentNode.id) != null) {

        let postIndex = getLastNumFromString(document.getElementById(elementId).parentNode.id)

        // --- the if is to make the marker apear just once ---
        if (markerDivExist == null) {
            //console.log(element);

            let hour1to24 = (markerPositionNum - (Math.ceil(markerPositionNum / 24) - 1) * 24)
            //console.log('hour1to24 ' + hour1to24);

            let day1to7 = Math.ceil(markerPositionNum / 24)
            //console.log('MP ' + markerPositionNum);

            if (dataBase[postIndex - 1][`post${postIndex}`][markerPositionNum - 1]['status'] == 'U') {

                for (let i = 1; i <= 3; i++) {

                    if ((hour1to24 - i) == 0 || dataBase[postIndex - 1][`post${postIndex}`][markerPositionNum - 1 - i]['status'] != 'U') {

                        break

                    }


                    var leftShiftEdge = i

                }

                // when you go out side the array
                if (leftShiftEdge == undefined) {
                    leftShiftEdge = 0
                }

                //console.log('leftShiftEdge ' + leftShiftEdge);

                for (let i = 1; i <= 4; i++) {
                    //debugger
                    if ((hour1to24 + i) == 25 || dataBase[postIndex - 1][`post${postIndex}`][markerPositionNum + i - 1]['status'] != 'U') {

                        break

                    }

                    //console.log('i ' + i);
                    var rightShiftEdge = i

                }

                if (rightShiftEdge == undefined) {
                    rightShiftEdge = 0
                }

                let shiftLength = leftShiftEdge + rightShiftEdge + 1

                if (shiftLength < 8) {

                    hoursToCheck = (8 - (leftShiftEdge + rightShiftEdge + 1))
                    //console.log('hoursToCheck ' + hoursToCheck);

                    if (leftShiftEdge == 3) {

                        //console.log('need to check to the left');

                        for (let i = 1; i <= hoursToCheck; i++) {

                            //debugger
                            if ((hour1to24 - i - 3) == 0 || dataBase[postIndex - 1][`post${postIndex}`][markerPositionNum - i - 4]['status'] != 'U') {


                                //debugger
                                console.log('there is U on the left');
                                //console.log(i);
                                var newLeftShiftEdge = i + 2

                                break

                            }

                            newLeftShiftEdge = 7 - rightShiftEdge


                        }

                        leftShiftEdge = newLeftShiftEdge

                    } else if (rightShiftEdge == 4) {

                        //console.log('need to check to the right');

                        for (let i = 1; i <= hoursToCheck; i++) {

                            if ((hour1to24 + i + 4) == 25 || dataBase[postIndex - 1][`post${postIndex}`][markerPositionNum + i + 3]['status'] != 'U') {

                                //debugger
                                console.log('there is U on the right');
                                //console.log(i);
                                var newRightShiftEdge = i + 3

                                //console.log('newRightShiftEdge ' + newRightShiftEdge);

                                break

                            }

                            newRightShiftEdge = 7 - leftShiftEdge
                            //console.log('newRightShiftEdge ' + newRightShiftEdge);

                        }

                        rightShiftEdge = newRightShiftEdge

                    }

                }

            }

            //console.log('leftShiftEdge ' + leftShiftEdge);    
            //console.log('rightShiftEdge ' + rightShiftEdge);

            var markerStart168 = markerPositionNum - leftShiftEdge
            var markerStart24 = hour1to24 - leftShiftEdge
            //console.log(markerStart168);
            var markerLength = 1 + leftShiftEdge + rightShiftEdge
            //console.log(markerLength);

        }

        let divWidth = getWidthFromElement(element)
        let divBorder = getBorderFromElement(element)
        let divMargin = getMarginFromElement(element)
        let divHeight = getHeightFromElement(element)

        // console.log(divHeight);
        // console.log(divWidth);
        // console.log(divBorder);
        // console.log(divMargin);

        let markerReturn = []

        markerReturn.push({ mrkPosNum: markerPositionNum })
        markerReturn.push({ mrkPostInd: postIndex })
        markerReturn.push({ mrkStr168: markerStart168 })
        markerReturn.push({ mrkLen: markerLength })
        markerReturn.push({ divHei: divHeight })
        markerReturn.push({ divWid: divWidth })
        markerReturn.push({ divBor: divBorder })
        markerReturn.push({ divMar: divMargin })
        markerReturn.push({ mrkStr24: markerStart24 })

        //console.log(markerReturn);

        return markerReturn

    }

}

function shiftDropMarkerCreation(markerArray) {

    let markerDivExist = document.getElementById('markerDiv');

    //console.log(markerArray);

    let checkforCInDB = dataBase[markerArray[1].mrkPostInd - 1][`post${markerArray[1].mrkPostInd}`][markerArray[0].mrkPosNum - 1]['status']

    if (markerDivExist == null) {

        //console.log(markerArray);

        markerDiv = document.createElement("div")
        markerDiv.id = 'markerDiv'
        markerDiv.style.width = `${markerArray[3].mrkLen * (markerArray[5].divWid + 2 * markerArray[7].divMar + 2 * markerArray[6].divBor) - 2}px`
        markerDiv.style.height = `${markerArray[4].divHei + markerArray[7].divMar}px`
        markerDiv.style.top = `${markerArray[7].divMar / 2}px`
        //the -2 at the end is for the marker own border
        markerDiv.style.left = `${(markerArray[8].mrkStr24 - 1) * (markerArray[5].divWid + 2 * markerArray[6].divBor + 2 * markerArray[7].divMar)}px`

        document.getElementById(`post${markerArray[1].mrkPostInd}Day${Math.ceil(markerArray[0].mrkPosNum / 24)}`).appendChild(markerDiv)

        //for dragging over a shift
        if (markerArray[2].mrkStr168 == undefined || checkforCInDB == 'C') {
            markerDiv.style.borderWidth = '0px'
        }

    }

}

function addShiftToDatabase(markerArray, grdId) {

    //console.log(markerArray);

    //console.log(grdId);

    for (i = 0; i < markerArray[3].mrkLen; i++) {

        dataBase[`${markerArray[1].mrkPostInd - 1}`][`post${markerArray[1].mrkPostInd}`][markerArray[2].mrkStr168 - 1 + i]['status'] = grdId

    }

    //take care of shift consolidating after adding a shift (deleting the old shift)


}


function shiftPresentation(dataBase) {

    //console.log(dataBase);

    for (let post = 1; post <= dataBase.length; post++) {

        for (let hour = 1; hour <= 168; hour++) {

            if (dataBase[post - 1][`post${post}`][hour - 1]['status'] != 'U') {

                //console.log(`post${post}`);
                //console.log(hour);

                var postInd = post;
                var hourInd168 = hour;
                var guardID = dataBase[post - 1][`post${post}`][hour - 1]['status'];
                var dayInd = Math.ceil(hourInd168 / 24);
                var hourInd24 = hourInd168 - (dayInd - 1) * 24;


                // console.log('postInd ' + postInd);
                // console.log('hourInd168 ' + hourInd168);
                // console.log('hourInd24 ' + hourInd24);
                // console.log('dayInd ' + dayInd);
                //console.log('guardID ' + guardID);


                var shiftLen = 0;

                while (dataBase[post - 1][`post${post}`][hour - 1]['status'] == guardID) {
                    //debugger
                    hour++;
                    shiftLen++;

                    if ((hourInd168 - 1 + shiftLen) % 24 == 0) {
                        break;
                    }

                }

                for (i = 0; i < shiftLen; i++) {

                    let id = `day${dayInd}Post${postInd}StartAt${hourInd24}For${shiftLen}`;

                    dataBase[post - 1][`post${post}`][hourInd168 + i - 1][`id`] = id;

                }

                // console.log('shift length ' + shiftLen);

                element = document.getElementById('post1Hour1');

                let divWidth = getWidthFromElement(element);
                let divBorder = getBorderFromElement(element);
                let divMargin = getMarginFromElement(element);
                let divHeight = getHeightFromElement(element);
                let divShiftBorder = '2px'




                let shiftDivExist = document.getElementById(`day${dayInd}Post${postInd}StartAt${hourInd24}For${shiftLen}`);

                //need to create closed shifts
                if (shiftDivExist == null && guardID >= 1) {

                    let shiftDiv = document.createElement("div");
                    shiftDiv.className = 'shiftDiv';
                    shiftDiv.id = `day${dayInd}Post${postInd}StartAt${hourInd24}For${shiftLen}`;
                    shiftDiv.style.borderWidth = divShiftBorder
                    shiftDivBorderInPx = parseInt(divShiftBorder.slice(0, divShiftBorder.length - 2));
                    shiftDiv.style.width = `${shiftLen * (divWidth + divBorder * 2 + divMargin * 2) - divMargin * 2 - shiftDivBorderInPx * 2}px`;
                    shiftDiv.style.height = `${divHeight - shiftDivBorderInPx}px`;
                    shiftDiv.style.borderColor = `${personalDB[guardID].color}`;
                    shiftDiv.style.top = `${divMargin}px`;
                    shiftDiv.style.left = `${(hourInd24 - 1) * (divWidth + divBorder * 2 + divMargin * 2) + divMargin}px`;
                    shiftDiv.draggable = 'true';
                    shiftDiv.setAttribute('ondragstart', 'drag(event)');
                    shiftDiv.setAttribute('ondrop', 'drop(event)');
                    shiftDiv.setAttribute('ondragover', 'allowDrop(event)');
                    document.getElementById(`post${postInd}Day${dayInd}`).appendChild(shiftDiv);

                    let leftResizer = document.createElement("div");
                    leftResizer.className = 'leftResizerDiv';
                    leftResizer.id = `day${dayInd}Post${postInd}StartAt${hourInd24}For${shiftLen}LR`;
                    leftResizer.style.width = '5px';
                    leftResizer.style.height = `${divHeight - shiftDivBorderInPx}px`;
                    leftResizer.style.backgroundColor = 'gray';
                    leftResizer.addEventListener('mousedown', resizefunctions);
                    document.getElementById(`day${dayInd}Post${postInd}StartAt${hourInd24}For${shiftLen}`).appendChild(leftResizer);

                    let startHourDiv = document.createElement("div");
                    startHourDiv.className = 'startHourDiv';
                    startHourDiv.innerHTML = `${hourInd24 + 6}:00`
                    document.getElementById(`day${dayInd}Post${postInd}StartAt${hourInd24}For${shiftLen}`).appendChild(startHourDiv);

                    let nameDiv = document.createElement("div");
                    nameDiv.className = 'nameDiv';
                    nameDiv.innerHTML = `${personalDB[guardID].name}`
                    document.getElementById(`day${dayInd}Post${postInd}StartAt${hourInd24}For${shiftLen}`).appendChild(nameDiv);

                    let endHourDiv = document.createElement("div");
                    endHourDiv.className = 'endHourDiv';
                    endHourDiv.allowDrop = 'false'
                    endHourDiv.innerHTML = `${(hourInd24 + 6 + shiftLen) % 24}:00`
                    document.getElementById(`day${dayInd}Post${postInd}StartAt${hourInd24}For${shiftLen}`).appendChild(endHourDiv);

                    let rightResizer = document.createElement("div");
                    rightResizer.className = 'rightResizerDiv';
                    rightResizer.id = `day${dayInd}Post${postInd}StartAt${hourInd24}For${shiftLen}RR`;
                    rightResizer.style.width = '5px';
                    rightResizer.style.height = `${divHeight - shiftDivBorderInPx}px`;
                    rightResizer.style.backgroundColor = 'gray';
                    rightResizer.addEventListener('mousedown', resizefunctions);
                    document.getElementById(`day${dayInd}Post${postInd}StartAt${hourInd24}For${shiftLen}`).appendChild(rightResizer);


                } else if (shiftDivExist == null && guardID == 'C') {

                    let closeShiftDiv = document.createElement("div");
                    closeShiftDiv.className = 'closeshiftDiv';
                    closeShiftDiv.id = `day${dayInd}Post${postInd}StartAt${hourInd24}For${shiftLen}`;
                    closeShiftDiv.style.borderWidth = divShiftBorder
                    closeshiftDivBorderInPx = parseInt(divShiftBorder.slice(0, divShiftBorder.length - 2));
                    closeShiftDiv.style.width = `${shiftLen * (divWidth + divBorder * 2 + divMargin * 2) - divMargin * 2 - 2 * closeshiftDivBorderInPx}px`;
                    closeShiftDiv.style.height = `${divHeight - closeshiftDivBorderInPx}px`;
                    closeShiftDiv.style.backgroundColor = `${personalDB[0].color}`;
                    closeShiftDiv.style.top = `${divMargin}px`;
                    closeShiftDiv.style.left = `${(hourInd24 - 1) * (divWidth + divBorder * 2 + divMargin * 2) + divMargin}px`;
                    closeShiftDiv.draggable = 'false'
                    document.getElementById(`post${postInd}Day${dayInd}`).appendChild(closeShiftDiv);


                }

                hour--

            }

        }

    }

    //console.log(dataBase);

}


function resizefunctions(e) {
    e.preventDefault()

    let resizerDiv = this
    element = this.parentNode

    //console.log(resizerDiv);

    window.addEventListener('mousemove', resize)
    window.addEventListener('mouseup', stopResize)

    // those 2 for helping set limit for the resize
    let postDayStart = (document.getElementById('post1Day1')).getBoundingClientRect().left
    //console.log(postDayStart);
    let postDaywidth = (document.getElementById('post1Day1')).getBoundingClientRect().width
    //console.log(postDaywidth);

    let oldWidth = element.getBoundingClientRect().width;

    let oldLeft = element.getBoundingClientRect().left;

    //console.log(element);

    function resize(eve) {

        if (resizerDiv.className == 'leftResizerDiv') {

            if (eve.pageX > postDayStart + 5 && eve.pageX < oldLeft + oldWidth) {

                element.style.left = eve.pageX - postDayStart + 'px'

                element.style.width = oldWidth + oldLeft - eve.pageX + 'px'

                //console.log(eve.pageX);

                //console.log(element.style.width);

                //console.log('Go West, what a peacefull day');

            }

        } else if (resizerDiv.className == 'rightResizerDiv') {

            if (eve.pageX < postDaywidth + postDayStart - 5) {

                element.style.width = eve.pageX - oldLeft + 'px'

                //console.log('Go East, what a peacefull day');

            }

        }

    }

    let postInd = getMidNumFromString(element.parentNode.id);
    let day1to7 = getLastNumFromString((element.parentNode.id));

    shiftDiv = document.getElementById('post1Hour1')

    let divWidth = getWidthFromElement(shiftDiv)
    let divBorder = getBorderFromElement(shiftDiv)
    let divMargin = getMarginFromElement(shiftDiv)

    let postDiv = document.getElementById('post1Day1')
    let postDivLeft = postDiv.getBoundingClientRect().left;


    let smallDivArea = divWidth + divBorder * 2 + divMargin * 2

    function stopResize() {

        // console.log('post ' + postInd);
        // console.log('day ' + day1to7);

        // console.log('oldLeft ' + oldLeft);
        // console.log('oldWidth ' + oldWidth);

        let newLeft = element.getBoundingClientRect().left;
        let newWidth = element.getBoundingClientRect().width;

        // console.log('postDivLeft ' + postDivLeft);
        // console.log('newLeft ' + newLeft);
        // console.log('newWidth ' + newWidth);
        // console.log('small div ' + smallDivArea);
        // console.log(' ');

        let hour1to168 = Math.round((oldLeft - postDivLeft) / smallDivArea + 1 + (day1to7 - 1) * 24)
        //console.log('first small div at ' + hour1to168);

        let guardNum = dataBase[postInd - 1][`post${postInd}`][hour1to168 - 1].status;
        //console.log('guardNum ' + guardNum);

        if (newLeft == oldLeft && newWidth > oldWidth) {
            //console.log('expand the right edge');

            let extraWidth = newWidth - oldWidth
            //console.log('extraWidth ' + extraWidth);

            let smallDivAmount = Math.round(oldWidth / smallDivArea)
            //console.log('amount of small divs ' + smallDivAmount);

            let divsToAdd = Math.round(extraWidth / smallDivArea)
            //console.log('small divs to add ' + divsToAdd);

            for (i = smallDivAmount; i < smallDivAmount + divsToAdd; i++) {

                dataBase[postInd - 1][`post${postInd}`][hour1to168 - 1 + i].status = guardNum

            }

        } else if (newLeft == oldLeft && newWidth < oldWidth) {
            //console.log('compress the right edge');

            let removableWidth = oldWidth - newWidth
            //console.log('removableWidth ' + removableWidth);

            let smallDivAmount = Math.round(oldWidth / smallDivArea)
            //console.log('amount of small divs ' + smallDivAmount);

            let divsToRemove = Math.round(removableWidth / smallDivArea)
            //console.log('small divs to remove ' + divsToRemove);

            // --- handling shifts that get reduced to zero length ---
            if (divsToRemove == smallDivAmount) {
                let shiftIdToRemove = document.getElementById(dataBase[postInd - 1][`post${postInd}`][hour1to168 - 1].id)
                shiftIdToRemove.parentNode.removeChild(shiftIdToRemove)

            }

            for (i = smallDivAmount - divsToRemove; i < smallDivAmount; i++) {

                dataBase[postInd - 1][`post${postInd}`][hour1to168 - 1 + i].status = 'U'
                dataBase[postInd - 1][`post${postInd}`][hour1to168 - 1 + i].id = 'none'

            }

        } else if (newLeft < oldLeft && newWidth > oldWidth) {
            //console.log('expand the left edge');

            let extraWidth = oldLeft - newLeft
            //console.log('extraWidth ' + extraWidth);

            let divsToAdd = Math.round(extraWidth / smallDivArea)
            //console.log('small divs to add ' + divsToAdd);

            for (i = 0; i < divsToAdd; i++) {

                dataBase[postInd - 1][`post${postInd}`][hour1to168 - 2 - i].status = guardNum

            }

        } else if (newLeft > oldLeft && newWidth < oldWidth) {
            //console.log('compress the left edge');

            let removableWidth = newLeft - oldLeft
            //console.log('removableWidth ' + removableWidth);

            let smallDivAmount = Math.round(oldWidth / smallDivArea)
            //console.log('amount of small divs ' + smallDivAmount);

            let divsToRemove = Math.round(removableWidth / smallDivArea)
            //console.log('small divs to remove ' + divsToRemove);

            if (divsToRemove == smallDivAmount) {
                let shiftIdToRemove = document.getElementById(dataBase[postInd - 1][`post${postInd}`][hour1to168 - 1].id)
                shiftIdToRemove.parentNode.removeChild(shiftIdToRemove)

            }

            for (i = 0; i < divsToRemove; i++) {

                dataBase[postInd - 1][`post${postInd}`][hour1to168 - 1 + i].status = 'U'
                dataBase[postInd - 1][`post${postInd}`][hour1to168 - 1 + i].id = 'none'

            }

        }

        setHourStatus(dataBase)
        deleteAllShiftDiv(dataBase)
        shiftPresentation(dataBase)

        window.removeEventListener('mousemove', resize)
        window.removeEventListener('mouseup', stopResize)

    }

}



function shiftIntialStyle(element) {

    //console.log(element.parentNode.className);

    if (element.className == 'hourDiv') {

        var markerDivExist = document.getElementById('markerDiv');

        if (markerDivExist != null) {

            markerDiv.parentNode.removeChild(markerDiv)

        }


    }


}

//console.log(dataBase[0]['post1'][0]['status']);

// var cataBase = []

// for (let j = 1; j <= gataBase.length; j++) {
//     cataBase[`postt${j}`] = []


//     for (i = 1; i <= 168; i++) {
//         cataBase[`postt${j}`].push('U')
//     }


// }

//console.log(cataBase);
// console.log(cataBase.postt1[0]);

// var bataBase = [
//     { post1: [{ status: 'U', id: 'none' }, { status: 'U', id: 'none' }, { status: 'U', id: 'none' }] },
//     { post2: [{ status: 'U', id: 'none' }, { status: 'U', id: 'none' }, { status: 'U', id: 'none' }] }

// ]

// console.log(bataBase);

// var gataBase = []

// for (j = 1; j <= gataBase.length; j++) {

//     gataBase.push(JSON.parse(`{ "post${j}":[] }`))

//     for (i = 1; i <= 168; i++) {

//         gataBase[j - 1][`post${j}`].push({ status: 'U', id: 'none' })

//     }

// }

// console.log(gataBase);
// console.log(gataBase[0].post1[0].status);
// console.log(gataBase[0]['post1'][0].status);
// console.log(gataBase[0]['post1'][0]['status']);

function setHourStatus(array) {

    dataBase[1][`post2`][11]['status'] = 'C';
    dataBase[1][`post2`][13]['status'] = 'C';
    dataBase[2][`post3`][11]['status'] = 'C';
    dataBase[2][`post3`][12]['status'] = 'C';
    dataBase[2][`post3`][13]['status'] = 'C';
    dataBase[2][`post3`][14]['status'] = 'C';
    

    for (let post = 1; post <= dataBase.length; post++) {

        for (i = 0; i < 168; i++) {

            document.getElementById(`post${post}status${i + 1}`).innerHTML = array[post - 1][`post${post}`][i]['status']

        }

    }

}

setHourStatus(dataBase)


function deleteAllShiftDiv(array) {

    //  console.log(array);

    for (i = 0; i < array.length; i++) {

        for (j = 0; j < 168; j++) {

            let id = array[i][`post${i + 1}`][j][`id`]

            let shiftDiv = document.getElementById(id)

            if (shiftDiv != null) {

                shiftDiv.parentNode.removeChild(shiftDiv)

            }

        }

    }





}


function deleteAllShiftDivForButton(array) {

    //  console.log(array);

    for (i = 0; i < array.length; i++) {

        for (j = 0; j < 168; j++) {

            let id = array[i][`post${i + 1}`][j][`id`]

            let shiftDiv = document.getElementById(id)

            if (shiftDiv != null) {

                shiftDiv.parentNode.removeChild(shiftDiv)

            }

            array[i][`post${i + 1}`][j][`id`] = 'none'
            array[i][`post${i + 1}`][j][`status`] = 'U'

        }

    }

    setHourStatus(array)

}

function getShiftDetailsFromId(id) {

    //console.log(id);

    if (id.slice(0, 3) == 'gua') {

        let guardNum = getMidNumFromString(id)

        return guardNum

    } else if (id.slice(0, 3) == 'day') {

        for (j = 1; j <= dataBase.length; j++) {

            for (i = 1; i <= 168; i++) {

                if (id == dataBase[j - 1][`post${j}`][i - 1]['id']) {

                    //last div of the shift
                    var index = i
                    var jindex = j

                }

            }

        }

        let guardNum = dataBase[jindex - 1][`post${jindex}`][index - 1]['status']

        return guardNum

    }

}

function removeShiftFromDBalsoDelete(shiftId) {

    //console.log(shiftId);

    let shift = document.getElementById(shiftId)
    shift.parentNode.removeChild(shift)

    for (j = 1; j <= dataBase.length; j++) {

        for (i = 1; i <= 168; i++) {

            if (shiftId == dataBase[j - 1][`post${j}`][i - 1]['id']) {

                dataBase[j - 1][`post${j}`][i - 1]['id'] = 'none'
                dataBase[j - 1][`post${j}`][i - 1]['status'] = 'U'

            }

        }

    }


}

function removeShiftFromDB(shiftId) {

    //console.log(shiftId);

    for (j = 1; j <= dataBase.length; j++) {

        for (i = 1; i <= 168; i++) {

            if (shiftId == dataBase[j - 1][`post${j}`][i - 1]['id']) {

                dataBase[j - 1][`post${j}`][i - 1]['id'] = 'none'
                dataBase[j - 1][`post${j}`][i - 1]['status'] = 'U'

            }

        }

    }

}

function swapShift(srcID, tgtID) {

    // console.log(srcID);
    // console.log(tgtID);
    // console.log(srcGuardId);
    // console.log(tgtGuardId);

    let srcGuardId = getShiftDetailsFromId(srcID)

    let tgtGuardId = getShiftDetailsFromId(tgtID)

    for (j = 1; j <= dataBase.length; j++) {

        for (i = 1; i <= 168; i++) {

            if (dataBase[j - 1][`post${j}`][i - 1]['id'] == srcID) {

                dataBase[j - 1][`post${j}`][i - 1]['status'] = tgtGuardId

            }

        }

    }

    for (j = 1; j <= dataBase.length; j++) {

        for (i = 1; i <= 168; i++) {

            if (dataBase[j - 1][`post${j}`][i - 1]['id'] == tgtID) {

                dataBase[j - 1][`post${j}`][i - 1]['status'] = srcGuardId

            }

        }

    }


}

function runOverShift(srcID, tgtID) {

    // console.log(srcID);
    // console.log(tgtID);

    let guardNum = getMidNumFromString(srcID)

    console.log(guardNum);

    for (j = 1; j <= dataBase.length; j++) {

        for (i = 1; i <= 168; i++) {

            if (dataBase[j - 1][`post${j}`][i - 1]['id'] == tgtID) {

                dataBase[j - 1][`post${j}`][i - 1]['status'] = guardNum

            }

        }

    }



}


shiftPresentation(dataBase)