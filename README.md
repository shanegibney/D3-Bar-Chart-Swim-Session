# D3.js Bar Chart

[gh-pages](http://shanegibney.github.io/D3-Bar-Chart-Swim-Session/)

This bar chart respresents swim sessions.

The chart graphs distance in meters against date.

The thickness of each bar depicts the duration of the session.

The colour of each bar depicts the intensity of the session. Intensity = 1/(disance/duration).

The intensity is inverted so that the most intense sessions have the darkest colours instead of the lightest.

The bar colour uses scaleSequential interpolateInferno to show the intensity of the session.

Note: d3.js v4 is not compatible with dc.js!!!

That is why this chart has not progressed beyond this point.
