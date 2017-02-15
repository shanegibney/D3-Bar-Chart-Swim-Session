# D3.js Bar Chart

[gh-pages](http://shanegibney.github.io/D3-Bar-Chart-Swim-Session/)

This bar chart respresents swim sessions.

The chart graphs distance in meters against date.

The thickness of each bar depicts the duration of the session.

The colour of each bar depicts the intensity of the session. Intensity = 1/(disance/duration).

The intensity is inverted so that the most intense sessions have the darkest colours instead of the lightest.

The bar colour uses scaleSequential interpolateInferno to show the intensity of the session.

# TO DO

1. Add form to allow a user upload a json file, in the correct format.

Load this file to browser cache and from there use it to populate graph.

Therefore no need for a backend DB.

2. Replace hard coded date in total distance with min(d.date), so that it will always get the earliest date from any set of date.

3. Originally I wanted a pie chart, each segment of which would be days of the week.

Using dc.js and crossfilter, make this interactive with the bar chart. This would require rewriting this code with d3.js v3.

Note: d3.js v4 is not compatible with dc.js!!!

That is why this chart has not progressed beyond this point.
