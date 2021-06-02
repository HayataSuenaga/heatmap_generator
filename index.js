let rowDatas = [
  {
    studentName: "Harry",
    Midterm1: 89,
    Midterm2: 47,
    Midterm3: 49,
    Final: 90
  },
  {
    studentName: "Ron",
    Midterm1: 30,
    Midterm2: 4,
    Midterm3: 50,
    Final: 80
  },
  {
    studentName: "Hermione",
    Midterm1: 100,
    Midterm2: 99,
    Midterm3: 97,
    Final: 99
  },
  {
    studentName: "Draco",
    Midterm1: 78,
    Midterm2: 53,
    Midterm3: 51,
    Final: 89
  },
  {
    studentName: "Luna",
    Midterm1: 4,
    Midterm2: 34,
    Midterm3: 20,
    Final: 65
  },
  {
    studentName: "Dobby",
    Midterm1: 2,
    Midterm2: 17,
    Midterm3: 27,
    Final: 48
  },
  {
    studentName: "Narcissa",
    Midterm1: 76,
    Midterm2: 68,
    Midterm3: 56,
    Final: 93
  }
];

let cellDatas = [];

rowDatas.forEach((rowData) => {
  let keys = Object.keys(rowData);
  for (let i = 1; i < keys.length; i++) {
    let cellData = {};
    cellData.rowKey = rowData[keys[0]];
    cellData.columnKey = keys[i];
    cellData.value = rowData[keys[i]];
    cellDatas.push(cellData);
  }
});

let xScale;
let yScale;

// set dimentions of campus
const width = 1200;
const height = 600;
const padding = 60;
const cellWidth = (width - (2 * padding)) / (Object.keys(rowDatas[0]).length - 1);
const cellHeight = (height - (2 * padding)) / rowDatas.length;

let canvas = d3.select("#canvas");
canvas.attr('width', width);
canvas.attr('height', height);

let generateScales = () => {
  xScale = d3.scaleBand()
    .domain(cellDatas.map((cellData) => cellData[Object.keys(cellData)[1]]))
    .rangeRound([padding, width - padding]);

  yScale = d3.scaleBand()
    .domain(rowDatas.map((rowData) => rowData[Object.keys(rowData)[0]]))
    .rangeRound([padding, height - padding]);
};

let drawCells = () => {
  canvas.selectAll('rect')
    .data(cellDatas)
    .enter()
    .append('rect')
    .attr('class', 'cell')
    .attr('data-x', (cellData) => {
      return cellData.columnKey;
    })
    .attr('data-y', (cellData) => {
      return cellData.rowKey;
    })
    .attr('data-value', (cellData) => {
      return cellData.value;
    })
    .attr('width', xScale.bandwidth())
    .attr('height', yScale.bandwidth())
    .attr('y', (cellData) => {
      return yScale(cellData.rowKey);
    })
    .attr('x', (cellData => {
      return xScale(cellData.columnKey);
    }))
    .attr('fill', (cellData) => {
      if (cellData.value <= 25) {
        return 'Crimson';
      } else if (cellData.value <= 50) {
        return 'Orange';
      } else if (cellData.value <= 75) {
        return 'LightSteelBlue';
      } else {
        return 'SteelBlue';
      }
    });
};

let drawAxes = () => {
  let xAxis = d3.axisBottom(xScale);
  let yAxis = d3.axisLeft(yScale);

  canvas.append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr('transform', `translate(0, ${height - padding})`);

  canvas.append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform', `translate(${padding}, 0)`);
};

$(document).ready(() => {
  generateScales();
  drawCells();
  drawAxes();
});