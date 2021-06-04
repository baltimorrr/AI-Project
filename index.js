import { matrix, stateArr } from "./NodeMatrix.js";

let cy = (window.cy = cytoscape({
  container: document.getElementById("cy"), // container to render in

  style: [
    // the stylesheet for the graph
    {
      selector: "node",
      css: {
        shape: "circle",
        width: "45",
        height: "45",
        content: "data(id)",
        color: "#e6b800",
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
}));

var json = cy.style().json();
// update the "json" object
let cy1 = cytoscape({
  container: document.getElementById("cy1"),
});
cy1.style().clear().fromJson(json).update();

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
    let node = cy.getElementById(i.toString());
    addTextToNode("cy", node, stateArr[i].toString());
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

function init(){
  cy.json({
    elements: JSON.parse(window.localStorage.getItem("elements")).elements,
  })
    .layout({
      name: "preset",
    })
    .run();
  cy.fit();
  cy.center();
  for (let i in matrix) {
    let node = cy.getElementById(i.toString());
    addTextToNode("cy", node, stateArr[i].toString());
  }
}
// init();


// #b30000 // "#ffcc00",
function changeNodeColor(no, color) {
  let query = '[id = "' + no.toString() + '"]';
  cy.nodes(query).style("background-color", color);
}

function changeEdgeColor(start_no, end_no, color) {
  let query = '[id = "' + start_no.toString() + "_" + end_no.toString() + '"]';
  console.log(query);
  let e = cy.edges(query);
  e.style("line-color", color);
  e.style("target-arrow-color", color);
}

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function bfs(NodeMatrix, start_no, goal_no) {
  let parent_node_no = [];
  parent_node_no[start_no] = -1;
  let marked = [];

  for (let i = 0; i < 32; i++) marked[i] = false;
  marked[start_no] = true;

  let queue = [];
  queue.push(start_no);
  changeNodeColor(0, "#b30000");

  while (1) {
    let crr_no = queue.shift();
    changeEdgeColor(parent_node_no[crr_no], crr_no, "#ffcc00");
    changeNodeColor(crr_no, "#b30000");
    if (crr_no == goal_no) break;
    await delay(200);

    for (let x of NodeMatrix[crr_no]) {
      if (!marked[x]) {
        parent_node_no[x] = crr_no;
        queue.push(x);
        marked[x] = true;
      }
    }
    console.log(queue);
  }

  let path = [];
  let crr_no = goal_no;
  while (crr_no != -1) {
    path.push(crr_no);
    crr_no = parent_node_no[crr_no];
  }
  path.reverse();
  console.log(path);
  drawPath(path);
}

function addTextToNode(cy, node, text) {
  let makeDiv = function (text) {
    var div = document.createElement("div");

    div.classList.add("popper-div");

    div.innerHTML = text;

    document.getElementById(cy).appendChild(div);

    return div;
  };

  let popper_i = node.popper({
    content: function () {
      return makeDiv(text);
    },
  });

  var update_i = function () {
    popper_i.update();
  };

  node.on("position", update_i);
  // cy1.on("pan zoom resize", update_i);
}

function drawPath(path) {
  for (let i = 0; i < path.length; i++) {
    cy1.add({
      group: "nodes",
      data: { id: path[i].toString() },
      position: { x: i * 100 + 50, y: 50 },
    });

    let node = cy1.getElementById(path[i].toString());
    addTextToNode("cy1", node, stateArr[path[i]].toString());

    if (i != 0) {
      cy1.add({
        group: "edges",
        data: {
          id: path[i - 1].toString() + "_" + path[i].toString(),
          source: path[i - 1].toString(),
          target: path[i].toString(),
        },
      });
    }
  }
}

document
  .querySelector(".search-bar .start-button")
  .addEventListener("click", function () {
    let path = bfs(matrix, 0, 31);
    console.log(path);
  });

document
  .querySelector(".search-bar .save-button")
  .addEventListener("click", function () {
    window.localStorage.setItem("elements", JSON.stringify(cy.json()));
  });
