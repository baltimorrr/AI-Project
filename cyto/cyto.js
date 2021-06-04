
let cy = cytoscape({
  container: document.getElementById("cy"), // container to render in

  style: [
    // the stylesheet for the graph
    {
      selector: "node",
      css: {
        "shape": "circle",
        'width': '45',
        'height': '45',
        "content": "data(id)",
        "color": "#e6b800",
        "background-color": "#0086b3",
        "text-wrap": "wrap",
        "text-valign": "center",
        "text-halign": "center",
        "text-transform": "uppercase",
        "border-color": "#000",
        "border-width": 3,
        "border-opacity": 0.5,
        "font-family": "sans-serif",
        "font-size": "25px",
        "font-weight": "bold",
      },
    },

    {
      selector: "edge",
      style: {
        width: 4,
        "line-color": "#c2c2a3",
        "target-arrow-color": "#c2c2a3",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier",
      },
    },
  ],

  layout: {
    name: "grid",
    rows: 1,
  },
});

function convertNodeMatrixToTree(NodeMatrix) {
  
  for (let i in NodeMatrix) {
    cy.add({
      group: "nodes",
      data: { id: i.toString() },
      position: {
        x: Math.floor(Math.random() * 700) + 100,
        y: Math.floor(Math.random() * 400) + 100,
      },
    });
  }

  for (let i in NodeMatrix) {
    for (let x of NodeMatrix[i]) {
      cy.add({
        group: "edges",
        data: {
          id: i.toString() + "_" + x.toString(),
          source: i.toString(),
          target: x.toString(),
        },
      });
    }
  }

}

convertNodeMatrixToTree(matrix);

// #b30000 // "#ffcc00", 
function changeNodeColor(no, color){
  let query = '[id = "' +  no.toString() + '"]'; 
  cy.nodes(query).style('background-color', color);
}

function changeEdgeColor(start_no, end_no, color){
  let query = '[id = "' +  start_no.toString() + "_" + end_no.toString() + '"]'; 
  console.log(query);
  let e = cy.edges(query);
  e.style('line-color', color);
  e.style('target-arrow-color',color);
}

const delay = ms => new Promise(res => setTimeout(res, ms));
console.log(cy.style);
async function bfs(NodeMatrix, start_no, goal_no){
    
    let parent_node_no = [];
    parent_node_no[start_no] = -1;
    let marked = [];

    for(let i = 0; i < 32; i++)
       marked[i] = false;
    marked[start_no] = true;
    
    let queue = [];
    queue.push(start_no);
    changeNodeColor(0, '#b30000');


    while(1){
        let crr_no = queue.shift();
        changeEdgeColor(parent_node_no[crr_no] ,crr_no,'#ffcc00');
        changeNodeColor(crr_no,'#b30000');
        if(crr_no == goal_no) 
          break;
        await delay(500);

        for(let x of NodeMatrix[crr_no]){
          if(!marked[x]){
              parent_node_no[x] = crr_no;
              queue.push(x);
              marked[x] = true;
          }
        } 
        console.log(queue);
    }

    
    let path = [];
    let crr_no = goal_no;
    while(crr_no != -1){
        path.push(crr_no);
        crr_no = parent_node_no[crr_no];
    }
    path.reverse();
    console.log(path);

    let cy1 = cytoscape({
      container: document.getElementById("cy1"),
    });
    cy1.style = cy.style;
    for(let i = 0; i < path.length; i++){
      cy1.add({
        group: "nodes",
        data: { id: path[i].toString() },
        position: {x: i*50 + 20, y: 50},
      });

      if(i != 0){
        cy1.add({
          group: "edges",
          data: {
            id: path[i-1].toString() + "_" + path[i].toString(),
            source: path[i-1].toString(),
            target: path[i].toString(),
          },
        });
      }
    }
    // return path;
}
export default cyto;