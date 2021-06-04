// Idea: Each state is considers as a node in a tree,
//       Solve the problem by finding the way from initial state to goal state with BFS
// +) Goal state: [0,0,0] -> 0 missionaries, 0 cannibals and ferry in the right side
// +) Initial state: [3,3,1] -> 3 missionaries, 0 cannibals and ferry in the left side

// Init node's states array
// [i,j,k]: 
// + i: number of missionaries in left side
// + j: number of cannibals in left side
// + k: ferry state (1: left side, 0: right side)
let NodeStateArr = [];
for(let i = 0; i <= 3; i++){
    for(let j = 0; j <= 3; j++){
        NodeStateArr.push([i,j,0]);
        NodeStateArr.push([i,j,1]);
    }
}

console.log(NodeStateArr);

// Check state if it's valid
function check(state){
     
    let missionaries_crr_side = state[0];// Number of missionaries in current side
    let cannibals_crr_side = state[1]; // Number of cannibals in current side

    let missionaries_op_side = 3-state[0];// Number of missionaries in opposite side
    let cannibals_op_side = 3-state[1]; // Number of cannibals in opposite side
    
    // Check if state of current side is valid 
    if(cannibals_crr_side > missionaries_crr_side && cannibals_crr_side != 0 && missionaries_crr_side != 0)
       return false;
    // Check if state of opposite side is valid
    if(cannibals_op_side > missionaries_op_side && cannibals_op_side != 0 && missionaries_op_side != 0)
       return false; 
    return true;
}


// Find the no. of Node by state in NodeStateArr
function findNodeByState(state){
    for(let i in NodeStateArr){
        let arr = NodeStateArr[i];
        if( arr[0] == state[0] && arr[1] == state[1] && arr[2] == state[2])
            return i;
    }
    return -1;
}

// Init Node Matrix
let NodeMatrix = [];
for(let i = 0; i < 32; i++){
    NodeMatrix[i] = [];
}

// Add Node to Node Matrix
function addNode(current_state, next_state){
    // If current state isn't valid -> don't add next_state into current_state branch
    if(check(current_state)){
        // Find the no. of Node by state in NodeStateArr
        let current_no = findNodeByState(current_state);
        let next_no = findNodeByState(next_state);
        NodeMatrix[current_no].push(next_no);
    } 
}

// Find neighbor of each state(node), then add them to NodeMatrix
for(let current_state of NodeStateArr){
    
    if(current_state[2] == 1){// ferry on the left side
            
        // Move 1 or 2 missionaries
        for(let i = 1; i <= 2 && i <= current_state[0]; i++){
            addNode(current_state, [current_state[0]-i,current_state[1], 0]);
        }

        // Move 1 or 2 cannibals
        for(let i = 1; i <= 2 && i <= current_state[1]; i++){
            addNode(current_state, [current_state[0],current_state[1]-i, 0]);
        }

        // Move 1 cannibal and 1 monster
        if(current_state[0] >= 1 && current_state[1] >= 1){
            addNode(current_state, [current_state[0]-1,current_state[1]-1,0]);
        }
    }

    else{// ferry on the right side
        // Add 1 or 2 missionaries
        for(let i = 1; i <= 2 && i <= 3-current_state[0]; i++){
            addNode(current_state, [current_state[0]+i, current_state[1], 1]);
        }

        // Add 1 or 2 cannibals
        for(let i = 1; i <= 2 && i <= 3-current_state[1]; i++){
            addNode(current_state,[current_state[0], current_state[1]+i, 1]);
        }

        // Add 1 cannibal and 1 missionary
        if(current_state[0] < 3  && current_state[1] < 3){
            let next_state = [current_state[0]+1,current_state[1]+1,1];
            addNode(current_state,next_state);
        }
    }
}

// Sort neighbor of each node in ascending order
for(let arr of NodeMatrix){
    arr.sort((a,b) => a-b);
}

console.log(NodeMatrix);

export const matrix = NodeMatrix;
export const stateArr = NodeStateArr;
