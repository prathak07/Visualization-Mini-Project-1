function activatebinCount() {
  d3.select("#binCountUpdate").on("mousedown", function() {

    var div = d3.select(this)
    .classed("active", true);

    var xPos = d3.mouse(div.node())[0]
    var w = d3.select(window)
    .on("mousemove", mousemove)
    .on("mouseup", function(){
      div.classed("active", false);
      w.on("mousemove", null).on("mouseup", null);
    });

    function mousemove() {
      if(d3.mouse(div.node())[0]+3 < xPos && binCount > 1){
        binCount -= 1;
        if(currentColumn==0) fillData(array1,binCount);
        if(currentColumn==1) fillData(array2,binCount);
        if(currentColumn==2) fillData(array3,binCount);
        if(currentColumn==3) fillData(array4,binCount);
        xPos = d3.mouse(div.node())[0];
      }
      else if(d3.mouse(div.node())[0]-3 > xPos && binCount < 40){
        binCount += 1;
        if(currentColumn==0) fillData(array1,binCount);
        if(currentColumn==1) fillData(array2,binCount);
        if(currentColumn==2) fillData(array3,binCount);
        if(currentColumn==3) fillData(array4,binCount);
        xPos = d3.mouse(div.node())[0];
      }
      document.getElementById("binsCount").innerHTML = binCount;
    }
  }); 
}

function activateLengthChange() {
  d3.select("#lengthUpdate").on("mousedown", function() {
    var div = d3.select(this)
    .classed("active", true);

    var xPos = d3.mouse(div.node())[0]
    var w = d3.select(window)
    .on("mousemove", mousemove2)
    .on("mouseup", function(){
      div.classed("active", false);
      w.on("mousemove", null).on("mouseup", null);
    });

    function mousemove2() {
      if(d3.mouse(div.node())[0]+10 < xPos && edgeLength > 59){
        edgeLength -= 15;
        if(currentColumn==0) fillData(array1,binCount);
        if(currentColumn==1) fillData(array2,binCount);
        if(currentColumn==2) fillData(array3,binCount);
        if(currentColumn==3) fillData(array4,binCount);
        xPos = d3.mouse(div.node())[0];
      }
      else if(d3.mouse(div.node())[0]-10 > xPos && edgeLength < 601){
        edgeLength += 15;
        if(currentColumn==0) fillData(array1,binCount);
        if(currentColumn==1) fillData(array2,binCount);
        if(currentColumn==2) fillData(array3,binCount);
        if(currentColumn==3) fillData(array4,binCount);
        xPos = d3.mouse(div.node())[0];
      }
      document.getElementById("edgeLength").innerHTML = edgeLength;
    }
  }); 
}

function createHist(histData){

  document.getElementById("graphName").innerHTML = "Histogram";

  var margin = {top: 10, right: 10, bottom: 10, left: 10};

  var x = d3.scale.ordinal()
  .rangeRoundBands([0, w]);

  var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom")
  .ticks(10);

  var svg = d3.select("#bar")
  .append("svg")
  .attr("width", w + margin.left + margin.right)
  .attr("height", h + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var scaleHeight = (0.75*h/d3.max(histData));

  var colorScale = d3.scale.linear()
  .domain([yMin, yMax])
  .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

  svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate("+ (-0.50*barPadding) +"," + 1.005*h + ")")
  .call(xAxis);

  var bars = svg.selectAll("bar")
  .data(histData)
  .enter()
  .append("rect")
  .attr("x", function(d, i) {
    return i * (w / histData.length);
  })
  .attr("width", w / histData.length - barPadding)
  .attr("y", function(d) {
    return h - (d * scaleHeight);
  })
  .attr("height", function(d) {
    return d * scaleHeight;
  })
  .attr('fill', function(d,i){
    return colorScale(d);
  })
  .on("mouseover", function(d,i) {
    d3.select(this)
    .attr("y",d3.select(this).attr("y") - 20)
    .attr("height",parseInt(d3.select(this).attr("height")) + 20)
    .attr("x",i * (w / histData.length) - 4)
    .attr("width",w / histData.length - barPadding + 8)

    d3.selectAll("text")
    .select(function(d, j) { 
      if(j===i)
        return this;
      else 
        return null; 
    })
    .attr("fill","red")
    .attr("font-family","sans-serif")
    .style("opacity",100)

  })
  .on("mouseout", function(d,i) {
    d3.select(this)
    .attr("y",parseInt(d3.select(this).attr("y")) + 20)
    .attr("height",parseInt(d3.select(this).attr("height")) - 20)
    .attr("x",i * (w / histData.length))
    .attr("width", w / histData.length - barPadding);

    d3.selectAll("text")
    .select(function(d, j) { 
      if(j===i)
        return this;
      else 
        return null; 
    })
    .style("opacity",0)})
  .on("click",function(){
    document.getElementById("bar").innerHTML = '';
    createPie(histData);
    currentFigure = 1;
  });

  var scaleHeight = (0.77*h/d3.max(histData));
  var text = svg.selectAll("text")
  .data(histData)
  .enter()
  .append("text")
  .text(function(d) {
    return d;
  })
  .attr("text-anchor", "middle")
  .attr("x", function(d, i) {
    return i * (w / histData.length) + (w / histData.length - barPadding) / 2;
  })
  .attr("y", function(d) {
    return h-(d * scaleHeight)-30;
  })
  .attr("font-family", "sans-serif")
  .attr("font-size", 23)
  .attr("fill", "red")
  .style("opacity",0);

}

function createPie(histData){

  document.getElementById("graphName").innerHTML = "Pie Chart";

  var colorMax = 255/d3.max(histData);

  var colorScale = d3.scale.linear()
  .domain([yMin, yMax])
  .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);


  var radius = h*0.45;

  var svg = d3.select("#chart")
  .append("svg")
  .attr("width", w)
  .attr("height", h)
  .append('g')
  .attr('transform', 'translate(' + w/2 + ',' + 1.15*radius + ')');

  var pie = d3.layout.pie()
  .value(function(d) {return d;});
  var arc = d3.svg.arc()
  .outerRadius(radius)
  .innerRadius(0);

  var arc2 = d3.svg.arc()
  .innerRadius(0)
  .outerRadius(radius + 10);

  svg.selectAll("path")
  .data(pie(histData))
  .enter()
  .append("path")
  .attr("stroke", "white")
  .attr('d', arc)   
  .attr('fill', function(d,i){
    return colorScale(d.value);
  })
  .on("mouseover", function(d,i) {
    d3.select(this)
    .attr("stroke", "white")
    .attr("d", arc2)
    .attr("stroke-width", 2);

    svg.append("text")
    .attr("transform", function() {
      return "translate(" + arc.centroid(d) + ")";
    })
    .style("text-anchor", "middle")
    .attr("font-size", 23)
    .attr("class", "label")
    .attr("fill","red")
    .attr("font-family","sans-serif")
    .style("opacity",100)
    .text(parseInt(d.value));

  })
  .on("mouseout", function(d,i) {
    d3.select(this)
    .attr("d",arc)
    .attr("stroke", "white");

    svg.selectAll("text")
    .style("opacity",0);
  })
  .on("click",function(){
    document.getElementById("chart").innerHTML = '';
    createForceD(histData,edgeLength);
    currentFigure = 2 ;
  });
}

function createForceD(histData,dist) {

  document.getElementById("graphName").innerHTML = "Force Directed Graph";

  var nodes = [];

  for(var i=0;i<histData.length;i++) {
    var node = {};
    node.name = histData[i];
    nodes.push(node);
  }

  var links = [];
  for(var i=0;i<2*histData.length;i++) {
    var link = {};
    link.source = parseInt(Math.random()*histData.length);
    link.target = parseInt(Math.random()*histData.length);
    links.push(link);
  }


  var dataset = {};
  dataset.nodes = nodes;
  dataset.links = links;

  var colorScale = d3.scale.linear()
  .domain([yMin, yMax])
  .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);


  var svg = d3.select("#forceD")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

  var force = d3.layout.force()
  .links(dataset.links)
  .nodes(dataset.nodes)
  .size([w, h])
  .linkDistance([dist])        
  .charge([-200])            
  .start();

  var nodes = svg.selectAll("circle")
  .data(dataset.nodes)
  .enter()
  .append("circle")
  .attr("r", function(d) {
    return Number(d.name)*3;
  })
  .style("fill", function(d, i) {
    return colorScale(Number(d.name));
  })
  .call(force.drag)
  .on("click",function(){
    document.getElementById("forceD").innerHTML = '';
    createHist(histData);
    currentFigure = 0;
  });

  var lines = svg.selectAll("line")
  .data(dataset.links)
  .enter()
  .append("line");

  force.on("tick", function() {
    lines.attr("x1", function(d) { return d.source.x; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("y2", function(d) { return d.target.y; })
    .attr("stroke", "black");

    nodes.attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });

  });
}