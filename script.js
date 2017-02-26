// var fileUploaded = false;
// var fileName;

function myFunction() {
    if (window.File && window.FileReader && window.FileList && window.Blob) {

    } else {
        alert('The File APIs are not fully supported in this browser.');
        return;
    }

    input = document.getElementById('test');
    if (!input) {
        alert("Um, couldn't find the fileinput element.");
    } else if (!input.files) {
        alert("This browser doesn't seem to support the `files` property of file inputs.");
    } else if (!input.files[0]) {
        alert("Please select a file before clicking 'Load'");
    } else {
        file = input.files[0];
        fileUploaded = true;
        fileName = file.name;
        console.log("file.name: " + file.name);
        console.log("file is called " + fileName);
        main();
        // console.log(num);
        // fr = new FileReader();
        // fr.onload = receivedText;
        // fr.readAsText(file);
    }

    // function receivedText() {
    //     document.getElementById('editor').appendChild(document.createTextNode(fr.result))
    // }
}

// main();

// function main() {
// console.log("fileUploaded: " + fileUploaded);
// console.log("in Main(): " + fileName);
// console.log(filename);
// d3.select("body").remove("svg");
// d3.select("#theChart").append("svg").attr("width", 1200).attr("height", 400);
var svg = d3.select("svg"),
    margin = {
        top: 20,
        right: 20,
        bottom: 180,
        left: 60
    },
    margin2 = {
        top: 540,
        right: 20,
        bottom: 70,
        left: 60
    },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    height2 = +svg.attr("height") - margin2.top - margin2.bottom;

var data = d3.json("dataDefault.json", function(data) {

    var x = d3.scaleTime()
        .domain(d3.extent(data, function(d) {
            return d.date;
        }))
        .range([0, width]); // max x screen space is width - twice padding

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {
            return d.distance
        })])
        .range([height, 0]); // max y screen space is height - twice padding


    var x2 = d3.scaleTime()
        .domain(d3.extent(data, function(d) {
            return d.date;
        }))
        .range([0, width]); // max x screen space is width - twice padding

    var y2 = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {
            return d.distance
        })])
        .range([height2, 0]); // max y screen space is height - twice padding
    // console.log("height2: " + height2);
    // console.log("svg height: " + svg.attr("height"));
    // console.log("margin2.top" + margin2.top);
    // console.log("margin2.bottom" + margin2.bottom);
    // console.log(height2 + " heights");

    // var g;

    // console.log("g: " + g[0]);

    // if (fileUploaded) {
    //     g.exit().remove();
    //     // g = svg.append("g")
    //     //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // } else {
    //     g = svg.append("g")
    //         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    // }
    // if (fileUploaded) {
    //     fileRef = fileName;
    //     console.log("OK");
    // } else {
    //     fileRef = "dataDefault.json";
    //     // fileRef = "data.json";
    // }
    // fileRef = "data.json";


    // console.log("fileRef: " + fileRef);
    // d3.json("data.json", function(data) {
    // var parseTime = d3.timeParse("%Y-%m-%d %H:%M");
    var parseTime = d3.timeParse("%Y-%m-%d %H:%M");
    var mouseoverTime = d3.timeFormat("%a %e %b %Y %H:%M");
    var minTime = d3.timeFormat("%b%e, %Y");
    var parseDate = d3.timeParse("%b %Y");

    data.forEach(function(d) {
            d.mouseoverDisplay = parseTime(d.date);
            d.date = parseTime(d.date);
            d.end = parseTime(d.end);
            d.duration = ((d.end - d.date) / (60 * 1000)); // session duration in minutes
            // console.log("duration: " + d.duration + " minutes");
            d.distance = +d.distance;
            d.intensityInverted = (1 / (d.distance / d.duration)); // inverse of intensity so that the light colour is for low intensity and dark colour is for high intensity
            d.intensity = Math.round(d.distance / d.duration); // actually intensity, metres per minute.
            d.course = d.course.toLowerCase();
            return d;
        },
        function(error, data) {
            if (error) throw error;
        });

    var total = 0;
    data.forEach(function(d) {
        total = d.distance + total;
    });

    var minDate = d3.min(data, function(d) {
        return d.date;
    });

    total = String(total).replace(/(.)(?=(\d{3})+$)/g, '$1,') //place thousands comma in total distance string



    var dur = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {
            return d.duration;
        })])
        .range([0, 12]);

    var colorScale = d3.scaleSequential(d3.interpolateInferno)
        .domain([0, d3.max(data, function(d) {
            return d.intensityInverted;
        })])

    var xAxis = d3.axisBottom(x);

    var brush = d3.brushX()
        .extent([
            [0, 0],
            [width, height2]
        ])
        .on("brush end", brushed);

    var zoom = d3.zoom()
        .scaleExtent([1, Infinity])
        .translateExtent([
            [0, 0],
            [width, height]
        ])
        .extent([
            [0, 0],
            [width, height]
        ])
        .on("zoom", zoomed);

    svg.append("defs").append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);


    var focus = svg.append("g")
        .attr("class", "focus")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var context = svg.append("g")
        .attr("class", "context")
        .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

    context.append("g")
        .attr("class", "brush")
        .call(brush)
        .call(brush.move, x.range());

    svg.append("rect")
        .attr("class", "zoom")
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .call(zoom);

    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .style("fill", function(d) {
            return colorScale(d.intensityInverted);
        })
        .attr("class", "bar")
        .attr("x", function(d) {
            return x(d.date);
        })
        .attr("y", function(d) {
            return y(d.distance);
        })
        .attr("width", function(d) {
            return dur(d.duration);
        })
        .attr("height", function(d) {
            return height - y(d.distance);
        })
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);

    g.selectAll(".bar2")
        .data(data)
        .enter().append("rect")
        // .style("fill", function(d) {
        //     return colorScale(d.intensityInverted);
        // })
        .style("fill", "grey")
        .attr("class", "bar2")
        .attr("x", function(d) {
            return x(d.date);
        })
        .attr("y", function(d) {
            return margin2.top + y2(d.distance);
        })
        // .attr("width", x.bandwidth())
        .attr("width", function(d) {
            return dur(d.duration);
        })
        // .attr("width", 6)
        .attr("height", function(d) {
            return height2 - y2(d.distance);
        });

    g.append('text')
        .attr('x', 15)
        .attr('dy', 5)
        .text("Total distance since " + minTime(minDate) + ": " + total + "m");
    // .attr("class", "shadow");

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + (height) + ")")
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%e %b %Y")))
        // .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-35)");

    // g.append("g") // second x-axis
    //     .attr("class", "axis axis--x")
    //     .attr("transform", "translate(0," + (margin2.top + height2) + ")")
    //     .call(d3.axisBottom(x2).tickFormat(d3.timeFormat("%e %b %Y")))
    //     // .call(d3.axisBottom(x))
    //     .selectAll("text")
    //     .style("text-anchor", "end")
    //     .attr("dx", "-.8em")
    //     .attr("dy", ".15em")
    //     .attr("transform", "rotate(-35)");

    g.append("g")
        .attr("class", "axis axis--y")
        // .call(d3.axisLeft(y).ticks(10, "%"))
        .call(d3.axisLeft(y).ticks(10))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("distance (m)");

});

function handleMouseOver(d) {
    d3.select(this)
        .style("fill", "lightBlue")
    g.select('text')
        .attr("x", 15)
        .attr("y", 5)
        // .attr("x", x(d.date) + dur(d.duration + 5))
        // .attr("y", y(d.distance) + 5)
        .text("Session no. " + d.number)
        .append('tspan')
        .text("Date: " + mouseoverTime(d.mouseoverDisplay))
        .attr("x", 15)
        .attr("y", 30)
        .append('tspan')
        .text("Distance: " + d.distance + "m")
        .attr("x", 15)
        .attr("y", 50)
        .append('tspan')
        .text("Duration: " + d.duration + " mins")
        .attr("x", 15)
        .attr("y", 70)
        .append('tspan')
        .text("Intensity: " + d.intensity + " meters/mins")
        .attr("x", 15)
        .attr("y", 90)
        .append('tspan')
        .text("Pool: " + d.pool + "  (" + d.course + ")")
        .attr("x", 15)
        .attr("y", 110);
}

function handleMouseOut(d) {
    d3.select(this)
        .style("fill", function(d) {
            return colorScale(d.intensityInverted);
        });
    g.select('text').text("Total distance since " + minTime(minDate) + ": " + total + "m");
    // console.log("mouseOut " + d.number);
}

function brushed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
    var s = d3.event.selection || x2.range();
    x.domain(s.map(x2.invert, x2));
    // focus.select(".area").attr("d", area);
    focus.select(".axis--x").call(xAxis);
    svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
        .scale(width / (s[1] - s[0]))
        .translate(-s[0], 0));
}

function zoomed() {
    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
    var t = d3.event.transform;
    x.domain(t.rescaleX(x2).domain());
    // focus.select(".area").attr("d", area);
    focus.select(".axis--x").call(xAxis);
    context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
}

// function type(d) {
//     d.date = parseDate(d.date);
//     d.distance = +d.distance;
//     return d;
// }

// } // end of main()
