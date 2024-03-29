// npm module for converting csv to json
const csv = require('scvtojson');

let selectedFile;
let fileURL;

let rowDatas;
let cellDatas;
let minValue;
let maxValue;

let xScale;
let yScale;
let valueScale;

// set dimensions of canvus
const width = 1200;
const height = 600;
const padding = 60;

let canvas = d3.select("#canvas");
canvas.attr('width', width);
canvas.attr('height', height);

let tooltip = d3.select('#tooltip');

let getCellDatas = () => {
  cellDatas = [];
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

let getRange = () => {
  minValue = d3.min(cellDatas, cellData => cellData.value);
  maxValue = d3.max(cellDatas, cellData => cellData.value);
}

let generateScales = () => {
  xScale = d3.scaleBand()
    .domain(cellDatas.map((cellData) => cellData[Object.keys(cellData)[1]]))
    .rangeRound([padding, width - padding]);

  yScale = d3.scaleBand()
    .domain(rowDatas.map((rowData) => rowData[Object.keys(rowData)[0]]))
    .rangeRound([padding, height - padding]);

  valueScale = d3.scaleSequential()
    .domain([minValue, maxValue])
    .interpolator(d3.interpolateInferno);
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
      return valueScale(cellData.value);
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
  d3.selectAll("svg > *").remove();
  getCellDatas();
  getRange();
  generateScales();
  drawAxes();
  drawCells();
};

$(document).ready(() => {
  $('#save').click(() => {
    selectedFile = document.getElementById('file-input').files[0];
    documentType = selectedFile.type.split('/').pop();
    console.log(documentType);
    fileURL = window.URL.createObjectURL(selectedFile);

    let req = new XMLHttpRequest();
    req.open('GET', fileURL, true);
    req.onload = () => {
      data = req.responseText;
      if (documentType === 'csv') {
        csv()
        .fromString(data)
        .then((json) => {
          let object = JSON.parse(data);
        rowDatas = object;
        generateHeatmap();
        });
      } else {
        let object = JSON.parse(data);
        rowDatas = object;
        generateHeatmap();
      }
    };
    req.send();
  });
});