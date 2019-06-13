var nationalParks = ["Acadia", "American Samoa", "Arches", "Badlands", "Big Bend", "Biscayne", "Black Canyon of the Gunnison", "Bryce Canyon", "Cabrillo", "Canyonlands", "Capitol Reef", "Carlsbad Caverns", "Channel Islands", "Congaree", "Crater Lake", "Cuyahoga Valley", "Death Valley", "Denali", "Dry Tortugas", "Everglades", "Gates of the Arctic", "Gettysburg National Military Park", "Glacier", "Glacier Bay", "Grand Canyon", "Grand Teton", "Great Basin", "Great Sand Dunes", "Great Smoky Mountains", "Guadalupe Mountains", "Haleakala", "Hawai’i Volcanoes", "Harpers Ferry", "Hot Springs", "Isle Royale", "Joshua Tree", "Katmai", "Kenai Fjords", "Kings Canyon", "Kobuk Valley", "Lake Clark", "Lassen Volcanic", "Mammoth Cave", "Mesa Verde", "Mount Rainier", "North Cascades", "Organ Pipe Cactus", "Olympic", "Petrified Forest", "Pinnacles", "Redwood", "Rocky Mountain", "Saguaro", "Sequoia", "Shenandoah", "Theodore Roosevelt", "Valley Forge", "Virgin Islands", "Voyageurs", "Wind Cave", "Wrangell–St. Elias", "Yellowstone", "Yosemite", "Zion"];

$(document).ready(function () {
    $('input.autocomplete').autocomplete({ source: nationalParks });
    $(".main").hide();
    $('.modal').modal();
});

$("#search").keypress((event) => {

    $(".main").show();

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


            for (i = 0; i < (response.data).length; i ++) {

                    var card = $("<div>");
                    var button =$("<button data-target='modal1' class='detail-btn waves-effect waves-light btn modal-trigger' value='" + i + "'>D E T A I L S</button>");
                    button.addClass("button");
                    var name = response.data[i].name;
                    var directions = response.data[i].directionsoverview;


                    var latLongString = (response.data[i].latLong);
                    var regex = /[\d\.-]+/g;
                    var latLong = latLongString.match(regex);

                    var latt = latLong[0];
                    var long = latLong[1];

                    var cardID = "map" + i;

                        card.append("<div class='cardmap inner' id='" + cardID + "'>");
                        card.append("<h5>" +name + "</h5>");
                        card.append("<p>" + directions + "</p>");
                        card.addClass("card shadow");
                        card.append(button);

                        //appending to the modal below

                        var map;
                        var mMap = function initMap() {
                             map = new google.maps.Map(document.getElementById(cardID), {
                                center: {lat: 39.833333, lng: -98.583333},
                                zoom: 4
                            });
                        };

                        $("#card-section").append(card);

                        mMap();
                        map.setCenter({
                            lat: parseFloat(latt),
                            lng: parseFloat(long),
                        });
                        map.setZoom(11);
            }

            var detNum;
            $(document).on("click", ".detail-btn", function(){
                detNum = parseInt($(this).attr("value"));

                var modal = $(".modal-content");
                var modalHead = $(".modal-head");
                modalHead.html("<h4>" + response.data[detNum].name + "</h4><br>");
                modal.html("<p>" + response.data[detNum].description + "</p><br>" + "<p>" + response.data[detNum].directionsoverview + "</p><br>" + "<p>" + response.data[detNum].accessibility.adainfo + "</p><br>" + "<p>" + response.data[detNum].accessibility.firestovepolicy + "</p><br>" +  "<p>" + response.data[detNum].weatheroverview + "</p>");
            })
        }
    )};
 })