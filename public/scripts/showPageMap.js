
mapboxgl.accessToken=mapToken;

const map=new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campsite.geometry.coordinates, // starting position [lng, lat]
    zoom: 13 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());


new mapboxgl.Marker()
    .setLngLat(campsite.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25, closeButton: false })
            .setHTML(
                `<h6>${campsite.title}</h6> <p> ${campsite.location}`)
    )
    .addTo(map)
