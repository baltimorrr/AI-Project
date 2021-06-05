
let matrixId = [
    [0, 3],
    [0, 5],
    [0, 9],
    [0, 11],
    [0, 17],
    [5, 2],
    [11, 8],
    [2, 7],
    [2, 13],
    [2, 19],
    [7, 4],
    [4, 15],
    [4, 21],
    [21, 10],
    [21, 12],
    [21, 16],
    [21, 18],
    [10, 27],
    [27, 24],
    [24, 29],
    [29, 20],
    [29, 26],
    [20, 23],
    [20, 31]
]

let matrixId = [
    [0, 3],

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
]

console.log(matrixId)
let NodeStateArr = [];

for(let i = 0; i <= 3; i++){
    for(let j = 0; j <= 3; j++){
        NodeStateArr.push([i,j,0]);
        NodeStateArr.push([i,j,1]);
    }
}

let NodeStateId = new Map()

for(let i = 0; i < NodeStateArr.length; i++) {
    NodeStateId[i] = NodeStateArr[i]
}

console.log(NodeStateId[2][1])

