// Component Layers

// notwendige Imports:
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import TileSource from 'ol/source/Tile.js';
import TileWMS from 'ol/source/TileWMS.js';

//  Layernamen aus JSON-Datei importieren
import jsondata from '/home/khoeller/Dokumente/OpenLayers/conf/config.json';

// import style 
import './LayerN.css'; // nicht notwendig? 

export default function Layers () {
// LayerArray für die Webapplikation erstellen und lesbar speichern 
    let layers: TileLayer<TileSource>[] = [];       

    layers.push(new TileLayer({
    source: new OSM(),                    // der erste Layer liegt ganz zu unterst; hier: OSM
    }));

    // const jsonLayer = jsondata; // nicht notwendig?!

    let LayerArray = Object.values(jsondata.layers); // array
    // console.log(LayerArray);

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
            // layers ist ein Array mit Objekten zu jedem Layer aus dem Geoserver inklusive visible

    } 
    
    return layers; 
    
}

