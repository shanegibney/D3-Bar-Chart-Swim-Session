var svg = d3.select("svg"),
    margin = {
        top: 20,
        right: 60,
        bottom: 60,
        left: 40
    },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;
console.log(width);
console.log(height);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("data.json", function(data) {
    // data = info[0];
    // var parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S.%L");
    var parseTime = d3.timeParse("%Y-%m-%d %H:%M");

    data.forEach(function(d) {
            // d.date = d.date.slice(0, -3); // remove microseconds
            d.date = parseTime(d.date);
            d.end = parseTime(d.end);
            d.duration = ((d.end - d.date) / (60 * 1000)); // session duration in minutes
            console.log("duration: " + d.duration + " minutes");
            d.distance = +d.distance;
            d.intensity = (1 / (d.distance / d.duration)); // inverse of intensity so light colour low intensity and dark colour high intensity
            // d.intensity = (1/(d.distance * d.duration));
            return d;
        },
        function(error, data) {
            if (error) throw error;
        });

    var x = d3.scaleTime()
        .domain(d3.extent(data, function(d) {
            return d.date;
        }))
        .range([0, width]); // max x screen space is width - twice padding

    // var y = d3.scaleLinear()
    //     .domain([d3.min(data, function(d) {
    //         return d.distance
    //     }), d3.max(data, function(d) {
    //         return d.distance
    //     })])
    //     .range([height, 0]); // max y screen space is height - twice padding

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {
            return d.distance
        })])
        .range([height, 0]); // max y screen space is height - twice padding

    var dur = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {
            return d.duration;
        })])
        .range([0, 12]);

    var colorScale = d3.scaleSequential(d3.interpolateInferno)
        .domain([0, d3.max(data, function(d) {
            return d.intensity;
        })])

    function handleMouseOver(d) {
        d3.select(this)
            .style("fill", "lightBlue")
        g.select('text')
            .attr("x", x(d.date) + dur(d.duration + 5))
            .attr("y", y(d.distance) + 10)
            .text(d.distance + "m");

        g.select('tspan')
            .attr("x", x(d.date) + dur(d.duration + 5))
            .attr("y", y(d.distance) + 30)
            .text("blah");
        // console.log("mouseOver " + d.number);
    }

    function handleMouseOut(d) {
        d3.select(this)
            .style("fill", function(d) {
                return colorScale(d.intensity);
            });
        g.select('text').text("");
        // console.log("mouseOut " + d.number);
    }

    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .style("fill", function(d) {
            return colorScale(d.intensity);
        })
        .attr("class", "bar")
        .attr("x", function(d) {
            return x(d.date);
        })
        .attr("y", function(d) {
            return y(d.distance);
        })
        // .attr("width", x.bandwidth())
        .attr("width", function(d) {
            return dur(d.duration);
        })
        // .attr("width", 6)
        .attr("height", function(d) {
            return height - y(d.distance);
        })
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);

    g.append('text')
        .attr('x', 9)
        .attr('dy', '.35em')
        .append('tspan')
        .attr('x', 9)
        .attr('dy', '.35em');

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + (height + 5) + ")")
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%m-%d %H:%M")))
        // .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

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
});;
