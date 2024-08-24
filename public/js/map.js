mapboxgl.accessToken=mapToken;
console.log(listing)
const map = new mapboxgl.Map({
      container: 'map', // container ID
      style:"mapbox://styles/mapbox/satellite-streets-v12",
      center:listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
  
      zoom:11// starting zoom
  });

  const marker1 = new mapboxgl.Marker({color:"red"})
  .setLngLat(listing.geometry.coordinates)
  .setPopup(new mapboxgl.Popup().setHTML(`<h4>${listing.title}</h4><p>exact location will be provoided after booking`)) // add popup
  .addTo(map);