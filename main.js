//main js file of the water tap web map

//setting map extent
var map= L.map("map").setView([47.80,13.05],12);

//mapbox dark basemap
var MapboxDark = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicHJhdGljaGh5YTk5IiwiYSI6ImNraDlrMmQ5djA5cHcydHBqc2p4cjNjNG8ifQ.ai1qoAYin5_OKuZRGXjBMA', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

//esri world street basemaps
var worldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1
});
//esri world imagery basemaps
var worldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1
});
//osm de basemap
var OpenStreetMap_DE = L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
	maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    tileSize: 512,
    zoomOffset: -1
});


//defining normal tap icon style
var tapIcon = L.icon({
    iconUrl: "./img/tap.png" , 
    iconSize:[30, 30]
});
//defining enlarged tap icon style
var tapIcon2 = L.icon({
    iconUrl: "./img/tap.png" , 
    iconSize:[70, 70]
});
//function for when mouse pointer is above feature
function highlightFeature(e) {
    var layer = e.target;

    layer.setIcon(tapIcon2)
}
//reset function when mouse pointer is moved away from feature
var geojson;
function resetHighlight(e) {
    var layer = e.target;

    layer.setIcon(tapIcon)
}   
             
//binding icon and pop up to the points
var salztap= L.geoJson(salztap, {
    pointToLayer: function(feature, latlng){
        return L.marker(latlng, {icon: tapIcon})
    },
    //adding popups
    onEachFeature:function (feature, layer){ 
        //call function to highlight icon when hover over it
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight
        }),
        //this function for pop up
    layer.bindPopup('<b> Identity:</b> '+ feature.properties.name + '<br>' + '<b> Water Availability: </b>'+ feature.properties.drinkingWater 
    +'<br>' + '<b> Landmarks: </b>'+ feature.properties.landmark+'<br>' + feature.properties.Image)}
});
salztap.addTo(this.map);


//adding boundary geoJSON to map
var myFedStyle = {
    "color": "#BE7D1A ",
    "weight": 3,
    "fillColor": "#F4FB03 ",
    "fillOpacity":0.05,
}

var salzBoundary= L.geoJSON(salz, {style: myFedStyle})
salzBoundary.addTo(map);

//adding north arrow
var north = L.control({position: "topright"});
north.onAdd = function(map) {
    var div = L.DomUtil.create("div", "info legend");
    div.innerHTML = '<img src="./img/northicon.png" height="30" alt="">';
    return div;
}
north.addTo(map);

// adding layer groups
var baselayers ={
    //"Open Street Map":osm,
    "Mapbox Dark Street View" :MapboxDark,
    "Open Street Map" : OpenStreetMap_DE,
    "ESRI World Street Map": worldStreetMap,
    "ESRI World Imagery" :worldImagery,
        
};
var basic={
    "Salzburg City Boundary" : salzBoundary,
    "Water Taps": salztap,
    
};

//layer controller
L.control.layers(baselayers, basic).addTo(map);

//adding scale to the map
L.control.scale({position:'bottomright',imperial:true}).addTo(map);

// map printing functionality
L.control.browserPrint().addTo(map)

//when double clicked on the map, an alert with the latitude and longitude coordinates for that location
// e is the event object that is created on mouse click but it can be annoying so turn on if needed

map.on('dblclick', function(e) {
	alert(e.latlng);
});


// adding static legend to the map
var legend = L.control({position: 'bottomleft'});
legend.onAdd = function (map) {
//defining the labels
    var div = L.DomUtil.create('div', 'info legend'),
    
        grades = ["<b>WaterTaps</b>", "<b> Salzburg City Boundary </b>"],
        labels = ["./img/tap.png","./img/boundary.png"];

    // combining the lables with its images based on the index number through looping
    div.innerHTML += '<b>Legend </b><br></br>'
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            grades[i] + (" <img src="+ labels[i] +" height='30' width='30'>") +'<br>';
    }

    return div;
};
legend.addTo(map);


 