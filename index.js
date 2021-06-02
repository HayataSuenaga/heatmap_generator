let selectedFile;
let fileURL;

let rowDatas;
let cellDatas = [];

let getCellDatas = () => {
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
};

let xScale;
let yScale;

// set dimensions of campus
const width = 1200;
const height = 600;
const padding = 60;

let canvas = d3.select("#canvas");
canvas.attr('width', width);
canvas.attr('height', height);

let tooltip = d3.select('#tooltip');

let getCellDimensions = () => {
  const cellWidth = (width - (2 * padding)) / (Object.keys(rowDatas[0]).length - 1);
  const cellHeight = (height - (2 * padding)) / rowDatas.length;
};

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
    .on('mouseover', (cellData) => {
      tooltip.transition()
        .style('visibility', 'visible');
      tooltip.text(`${cellData.rowKey}\n${cellData.columnKey}\n${cellData.value}`);
    })
    .on('mouseout', (cellData) => {
      tooltip.transition()
        .style('visibility', 'hidden');
    })
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

let generateHeatmap = () => {
  getCellDatas();
  getCellDimensions();
  generateScales();
  drawCells();
  drawAxes();
};

$(document).ready(() => {

  $('#save').click(() => {
    selectedFile = document.getElementById('file-input').files[0];
    fileURL = window.URL.createObjectURL(selectedFile);

    let req = new XMLHttpRequest();
    req.open('GET', fileURL, true);
    req.onload = () => {
      let object = JSON.parse(req.responseText);
      console.log(object);
      rowDatas = object;
      generateHeatmap();
    };
    req.send();
  });
});