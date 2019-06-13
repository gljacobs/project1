var nationalParks = ["Acadia", "American Samoa", "Arches", "Badlands", "Big Bend", "Biscayne", "Black Canyon of the Gunnison", "Bryce Canyon", "Cabrillo", "Canyonlands", "Capitol Reef", "Carlsbad Caverns", "Channel Islands", "Congaree", "Crater Lake", "Cuyahoga Valley", "Death Valley", "Denali", "Dry Tortugas", "Everglades", "Gates of the Arctic", "Gettysburg National Military Park", "Glacier", "Glacier Bay", "Grand Canyon", "Grand Teton", "Great Basin", "Great Sand Dunes", "Great Smoky Mountains", "Guadalupe Mountains", "Haleakala", "Hawai’i Volcanoes", "Harpers Ferry", "Hot Springs", "Isle Royale", "Joshua Tree", "Katmai", "Kenai Fjords", "Kings Canyon", "Kobuk Valley", "Lake Clark", "Lassen Volcanic", "Mammoth Cave", "Mesa Verde", "Mount Rainier", "North Cascades", "Organ Pipe Cactus", "Olympic", "Petrified Forest", "Pinnacles", "Redwood", "Rocky Mountain", "Saguaro", "Sequoia", "Shenandoah", "Theodore Roosevelt", "Valley Forge", "Virgin Islands", "Voyageurs", "Wind Cave", "Wrangell–St. Elias", "Yellowstone", "Yosemite", "Zion"];

var favs = [];

var firebaseConfig = {
    apiKey: "AIzaSyCZTmTDkhXCk3A1j8gk1_k8ZWB7U_4OUS4",
    authDomain: "campdad-45b93.firebaseapp.com",
    databaseURL: "https://campdad-45b93.firebaseio.com",
    projectId: "campdad-45b93",
    storageBucket: "campdad-45b93.appspot.com",
    messagingSenderId: "1049638764665",
    appId: "1:1049638764665:web:b573d4a64784d164"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

favRef = database.ref("/favorites");

favRef.set({favList: favs});


$(document).ready(function () {
    $('input.autocomplete').autocomplete({ source: nationalParks });
});

$("#search").keypress((event) => {

    $("#card-section").empty();

    if (event.keyCode === 13) {

        event.preventDefault();

        var search = $("#search").val().trim();
        var queryURL = "https://developer.nps.gov/api/v1/campgrounds?q=" + search + "&api_key=O4VdhmolNStlPLj2bo2DfPKWks3F8J9xfihpGqTf";

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);

            for (i = 0; i < (response.data).length; i++) {

                var cardContain = $("<div>");
                var card = $("<div>");
                var name = response.data[i].name;
                var description = response.data[i].description;
                var weatherOverview = response.data[i].weatheroverview;
                var directions = response.data[i].directionsoverview;

                var latLongString = (response.data[i].latLong);
                var regex = /[\d\.-]+/g;
                var latLong = latLongString.match(regex);

                var latt = latLong[0];
                var long = latLong[1];

                //var maps = (lat + ", " + long);
                var cardID = "map" + i;

                card.append("<h4>" + name + "</h4>");
                cardContain.append("<a class='favbtn btn-floating halfway-fab waves-effect waves-light red' value='" + i +"'><i class='material-icons'>star_border</i></a>");
                card.append("<div class='cardmap' id='" + cardID + "'>");
                // card.append("<p>" + weatherOverview + "</p>");
                // card.append("<p>" + directions + "</p>");
                card.addClass("card");

                var map;
                var mMap = function initMap() {
                    map = new google.maps.Map(document.getElementById(cardID), {
                        center: { lat: 39.833333, lng: -98.583333 },
                        zoom: 4
                    });
                };

                cardContain.append(card)
                $("#card-section").append(cardContain);
                mMap();
                map.setCenter({
                    lat: parseFloat(latt),
                    lng: parseFloat(long),
                });
                map.setZoom(11);
            }

            $(document).unbind("click", ".favbtn");

            
            $(document).on("click", ".favbtn", function() {    
                if(!favs.includes(response.data[$(this).attr("value")]))favs.push(response.data[$(this).attr("value")]);
                favRef.update({
                    favList: favs
                })
            });
        });
    };
});



