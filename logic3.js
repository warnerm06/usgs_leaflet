var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

console.log("Step A")
// Perform a GET request to the query URL

//JSON request
d3.json(queryUrl, function (data) {
    createFeatures(data.features);
});

///color picker
function color(a) {
    if (a <= 2) {
        return "#ffffb2";
    } else if (a <= 4) {
        return "#fecc5c";
    } else if (a <= 6) {
        return "#fd8d3c";
    } else if (a <= 8) {
        return "#f03b20";
    } else {
        return "#bd0026";
    }
}


var pack = []; //Set an array for layer info
function createFeatures(quakes) {

    function onEachFeature(feature, layer) {
        //This for loop pushes empty data to the array.  I beleive this is because the promise was not fulfilled. 

        layer.bindPopup("<h3>" + feature.geometry.coordinates +
            "</h3><hr><p>" + "Magnitude: " + feature.properties.mag + "</p>");
    };

     var earthquakes = L.geoJSON(quakes, {
        pointToLayer: function (feature,latlng) {
            return L.circleMarker(latlng, { radius: feature.properties.mag*5 });
        },
        style: function (feature) {
            return {
                fillColor: color(feature.properties.mag),
                fillOpacity: .8,
                weight: 1,
                color: color(feature.properties.mag)
            }
        },
        onEachFeature: onEachFeature
    });
    console.log("Step B")
    createMap(earthquakes)
}

function createMap(earthquakes) {

    console.log("Step C")
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });
    console.log("Step D")
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    console.log("Step E")
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };

    console.log("Step F")
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    console.log("pack", pack)
    var circGroup = L.layerGroup(pack);

    console.log("Step G")
    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [streetmap, earthquakes, circGroup]
    });


    console.log("Step Last");

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
    }).addTo(myMap);

/////////////////////////////legend

// Create a legend to display information about our map
var info = L.control({
    position: "bottomright"
  });
  
  // When the layer control is added, insert a div with the class of "legend"
  info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    return div;
  };
  // Add the info legend to the map
  info.addTo(myMap);
  
  // Call the updateLegend function, which will... update the legend!
  updateLegend();

  function updateLegend() {
    document.querySelector(".legend").innerHTML = [
        "<div class='my-legend'>",
            "<div class='legend-title'>Magnitude: </div>",
            "<div class='legend-scale'>",
                "<ul class='legend-labels'>",
                    "<li><span style='background:#ffffb2;'></span>0-2</li>",
                    "<li><span style='background:#fecc5c;'></span>2-4</li>",
                    "<li><span style='background:#fd8d3c;'></span>4-6</li>",
                    "<li><span style='background:#f03b20;'></span>6-8</li>",
                    "<li><span style='background:#bd0026;'></span>8-10</li>",
                "</ul>",
            "</div>",
        "</div>",

"<style type='text/css'>",
  ".my-legend .legend-title {",
    "text-align: left;",
    "margin-bottom: 5px;",
    "font-weight: bold;",
    "font-size: 90%;",
    "}",
  ".my-legend .legend-scale ul {",
    "margin: 0;",
    "margin-bottom: 5px;",
    "padding: 0;",
    "float: left;",
    "list-style: none;",
    "}",
".my-legend .legend-scale ul li {",
    "font-size: 80%;",
    "list-style: none;",
    "margin-left: 0;",
    "line-height: 18px;",
    "margin-bottom: 2px;",
    "}",
  ".my-legend ul.legend-labels li span {",
    "display: block;",
    "float: left;",
    "height: 16px;",
    "width: 30px;",
    "margin-right: 5px;",
    "margin-left: 0;",
    "border: 1px solid #999;",
    "}",
  ".my-legend .legend-source {",
    "font-size: 70%;",
    "color: #999;",
    "clear: both;",
    "}",
  ".my-legend a {",
    "color: #777;",
    "}",
"</style>"
    ].join("");
  }
////////////////////////////////////////////////////
}