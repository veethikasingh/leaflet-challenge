// url from usgs for earthquake to get the dataset

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

// Create the map object
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
});

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// read the json data using D3
d3.json(url).then(function (data) {

// populate the earthquake data
//define the style 
    function mapStyle(feature) {
        return {
            opacity:1,
            fillOpacity:1,
            fillColor: mapColor(feature.geometry.coordinates[2]),
            color:"black",
            radius:mapRadius(feature.properties.mag),
            stroke:true,
            weight:0.5,

        };
    }
//define function for color of earthquake for the depth

    function mapColor(depth) {

        if (depth<=10){
          colour = "lightgreen";
        }
        else if(depth<=30){
          colour = "green";
        }
        else if(depth<=50){
          colour = "yellow";
        }
        else if(depth<=70){
          colour = "orange";
        }
        else if(depth<=90){
          colour = "#3D3D3D";
        }
        else {
          colour = "#9C2BCB";
        }
        return colour;
        }
        
// define the size based on magnitude
    function mapRadius(mag) {
        if (mag === 0) {
            return 1;
        }
        return mag * 4;
    }

    // Add this earthquake data to the map with circle markers
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },

        style: mapStyle,

        // Activate pop-up data tooltip with the Magnitude, the location and depth when clicked
        onEachFeature: function (feature, layer) {
            layer.bindPopup(
            "Magnitude: " + feature.properties.mag + 
            "<br>Location: " + feature.properties.place + 
            "<br>Depth: " + feature.geometry.coordinates[2]
            );
        }
    // end of add data to the map    
    }).addTo(myMap);

// create the legend with colors to relate with depth of the earthquake
//display on bottom right

let legend = L.control({position: "bottomright"});
legend.onAdd = function() {
    
  let div = L.DomUtil.create("div", "info legend"),
  depth = [-10, 10, 30, 50, 70, 90];

  for (var i = 0; i < depth.length; i++) {
    div.innerHTML +=
    '<i style="background:' + mapColor(depth[i] + 1) + '"></i> ' 
    + depth[i] + (depth[i + 1] ? '&ndash;' 
    + depth[i + 1] + '<br>' : '+');
  }
  return div;
};
legend.addTo(myMap)
});


