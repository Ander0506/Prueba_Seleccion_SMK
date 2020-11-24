let map,
    infoWindow,
    service,
    geocoder,
    ciudad,
    departamento,
    pais;

//Iniciamos el mapa
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: {
            lat: 4.570868,
            lng: -74.297333
        },
        zoom: 4,
    });
    geocoder = new google.maps.Geocoder;
    infoWindow = new google.maps.InfoWindow();
    const locationButton = document.getElementById("my_location");
    //    asignamos el evento click al boton especificado
    locationButton.addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    infoWindow.setPosition(pos);
                    infoWindow.setContent("Posición encontrada");
                    infoWindow.open(map);
                    map.setCenter(pos);
                    map.setZoom(14);
                    //                  variable constante para ubicar cafes cerca
                    const request = {
                        location: pos,
                        radius: 5000,
                        types: ['cafe']
                    };
                    let marker = new google.maps.Marker({
                        map: map,
                        position: pos,
                    });
                    geocoder.geocode({
                        'location': pos
                    }, function (results, status) {
                        if (status === google.maps.GeocoderStatus.OK) {
                            if (results[1]) {
                                let dir = results[1].formatted_address.split(',', 4);
                                ciudad = dir[1];
                                departamento = dir[2];
                                pais = dir[3];
                                let dirDescrip = ciudad +', '+ departamento +', '+ pais;
                                document.getElementById("location").innerHTML = dirDescrip;
                                clima(ciudad);
                            }
                        }
                    })
                    servicePlace(request, map);
                },
                () => {
                    handleLocationError(true, infoWindow, map.getCenter());
                }
            );
        } else {
            handleLocationError(false, infoWindow, map.getCenter());
        }
    });
}



//Servicio para ubicar plazas cercanas de el lugar especificado
function servicePlace(request, map) {
    service = new google.maps.places.PlacesService(map);

    service.nearbySearch(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                crearMarcador(results[i]);
            }
        }
    });
}

function crearMarcador(place) {
    // Creamos un marcador
    let marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        icon: './img/icon/Icon_Cafe.png'
    });

    // Asignamos el evento click del marcador
    google.maps.event.addListener(marker, 'click', function () {
        infoWindow.setContent(place.name);
        infoWindow.open(map, this);
        map.setCenter(place.geometry.location);
        map.setZoom(20);
    });
}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation ?
        "Error: The Geolocation service failed." :
        "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
}

function clima(){
    
const apiKey = "0a78d35da9509909667aa8454a4b08ba";    
const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&lang=es&appid=${apiKey}&units=metric`;
    
  axios.get(url)
     .then(response => {
      if (response){
          let res = response.data.main;
          document.getElementById("temp").innerHTML = res.temp+'°';
          document.getElementById("hum").innerHTML = res.humidity+'%';
          res = response.data.weather[0];
          document.getElementById("Descrip").innerHTML = res.description;
          return console.log(response.data)
      }
  })
}

