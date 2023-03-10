
// These are the functions that create our shapes, each
// return statement gives a type (1-8)

function createLine(pointList, drawContext, addObject = true, rotation = 0){
    //draw the line, rotation defaults as 0, which causes applyRotation to do nothing
    //but otherwise will apply the current stored rotation in the object.
    var newPointList = applyRotation(pointList, rotation);
    drawContext.beginPath();
    drawContext.moveTo(newPointList[0][0], newPointList[0][1]);
    drawContext.lineTo(newPointList[1][0], newPointList[1][1]);
    if(addObject){
        var test = [];
        for(var i = 0; i < pointList.length; i++){
            test.push(vec2(pointList[i][0], pointList[i][1]));
        }
        return {type:'0', points:pointList, color:currentFill, Scale:"1", scaledPoints:test, rotation:"0", hiddenColor:selectRGB()};
    }
}

// rotation needs to be converted to radians
function createCircle(pointList, context, addObject = true, rotation = 0){
    // sqrt is used to attain radius
    radiusX = Math.sqrt(Math.pow((pointList[1][0] - pointList[0][0]), 2) + Math.pow((pointList[1][1] - pointList[0][1]), 2));
    radiusY = radiusX;
    context.beginPath();
    context.ellipse(pointList[0][0], pointList[0][1], radiusX, radiusY, (rotation * Math.PI) / 180, 0, 2 * Math.PI);

    if(addObject){
        var test = [];
        for(var i = 0; i < pointList.length; i++){
            test.push(vec2(pointList[i][0], pointList[i][1]));
        }
        return {type:"1", points:pointList, radx:radiusX, rady:radiusY, color:currentFill, Scale:"1", scaledPoints:test, rotation:"0", hiddenColor:selectRGB()};
    }
}

// rotation needs to be converted to radians
//index = 2
function createEllipse(pointList, context, addObject = true, rotation = 0){
    //
    // decides two points to be x and y where x is the furthest from the center
    if(Math.abs(pointList[1][0] - pointList[0][0]) > Math.abs(pointList[2][0] - pointList[0][0])){
        radiusX = Math.sqrt(Math.pow((pointList[1][0] - pointList[0][0]), 2));
        radiusY = Math.sqrt(Math.pow((pointList[2][1] - pointList[0][1]), 2));
    } else if(Math.abs(pointList[1][0] - pointList[0][0]) < Math.abs(pointList[2][0] - pointList[0][0])){
        radiusY = Math.sqrt(Math.pow((pointList[1][1] - pointList[0][1]), 2));
        radiusX = Math.sqrt(Math.pow((pointList[2][0] - pointList[0][0]), 2));
    } else {
        if(Math.abs(pointList[1][1] - pointList[0][1]) >= Math.abs(pointList[2][1] - pointList[0][1])){
            radiusY = Math.sqrt(Math.pow((pointList[1][1] - pointList[0][1]), 2));
            radiusX = Math.sqrt(Math.pow((pointList[2][0] - pointList[0][0]), 2));
        } else {
            radiusX = Math.sqrt(Math.pow((pointList[1][0] - pointList[0][0]), 2));
            radiusY = Math.sqrt(Math.pow((pointList[2][1] - pointList[0][1]), 2));
        }
    }
    
    context.beginPath();
    context.ellipse(pointList[0][0], pointList[0][1], radiusX, radiusY, (rotation * Math.PI) / 180, 0, 2 * Math.PI);

    if(addObject){
        var test = [];
        for(var i = 0; i < pointList.length; i++){
            test.push(vec2(pointList[i][0], pointList[i][1]));
        }
        return {type:"2", points:pointList, radx:radiusX, rady:radiusY, color:currentFill, ScaleX:"1", ScaleY:"1", scaledPoints:test, rotation:"0", hiddenColor:selectRGB()};
    }
}

//index = 3
function createRectangle(pointList, context, addObject = true, rotation = 0){
    //generate the other two points so rotate can work properly
    if(addObject){
        var newPointsList = [];
        newPointsList.push(vec2(pointList[0][0], pointList[0][1]));
        newPointsList.push(vec2(pointList[1][0], pointList[0][1]));
        newPointsList.push(vec2(pointList[1][0], pointList[1][1]));
        newPointsList.push(vec2(pointList[0][0], pointList[1][1]));

        context.beginPath();
        context.moveTo(pointList[0][0], pointList[0][1]);
        context.lineTo(pointList[1][0], pointList[0][1]);
        context.lineTo(pointList[1][0], pointList[1][1]);
        context.lineTo(pointList[0][0], pointList[1][1]);
        context.closePath();

        var test = [];
        for(var i = 0; i < newPointsList.length; i++){
            test.push(vec2(newPointsList[i][0], newPointsList[i][1]));
        }
        return {type:'3', points:newPointsList, color:currentFill, ScaleX:"1", ScaleY:"1", scaledPoints:test, rotation:"0", hiddenColor:selectRGB()};
    }
    pointList = applyRotation(pointList, rotation);
    context.beginPath();
    context.moveTo(pointList[0][0], pointList[0][1]);
    context.lineTo(pointList[1][0], pointList[1][1]);
    context.lineTo(pointList[2][0], pointList[2][1]);
    context.lineTo(pointList[3][0], pointList[3][1]);
    context.closePath();
}

//index = 4
function createPoly(){
    var context = canvas.getContext("2d");
    pointList.pop();
    for(var i = 0; i < pointList.length; i++){   
        for(var j = 0; j < (pointList.length-i-1); j++){ 
            if(pointList[j][0] > pointList[j+1][0]){ 
                var temp = pointList[j];
                pointList[j] = pointList[j + 1];
                pointList[j+1] = temp;
            }
        }
    }

    var newCenter = Math.floor(pointList.length / 4);
    for(var i = Math.floor(pointList.length / 4); i < (3 * Math.floor(pointList.length / 4)); i++){
        if(pointList[i][1] < pointList[newCenter][1]){
            newCenter = i;
        }
    }
    context.beginPath();
    context.moveTo(pointList[newCenter][0], pointList[newCenter][1]);
    
    // seperates them
    var lessXVals = [];
    var moreXVals = [];
    for(var i = 0; i < pointList.length; i++){
        if(pointList[i][0] <= pointList[newCenter][0] && i != newCenter){
            lessXVals.push(pointList[i]);
        } else if(i != newCenter) {
            moreXVals.push(pointList[i]);
        }
    }
    //sorts left values by y
    for(var i = 0; i < lessXVals.length; i++){   
        for(var j = 0; j < (lessXVals.length-i-1); j++){ 
            if(lessXVals[j][1] < lessXVals[j+1][1]){ 
                var temp = lessXVals[j];
                lessXVals[j] = lessXVals[j + 1];
                lessXVals[j+1] = temp;
            }
        }
    }
    //sorts right values by y in the opposite direction
    for(var i = 0; i < moreXVals.length; i++){   
        for(var j = 0; j < (moreXVals.length-i-1); j++){ 
            if(moreXVals[j][1] > moreXVals[j+1][1]){ 
                var temp = moreXVals[j];
                moreXVals[j] = moreXVals[j + 1];
                moreXVals[j+1] = temp;
            }
        }
    }

    // Make lines with x values
    for(var i = 0; i < moreXVals.length; i++){
        context.lineTo(moreXVals[i][0], moreXVals[i][1]);
    }

    // Make lines with less x values
    for(var i = 0; i < lessXVals.length; i++){
        context.lineTo(lessXVals[i][0], lessXVals[i][1]);
    }

    context.closePath();

    //begin converting into easy to draw object...
    //start by creating new points list that is in the correct order
    var newPoints = [vec2(pointList[newCenter])];
    for(var i = 0; i < moreXVals.length; i++){
        newPoints.push(vec2(moreXVals[i]));
    }
    for(var i = 0; i < lessXVals.length; i++){
        newPoints.push(vec2(lessXVals[i]));
    }
    var test = [];
    for(var i = 0; i < newPoints.length; i++){
        test.push(vec2(newPoints[i][0], newPoints[i][1]));
    }
    numOfType[4]++;
    polygonList.push({type:"4", points:newPoints, color:currentFill, ScaleX:"1", ScaleY:"1", scaledPoints:test, rotation:"0", hiddenColor:selectRGB()});
    // stores object type and location in the array
    drawOrder.push(vec2("Polygon", numOfType[4] - 1));
    pointList = [];
}


function redrawPoly(pointList, context, rotation = 0){
    pointList = applyRotation(pointList, rotation);
    context.beginPath();
    context.moveTo(pointList[0][0], pointList[0][1]);
    for(var i = 1; i < pointList.length; i++){
        context.lineTo(pointList[i][0], pointList[i][1]);
    }
    context.closePath();
}
function createTriangle(pointList, context, addObject = true, rotation = 0){
    //draw the Triangle to the canvas
    pointList = applyRotation(pointList, rotation);
    context.beginPath();
    context.moveTo(pointList[0][0], pointList[0][1]);
    context.lineTo(pointList[1][0], pointList[1][1]);
    context.lineTo(pointList[2][0], pointList[2][1]);
    context.closePath();

    if(addObject){
        var test = [];
        for(var i = 0; i < pointList.length; i++){
            test.push(vec2(pointList[i][0], pointList[i][1]));
        }
        return {type:'5', points:pointList, color:currentFill, ScaleX:"1", ScaleY:"1", scaledPoints:test, rotation:"0", hiddenColor:selectRGB()};
    }
}
function createCurve(pointList, context, addObject = true, rotation = 0){
    pointList = applyRotation(pointList, rotation);
    context.beginPath();
    context.moveTo(pointList[0][0], pointList[0][1]);
    context.bezierCurveTo(pointList[1][0], pointList[1][1], pointList[2][0], pointList[2][1], pointList[3][0], pointList[3][1]);

    if(addObject){
        var test = [];
        for(var i = 0; i < pointList.length; i++){
            test.push(vec2(pointList[i][0], pointList[i][1]));
        }
        return {type:"6", points:pointList, color: currentFill, ScaleX:"1", ScaleY:"1", scaledPoints:test, rotation:"0", hiddenColor:selectRGB()};
    }
}
function createSquare(pointList, context, addObject = true, rotation = 0){
    //generate the other two points so rotate can work properly
    if(addObject){
        var newPointsList = [];
        var diff = Math.abs(pointList[1][0] - pointList[0][0]);
        var corner1 = vec2(pointList[0][0] + diff, pointList[0][1] + diff);
        var corner2 = vec2(pointList[0][0] - diff, pointList[0][1] - diff);
        
        newPointsList.push(vec2(corner1[0], corner1[1]));
        newPointsList.push(vec2(corner2[0], corner1[1]));
        newPointsList.push(vec2(corner2[0], corner2[1]));
        newPointsList.push(vec2(corner1[0], corner2[1]));

        context.beginPath();
        context.moveTo(newPointsList[0][0], newPointsList[0][1]);
        context.lineTo(newPointsList[1][0], newPointsList[1][1]);
        context.lineTo(newPointsList[2][0], newPointsList[2][1]);
        context.lineTo(newPointsList[3][0], newPointsList[3][1]);
        context.closePath();

        var test = [];
        for(var i = 0; i < newPointsList.length; i++){
            test.push(vec2(newPointsList[i][0], newPointsList[i][1]));
        }
        return {type:'7', points:newPointsList, color:currentFill, Scale:"1", scaledPoints:test, rotation:"0", hiddenColor:selectRGB()};
    }
    pointList = applyRotation(pointList, rotation);
    context.beginPath();
    context.moveTo(pointList[0][0], pointList[0][1]);
    context.lineTo(pointList[1][0], pointList[1][1]);
    context.lineTo(pointList[2][0], pointList[2][1]);
    context.lineTo(pointList[3][0], pointList[3][1]);
    context.closePath();
}
function createPolyline(pointList, context, addObject = true, rotation = 0){
    pointList = applyRotation(pointList, rotation);
    context.beginPath();
    context.moveTo(pointList[0][0], pointList[0][1]);
    for(var i = 1; i < pointList.length; i++)
        context.lineTo(pointList[i][0], pointList[i][1]);
    if(addObject){
        var test = [];
        for(var i = 0; i < pointList.length; i++)
            test.push(vec2(pointList[i][0], pointList[i][1]));
        return {type:'8', points:pointList, color:currentFill, ScaleX:"1", ScaleY:"1", scaledPoints:test, rotation:"0", hiddenColor:selectRGB()};
    }
}