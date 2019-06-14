var nationalParks = ["Acadia", "American Samoa", "Arches", "Badlands", "Big Bend", "Biscayne", "Black Canyon of the Gunnison", "Bryce Canyon", "Cabrillo", "Canyonlands", "Capitol Reef", "Carlsbad Caverns", "Channel Islands", "Congaree", "Crater Lake", "Cuyahoga Valley", "Death Valley", "Denali", "Dry Tortugas", "Everglades", "Gates of the Arctic", "Gettysburg National Military Park", "Glacier", "Glacier Bay", "Grand Canyon", "Grand Teton", "Great Basin", "Great Sand Dunes", "Great Smoky Mountains", "Guadalupe Mountains", "Haleakala", "Hawai’i Volcanoes", "Harpers Ferry", "Hot Springs", "Isle Royale", "Joshua Tree", "Katmai", "Kenai Fjords", "Kings Canyon", "Kobuk Valley", "Lake Clark", "Lassen Volcanic", "Mammoth Cave", "Mesa Verde", "Mount Rainier", "North Cascades", "Organ Pipe Cactus", "Olympic", "Petrified Forest", "Pinnacles", "Redwood", "Rocky Mountain", "Saguaro", "Sequoia", "Shenandoah", "Theodore Roosevelt", "Valley Forge", "Virgin Islands", "Voyageurs", "Wind Cave", "Wrangell–St. Elias", "Yellowstone", "Yosemite", "Zion"]

var favs = JSON.parse(localStorage.getItem("favorites"));
if (favs === null) {
    favs = [];
}

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

$(document).ready(function () {

    $('input.autocomplete').autocomplete({ source: nationalParks });
    $(".main").hide();
    $('.modal').modal();

    for (i = 0; i < (favs).length; i++) {

        console.log("hi");


        var cardContain = $("<div>");
        var card = $("<div>");
        var button = $("<button data-target='modal1' class='detail-btn waves-effect waves-light btn modal-trigger' value='" + i + "'>D E T A I L S</button>");
                    button.addClass("button");
        var name = favs[i].name;
        var description = favs[i].description;
        var weatherOverview = favs[i].weatheroverview;
        var directions = favs[i].directionsoverview;

        var latLongString = (favs[i].latLong);
        var regex = /[\d\.-]+/g;
        var latLong = latLongString.match(regex);

        var latt = latLong[0];
        var long = latLong[1];

        //var maps = (lat + ", " + long);
        var cardID = "map" + i;

        card.append("<div class='cardmap inner' id='" + cardID + "'>");
        card.append("<h5>" + name + "</h5>");
        cardContain.append("<a class='favbtn btn-floating halfway-fab waves-effect waves-light red' value='" + i + "'><i class='material-icons'>star</i></a>");
        card.append("<p>" + directions + "</p>");
        card.addClass("card shadow");
        card.append(button);

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

        var detNum;
            $(document).on("click", ".detail-btn", function () {
                detNum = parseInt($(this).attr("value"));

                var modal = $(".modal-content");
                var modalHead = $(".modal-head");
                modalHead.html("<h4>" + favs[detNum].name + "</h4><br>");
                modal.html("<p>" + favs[detNum].description + "</p><br>" + "<p>" + favs[detNum].directionsoverview + "</p><br>" + "<p>" + favs[detNum].accessibility.adainfo + "</p><br>" + "<p>" + favs[detNum].accessibility.firestovepolicy + "</p><br>" + "<p>" + favs[detNum].weatheroverview + "</p>");
            })
    }
});

$("#search").keypress((event) => {
    $(".main").show();

    if (event.keyCode === 13) {
        event.preventDefault();

        $("#card-section").empty();
        var loader = $("<img>")
        loader.addClass("loader")
        loader.attr("src", "assets/images/loader.gif")
        $("#card-section").append(loader);

        var search = $("#search").val().trim();

        var queryURL = "https://developer.nps.gov/api/v1/campgrounds?q=" + search + "&api_key=O4VdhmolNStlPLj2bo2DfPKWks3F8J9xfihpGqTf";


        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(response);


            $("#card-section").empty();

            if (response.data.length === 0) {
                var noResult = $("<h1>")
                noResult.css("font-size", "30px")
                noResult.html("No results")
                $("#card-section").append(noResult)
            } else {
                for (i = 0; i < (response.data).length; i++) {
                    var cardContain = $("<div>");
                    var card = $("<div>");
                    var button = $("<button data-target='modal1' class='detail-btn waves-effect waves-light btn modal-trigger' value='" + i + "'>D E T A I L S</button>");
                    button.addClass("button");
                    var name = response.data[i].name;
                    var directions = response.data[i].directionsoverview;
                    var latLongString = (response.data[i].latLong);

                    var regex = /[\d\.-]+/g;
                    var latLong = latLongString.match(regex);

                    var lat = latLong[0];
                    var long = latLong[1];

                    var cardID = "map" + i;

                    card.append("<div class='cardmap inner' id='" + cardID + "'>");
                    card.append("<h5>" + name + "</h5>");
                    cardContain.append("<a class='favbtn btn-floating halfway-fab waves-effect waves-light red' value='" + i + "'><i class='material-icons'>star</i></a>");
                    card.append("<p>" + directions + "</p>");
                    card.addClass("card shadow");
                    card.append(button);

                    //appending to the modal below

                    // var map;
                    // var mMap = function initMap() {
                    //      map = new google.maps.Map(document.getElementById(cardID), {
                    //         center: {lat: 39.833333, lng: -98.583333},
                    //         zoom: 4
                    //     });
                    // };

                    $("#card-section").append(card);

                    //mMap();
                    var maps = (lat + ", " + long);
                    var cardID = "map" + i;

                    // card.append("<h4>" + name + "</h4>");
                    // //card.append("<p>" + description + "</p>");
                    // card.append("<div class='cardmap' id='" + cardID + "'>");
                    // // card.append("<p>" + weatherOverview + "</p>");
                    // // card.append("<p>" + directions + "</p>");
                    // card.addClass("card");

                    cardContain.append(card);
                    $("#card-section").append(cardContain);

                    let map = new google.maps.Map(document.getElementById(cardID), {
                        center: { lat: 39.833333, lng: -98.583333 },
                        zoom: 10
                    });

                    if (latLong != null) {
                        map.setCenter({
                            lat: parseFloat(latLong[0]),
                            lng: parseFloat(latLong[1])
                        })
                        new google.maps.Marker({
                            map: map,
                            position: {
                                lat: parseFloat(latLong[0]),
                                lng: parseFloat(latLong[1])
                            }
                        });
                    } else {
                        var request = {
                            query: name,
                            fields: ['name', 'geometry'],
                        };

                        var service = new google.maps.places.PlacesService(map);
                        service.findPlaceFromQuery(request, function (results, status) {
                            console.log(status);
                            if (status === google.maps.places.PlacesServiceStatus.OK) {
                                console.log(name + " " + results[0].geometry.location.lat())
                                var place = results[0];
                                map.setCenter(place.geometry.location);
                                new google.maps.Marker({
                                    map: map,
                                    position: place.geometry.location
                                });
                            }
                        });
                        map.setZoom(11);

                    }
                }
                $(document).unbind("click", ".favbtn");

                $(document).on("click", ".favbtn", function () {
                    if (!favs.includes(response.data[$(this).attr("value")])) {
                        favs.push(response.data[$(this).attr("value")]);
                        favRef.update({
                            favList: favs
                        });
                        localStorage.setItem("favorites", JSON.stringify(favs));
                    }
                });
            }

            var detNum;
            $(document).on("click", ".detail-btn", function () {
                detNum = parseInt($(this).attr("value"));

                var modal = $(".modal-content");
                var modalHead = $(".modal-head");
                modalHead.html("<h4>" + response.data[detNum].name + "</h4><br>");
                modal.html("<p>" + response.data[detNum].description + "</p><br>" + "<p>" + response.data[detNum].directionsoverview + "</p><br>" + "<p>" + response.data[detNum].accessibility.adainfo + "</p><br>" + "<p>" + response.data[detNum].accessibility.firestovepolicy + "</p><br>" + "<p>" + response.data[detNum].weatheroverview + "</p>");
            })
        }
        )
    };
})
