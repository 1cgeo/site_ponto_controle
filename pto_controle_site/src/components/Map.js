import * as React from 'react'
import { usePtoControle } from '../contexts/ptoControleContext'
import './css/style.css'

function Map() {

  const [map, setMap] = React.useState(null);

  const {
    data
  } = usePtoControle();


  const getHTMLPopup = (
    codPoint,
    dataTracking,
    longitude,
    latitude,
    orthoAltitude,
  ) => {
    return `
        <div class="popup">
        <table>
            <tbody>
                <tr>
                    <td><b>Código Ponto: </b></td>
                    <td>${codPoint} </td>
                </tr>
                <tr>
                    <td><b>Longitude:</b></td>
                    <td>${longitude} </td>
                </tr>
                <tr>
                    <td><b>Latitude:</b></td>
                    <td> ${latitude} </td>
                </tr>
                <tr>
                    <td><b>Data Rastreio:</b></td>
                    <td> ${dataTracking} </td>
                </tr>
                <tr>
                    <td><b>Altitude Ortométrica:</b></td>
                    <td> ${orthoAltitude} m</td>
            </tbody>
            </table>
        </div>
    `
  }

  React.useEffect(() => {
    var map = new window.maplibregl.Map({
        container: 'map',
        style:
            'https://api.maptiler.com/maps/streets/style.json?key=tLpO7P2cZG0MPIqHCFYJ',
        center: [-53.050133640018544, -26.652845315797606],
        zoom: 5

    });

    map.on('click', 'symbols', (e) => {
                    const coordinates = e.features[0].geometry.coordinates.slice();
                    const codPoint = e.features[0].properties.cod_ponto;
                    const dataTracking = e.features[0].properties.data_rastreio;
                    const longitude = coordinates[0];
                    const latitude = coordinates[1];
                    const orthoAltitude = e.features[0].properties.altitude_ortometrica;

                    // Ensure that if the map is zoomed out such that multiple
                    // copies of the feature are visible, the popup appears
                    // over the copy being pointed to.
                    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                    }

                    new window.maplibregl.Popup({
                        className: 'pop-up-style'
                    })
                      .setLngLat(coordinates)
                      .setHTML(getHTMLPopup(
                        codPoint,
                        dataTracking,
                        longitude,
                        latitude,
                        orthoAltitude,
                      ))
                      .setMaxWidth("310px")
                      .addTo(map);
                });

                map.on('click', 'symbols', (e) => {
                    map.flyTo({
                        center: e.features[0].geometry.coordinates,
                        zoom: 12
                    });
                });

                // Change the cursor to a pointer when the mouse is over the places layer.
                map.on('mouseenter', 'symbols', () => {
                    map.getCanvas().style.cursor = 'pointer';
                });

                // Change it back to a pointer when it leaves.
                map.on('mouseleave', 'symbols', () => {
                    map.getCanvas().style.cursor = '';
                });

  setMap(map)
}, []);


React.useEffect(() => {
    if(!(map && data)) return
    map.on('load', () => {

        map.loadImage(
            'https://maplibre.org/maplibre-gl-js/docs/assets/custom_marker.png',
            (error, image) => {
                if (error) throw error;
                if(!map.getImage('custom-marker')) {
                    map.addImage('custom-marker', image)
                }

                // Add a GeoJSON source with 3 points.
                if(!map.getSource('points')){
                    map.addSource('points', {
                        'type': 'geojson',
                        'data': data
                    });
                }

                if(map.getLayer('symbols')){
                    map.removeLayer('symbols')
                }
                // Add a symbol layer
                map.addLayer({
                    'id': 'symbols',
                    'type': 'symbol',
                    'source': 'points',
                    'layout': {
                        'icon-image': 'custom-marker',
                        'icon-overlap': 'always'
                    }
                });
            }
        )
    });
  }, [map, data]);

  return (
    <div
      style={{ height: '100vh', position: 'relative' }}
      id="map"
    >
    </div>
  );
}

export default Map;
