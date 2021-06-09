
let background, canvas, c
let w, h, w2, h2, elements
let boat, misionary1, cannibal1, moves, textures, solution
let NodeStateId = new Map()
let NodeStateArr = []
let path = [] 
let checkPassengerState = [true, true, true, true, true, true]





function init() {
    let old = document.querySelector('canvas')
    if(old) old.remove()
   
    solution = path
    // solution = [4, 5, 0, 4, 5, 4, 0, 4, 4, 
    //     4, 6, 0, 4, 6, 4, 0, 4, 4, 
    //     1, 2, 0, 1, 2, 1, 5, 0, 1, 5, 1, 5,
    //     1, 3, 0, 1, 3, 6, 0, 6, 6,
    //     4, 5, 0, 4, 5, 1, 0, 1, 1,
    //     1, 6, 0, 1, 6]

    canvas = document.createElement('canvas')
    canvas.width = w = innerWidth
    canvas.height = h = innerHeight
    w4 = w/4
    h4 = h/4
    canvas.addEventListener('click', getElement)

    c = canvas.getContext('2d')
    document.body.appendChild(canvas)

    c.shadowColor = 'rbga(0, 0, 0, 0.5)'
    c.shadowBlur = 50

    background = c.createLinearGradient(0, 0, w, 0)
    background.addColorStop(0,'green')
	background.addColorStop(0.2,'green')
	background.addColorStop(0.27,'#654321')
	background.addColorStop(0.3,'blue')
	background.addColorStop(0.5,'#00BFFF')
	background.addColorStop(0.7,'blue')
	background.addColorStop(0.73,'#654321')
	background.addColorStop(0.8,'green')
	background.addColorStop(1,'green')
    c.fillStyle = background

    elements = []

    misionary1 = new Passenger(textures['img/misionary.png'], w2, h2, 'misionary', -1)
    misionary2 = new Passenger(textures['img/misionary.png'], w2, h2, 'misionary', 0)
    misionary3 = new Passenger(textures['img/misionary.png'], w2, h2, 'misionary', 1)
    cannibal1 = new Passenger(textures['img/cannibal.png'], w2, h2, 'cannibal', 2)
    cannibal2 = new Passenger(textures['img/cannibal.png'], w2, h2, 'cannibal', 3)
    cannibal3 = new Passenger(textures['img/cannibal.png'], w2, h2, 'cannibal', 4)
    boat = new Boat(textures['img/boat.png'])

    elements.push(boat)
    elements.push(misionary1)
    elements.push(misionary2)
    elements.push(misionary3)
    elements.push(cannibal1)
    elements.push(cannibal2)
    elements.push(cannibal3)

    let solve = {
        pos: {
            x: w-150,
            y: h-70
        },
        h: 30,
        w: 100,

        show: function() {
            c.fillStyle = 'white'
            c.fillRect(this.pos.x, this.pos.y, this.w, this.h)
            c.fillStyle = 'black'
            c.font = '1.2rem Arial'
            let text = 'Solve'
            let m = c.measureText(text)
            c.fillText(text, this.pos.x + m.width/2, this.pos.y + 20)
        },

        action: function() {
            convertMatrixIdToPath()
            init()
            //canvas.removeEventListener('click', getElement)
            solveMe()
        }
    }
    elements.push(solve)

    let stop = {
        pos: {
            x: w-150,
            y: h-120
        },
        h: 30,
        w: 100,

        show: function() {
            c.fillStyle = 'white'
            c.fillRect(this.pos.x, this.pos.y, this.w, this.h)
            c.fillStyle = 'black'
            c.font = '1.2rem Arial'
            let text = 'Stop'
            let m = c.measureText(text)
            c.fillText(text, this.pos.x + m.width, this.pos.y + 20)
        },

        
        action: function() {
            stopMe()
        }
    }

    elements.push(stop)
    draw()
}

function stopMe() {
    window.alert('Stop')
    
}

function solveMe() {
    if(solution.length > 0) {
        elements[solution.shift()].action()
        draw()
        setTimeout(solveMe, 400)
    }
}

function draw() {
    c.fillStyle = background
    c.fillRect(0, 0, w, h)

    for(let i = 0; i < elements.length; i++) {
        elements[i].show()
    }
    
    check()
}

function check() {
    
	if( misionary1.side == 3 && misionary2.side == 3 && misionary3.side == 3 
        && cannibal1.side == 3 && cannibal2.side == 3 && cannibal3.side == 3){
		gameOver('You Win');
	}
}

function gameOver(result){
	//canvas.removeEventListener('click', getElement);
	setTimeout( function(){
		canvas.addEventListener('click', function(){
            convertMatrixIdToPath()
			init();
		});
	}, 100);
	c.fillStyle = "black";
	c.font = "3rem Arial";
	c.fillText(result, (w-c.measureText(result).width)/2, 100);
}

let getElement = function(e) {
    let x = e.clientX
    let y = e.clientY

    let found = null
    for(let i = 0; i < elements.length; i++) {
        let e = elements[i]
        if(x > e.pos.x && (x < e.pos.x + e.w) && y > e.pos.y && (y < e.pos.y + e.h)){
            found = e
        }
    }

    if(found) found.action()
    draw()
}

function loadImages() {
    let total = 0
    // let imgSrc = ['img/farmer.png', 'img/farmer.png', 'img/farmer.png', 
    // 'img/wofl.png', 'img/wofl.png', 'img/wofl.png', 'img/boat.png']

    let imgSrc = ['img/misionary.png', 'img/misionary.png', 'img/misionary.png',
     'img/cannibal.png', 'img/cannibal.png', 'img/cannibal.png', 'img/boat.png']
    textures = {}
    for(name of imgSrc) {
        textures[name] = new Image()
        textures[name].src = name
        textures[name].onload = function() {
            total++
            if(total == imgSrc.length) init()
        }
    }
}



function convertMatrixIdToPath() {
    path = []
    checkPassengerState = [true, true, true, true, true, true]
    NodeStateArr = []
    NodeStateId.clear
    let matrixId = [
        [0, 5],
        [5, 2],
        [2, 7],
        [7, 4],
        [4, 21],
        [21, 10],
        [10, 27],
        [27, 24],
        [24, 29],
        [29, 20],
        [20, 31]
        // [0, 3], [0, 5], [0, 9], [0, 11],
        // [0, 17], [5, 2], [11, 8], [2, 7], 
        // [2, 13], [2, 19], [7, 4], [4, 15], 
        // [4, 21], [21, 10], [21, 12], [21, 16],
        // [21, 18], [10, 27], [27, 24], [24, 29],
        // [29, 20], [29, 26], [20, 23], [20, 31]
    ]

    for(let i = 0; i <= 3; i++){
        for(let j = 0; j <= 3; j++){
            NodeStateArr.push([i,j,0])
            NodeStateArr.push([i,j,1])
        }
    }

    for(let i = 0; i < NodeStateArr.length; i++) {
        NodeStateId[i] = NodeStateArr[i]
    }

    for(let i = 0; i < matrixId.length; i++) {
        let firstPlace = matrixId[i][0]
        let secondPlace = matrixId[i][1]

        let childPath = []
        for(let j = 0; j < 2; j++) {
            childPath.push( Math.abs( NodeStateId[secondPlace][j] - NodeStateId[firstPlace][j] ) )
        }
        childPath.push( NodeStateId[secondPlace][2] - NodeStateId[firstPlace][2] )

        if(childPath[2] === 1) { // move to right
            let numFarmer = childPath[0]
            let numWolf = childPath[1]
            let tempPath = []
            // move farmer
            if(numFarmer > 0) {
                for(let i = 0; i < 3; i++) {
                    if(checkPassengerState[i] === true && numFarmer > 0) {
                        numFarmer -= 1 
                        checkPassengerState[i] = !checkPassengerState[i]
                        path.push(i+1)
                        tempPath.push(i+1)
                    }
                }
            }
            // move wolf
            if(numWolf > 0) {
                for(let i = 3; i < 6; i++) {
                    if(checkPassengerState[i] === true && numWolf > 0) {
                        numWolf -= 1 
                        checkPassengerState[i] = !checkPassengerState[i]
                        path.push(i+1)
                        tempPath.push(i+1)
                    }
                }
            }
            // move boat
            path.push(0)
            for(let i = 0; i < tempPath.length; i++) path.push(tempPath[i])
            if(childPath === -1) for(let i = 0; i < tempPath.length; i++) path.push(tempPath[i])
        }
        else {
            let numFarmer = childPath[0]
            let numWolf = childPath[1]
            let tempPath = []
            // move farmer
            if(numFarmer > 0) {
                for(let i = 0; i < 3; i++) {
                    if(checkPassengerState[i] === false && numFarmer > 0) {
                        numFarmer -= 1 
                        checkPassengerState[i] = !checkPassengerState[i]
                        path.push(i+1)
                        tempPath.push(i+1)
                    }
                }
            }
            // move wolf
            if(numWolf > 0) {
                for(let i = 3; i < 6; i++) {
                    if(checkPassengerState[i] === false && numWolf > 0) {
                        numWolf -= 1 
                        checkPassengerState[i] = !checkPassengerState[i]
                        path.push(i+1)
                        tempPath.push(i+1)
                    }
                }
            }
            // move boat
            path.push(0)
            for(let i = 0; i < tempPath.length; i++) path.push(tempPath[i])
            //for(let i = 0; i < tempPath.length; i++) path.push(tempPath[i])
        }
        
        
    }
    console.log(path)
}




loadImages()
convertMatrixIdToPath()
//init()

window.onresize = function() {
    
    init()
    
}
