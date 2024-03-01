
import Map from 'ol/Map.js';            // a core component of OpenLayers module 
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import TileWMS from 'ol/source/TileWMS.js';
import View from 'ol/View.js';
import TileSource from 'ol/source/Tile.js';

import MousePosition from 'ol/control/MousePosition'; // für Koordinaten mithilfe der Mausposition 
import {createStringXY} from 'ol/coordinate';   // Info um string mit den jeweiligen Koordinaten erstellen 
<<<<<<< HEAD

=======
// import { features } from 'process';
>>>>>>> fix

//  Layernamen aus JSON-Datei importieren
import jsondata from './config.json';

// Layer für die Webapplikation erstellen und lesbar speichern 
let layers: TileLayer<TileSource>[] = [];       // Array layers für die TileLayer 

layers.push(new TileLayer({
  source: new OSM(),                    // der erste Layer liegt ganz zu unterst; hier: OSM
}));

    
// Layer aus confi.json einladen 
let jsonLayernames = jsondata;
console.log(jsonLayernames); // anschauen des Layers 

let LayerArray = Object.values(jsonLayernames.layers); // array
console.log(LayerArray);

// let layerNames: string[] = []; // Array für die Ergebnisse (Inhalte als string)

for (let i = 0; i < LayerArray.length; i++) { // für jeden Eintrag des Arrays wird der Name gefiltert
  let layerConfig = LayerArray[i];            // es werden nacheinander die Positionen des Arrays aufgerufen
  let name = layerConfig.name;                // der name an der entsprechendenen Position wird gewählt
  let isVisible = layerConfig.visible !== undefined ? layerConfig.visible : false; // default: alle Layer ohne Angabe zu visible sind false = unsichtbar / (true = sichtbar)

  let newLayer = new TileLayer({
    source: new TileWMS({
    url: 'http://localhost:8080/geoserver/Umwelt-Gesundheit/wms',  
    params: {'LAYERS': name, 'TILED': true},
    serverType: 'geoserver',
    // transition: 0,
    }), 
    visible: isVisible, // Angabe zu Sichtbarkeit des Layers 
  });
  layers.push(newLayer) // werden dem Array layers hinzugefügt, die dann auf der Karte gezeigt werden 
}


// Basis Map und view 
const map = new Map({       // erstellen eines neuen Kartenobjekts mit OpenLayers
  layers: layers,           // gibt an, was der Karte hinzugefügt werden soll; Liste mit Layer-Objekten
  target: 'map',
  view: new View({          // Kartenanzeige: Zentrum der Karte, projection default: EPSG:3857
    center: [1141371, 6735169], 
    zoom: 4,        
  }),
});

// Anzeige von Koordinaten (Lokalität der Anzeige auf der Webapplikation verändern)
const targetElement = document.getElementById('mouse-position');
if (targetElement !== null) {
  const mousePositionControl = new MousePosition({      //aktuelle Mausposition 
    coordinateFormat: createStringXY(7),                // Koordinaten auf 7 Nachkommastellen 
    projection: 'EPSG:3857',
    target: targetElement,                              // Eintragen in html bei div mouse-position
  });
  map.addControl(mousePositionControl);                 // Anzeige der Koordinaten oben rechts in der Ecke 
}


// Features auf Mausklick: https://openlayers.org/en/latest/examples/getfeatureinfo-tile.html

map.on('singleclick', function (evt) {                      // map.on - Arbeiten auf der map; on ist die Methode -> zwei Argumente - vordefiniertes Event! singeclick/dblclick/click; 
                                                            //funktion mit einem Event und ist eine Callbackfunktion, weil sie erst abgerufen wird, wenn geclickt wird
  console.log(evt.coordinate)                               // Coordinaten des Events werden ausgegeben 
  const infoElement = document.getElementById('info')
  if(infoElement) {               
    infoElement.innerHTML = '';
    const viewResolution = evt.map.getView().getResolution() ?? 0;      // aktueller Kartenausschnitt und aktuelle Auflösung um den geclickten Punkt möglichst genau an GeoServer zurückzugeben
    const source = layers[7]?.getSource();                               // Quelle des Layers (auf position 1 des Arrays)
    if (source instanceof TileWMS) {                                    // sofern die Quelle TileWMS ist -> kann getFeatureInfo abgerufen werden 
      const url = source.getFeatureInfoUrl(                             // mit der Eventkoordinate, der aktuellen Auflösung/Kartenausschnitt, dem CRS und dem Format für die Ausgabe 
        evt.coordinate,
        viewResolution,
        'EPSG:3857',
        { 'INFO_FORMAT': 'application/json' }                           // am besten und einfachsten zu lesen 
      );
      console.log(url)                                                   // url zu den Features 
    if (url) {
      fetch(url)                                                          // url abrufen und den Text zurückgeben lassen also object 
        .then((response) => response.json())
        .then((responseObject) => {
          console.log(responseObject);                                   // Object anzeigen lassen 

          let fet = responseObject.features[0].properties.GRAY_INDEX;
          console.log(fet);
         
          infoElement.innerHTML = `GRAY_INDEX: ${fet}`;
        })
        .catch(error => {
          console.log('my error is ', error)                             // falls url fehlerhaft ist wird ein Fehler gemeldet 
        });
    }
    }
  }
  target: infoElement
});






  
















// Hilfe für die Namen der Layer im Geoserver, müssen dann in der config.json-Datei angepasst werden 

// import WMSCapabilities from 'ol/format/WMSCapabilities.js';    // Grundlage für diue Verwendung von speziellen Methoden von WMSCapabilities

// let parser = new WMSCapabilities();  // neues WMSCapabilities erstellen 

// fetch('http://localhost:8080/geoserver/Umwelt-Gesundheit/wms?service=WMS&version=1.3.0&request=GetCapabilities') // URL zur GetCapabilities vom GeoServer
//   .then(response => response.text())   // Antwort, wenn die xml-Datei geladen wurde, mit dem Text der xml-Datei
//   .then(responseText => {
//     let capabilities = parser.read(responseText);      // methode WMSCapabilities read 
//     let findLayers = capabilities.Capability.Layer.Layer;    // suchen im Text nach Capabilities.Layer 
    
//     for (let layer of findLayers) {  // für jedes Suchergebnis nach Name (child of Layer in the xml-file) und Ergebnis pushern in layer Name
//       layerName.push(layer.Name);
//     };
//     // console.log(layerName);   // Namen der Layer in der Console ausgeben lassen und entsprechend in config.json überarbeiten
//   })
//   .catch(error => {
//     console.log('my error is ', error)   // falls das nicht funktioniert wird ein Fehler gemeldet 
//   })

  // Ergebnis Array: Ausgabe: 27.02.24
      // let Namen: string[] = [
      //     "Agriculture_DE",
      //     "EwDichte",
      //     "Forest_DE",
      //     "Gemeindegrenzen",
      //     "Hospitals_2_dach",
      //     "Hospitals_DE",
      //     "Nationalgrenze_DE",
      //     "OSM-WMS",
      //     "R_NO2_2014",
      //     "R_NO2_2015",
      //     "R_NO2_2016",
      //     "R_NO2_2017",
      //     "R_NO2_2018",
      //     "R_NO2_2019",
      //     "R_NO2_2020",
      //     "R_NO2_2021",
      //     "R_NOx_2014",
      //     "R_NOx_2015",
      //     "R_NOx_2016",
      //     "R_NOx_2017",
      //     "R_NOx_2018",
      //     "R_NOx_2019",
      //     "R_NOx_2020",
      //     "R_NOx_2021",
      //     "R_PM10_2006",
      //     "R_PM10_2007",
      //     "R_PM10_2008",
      //     "R_PM10_2009",
      //     "R_PM10_2010",
      //     "R_PM10_2011",
      //     "R_PM10_2012",
      //     "R_PM10_2013",
      //     "R_PM10_2014",
      //     "R_PM10_2015",
      //     "R_PM10_2016",
      //     "R_PM10_2017",
      //     "R_PM10_2018",
      //     "R_PM10_2019",
      //     "R_PM10_2020",
      //     "R_PM10_2021",
      //     "R_PM25_2007",
      //     "R_PM25_2008",
      //     "R_PM25_2010",
      //     "R_PM25_2011",
      //     "R_PM25_2012",
      //     "R_PM25_2013",
      //     "R_PM25_2014",
      //     "R_PM25_2015",
      //     "R_PM25_2016",
      //     "R_PM25_2017",
      //     "R_PM25_2018",
      //     "R_PM25_2019",
      //     "R_PM25_2020",
      //     "R_PM25_2021",
      //     "TravelTime",
      //     "V_CO_2021",
      //     "V_NO2_2021",
      //     "V_O3_2021",
      //     "V_PM10_2021",
      //     "V_PM2.5_2021",
      //     "V_SO2_2021",
      //     "Water_bodies_DE",
      //     "Wetlands_DE"
      //   ] 
  





// let layerName: string[] = []; // soll ein string sein --> Namen der Layer fehlen 
// let resultLayers = [];

// for (let name of layerName){
//   let newLayer = new TileLayer({
//     source: new TileWMS({
//       url: 'http://localhost:8080/geoserver/Umwelt-Gesundheit/wms',  
//       params: {'LAYERS': name, 'TILED': true},
//       serverType: 'geoserver',
//       transition: 0,
//     }),
//   })
//   resultLayers.push(newLayer)
// }
