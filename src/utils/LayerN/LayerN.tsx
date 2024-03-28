// // Layers

// Arbeit mit groups: funktioniert noch nicht!
        // notwendige Imports:
    import OSM from 'ol/source/OSM.js';
    import TileLayer from 'ol/layer/Tile.js';
    import TileSource from 'ol/source/Tile.js';
    import TileWMS from 'ol/source/TileWMS.js';

    //  Layernamen aus JSON-Datei importieren
    import jsondata from '../../../conf/config.json'; //  

    export default function Layers() {
        let layers:any = []; // Array für die Webapplikation erstellen und lesbar speichern
    
        let osmLayer = new TileLayer({              // OSM-Layer erstellen als BasisKarte
            source: new OSM(),
            
        });

        osmLayer.set('name', 'osm');                // zum Layer Informationen wie Name, Title, Visibility hinzufügen 
        osmLayer.set('title', 'OpenStreetMap');
        osmLayer.set('visible', true);
        
        layers.push(osmLayer)
            

        const groups = jsondata.groups; // Gruppen aus der JSON-Datei
        
    
        // Für jede Gruppe in der Konfiguration
        groups.forEach(group => {

            const groupName = group.groupName;
            const info = group.info !== undefined ? group.info: false;
            const infoTextTitle = group.infoTextTitle !== undefined ? group.infoTextTitle : 'undefined';
            const infoText = group.infoText !== undefined ? group.infoText : 'undefined';
            const enabeleSlider = group.enableSlider !== undefined ? group.enableSlider : false;

            // Für jeden Layer in der Gruppe
            group.layers.forEach(layerConfig => {
                const name = layerConfig.name;
                const isVisible = layerConfig.visible !== undefined ? layerConfig.visible : false;
                const isQueryable = layerConfig.queryable !== undefined ? layerConfig.queryable : false;
                const title = layerConfig.title;
                const url = layerConfig.url || 'http://localhost:8080/geoserver/Umwelt-Gesundheit/wms';
                const year = layerConfig.year !== undefined ? layerConfig.year : false;
                const layerType = layerConfig.layerType;
                
    
                let newLayer = new TileLayer({
                    source: new TileWMS({
                        url: url,
                        params: { 'LAYERS': name },
                    }),
                    visible: isVisible,
                });
    
                newLayer.set('name', name);
                newLayer.set('queryable', isQueryable);
                newLayer.set('title', title);
                newLayer.set('groupName', groupName);
                newLayer.set('info', info);
                newLayer.set('infoTextTitle', infoTextTitle);
                newLayer.set('infoText', infoText);
                newLayer.set('enableSlider', enabeleSlider);
                newLayer.set('year', year);
                newLayer.set('layerType', layerType);
    
                layers.push(newLayer); // Füge den Layer dem Array hinzu
            });
            // console.log(layers);
        });
        
        return layers;
    }



// // config - jeder Layer einzeln ohne Gruppen 
//     // notwendige Imports:
//     import OSM from 'ol/source/OSM.js';
//     import TileLayer from 'ol/layer/Tile.js';
//     import TileSource from 'ol/source/Tile.js';
//     import TileWMS from 'ol/source/TileWMS.js';

//     //  Layernamen aus JSON-Datei importieren
//     import jsondata from '../../../conf/config.json'; //  


//     export default function Layers () {
//     // LayerArray für die Webapplikation erstellen und lesbar speichern 
//         let layers: TileLayer<TileSource>[] = [];       

//         // OSM Layer: 
//         let osmLayer = new TileLayer({              // OSM-Layer erstellen als BasisKarte
//             source: new OSM(),
//         });

//         osmLayer.set('name', 'osm');                // zum Layer Informationen wie Name, Title, Visibility hinzufügen 
//         osmLayer.set('title', 'OpenStreetMap');
//         osmLayer.set('visible', true);
        
//         layers.push(osmLayer)


//        


//         // Layers aus der Config.-Datei
//         let LayerArray = Object.values(jsondata.layers); // array

//         for (let i = 0; i < LayerArray.length; i++) { // für jeden Eintrag des Arrays wird der Name gefiltert
//             let layerConfig = LayerArray[i];            // es werden nacheinander die Positionen des Arrays aufgerufen
//             let name = layerConfig.name;                // der name an der entsprechendenen Position wird gewählt
//             let isVisible = layerConfig.visible !== undefined ? layerConfig.visible : false; // default: alle Layer ohne Angabe zu visible sind false = unsichtbar / (true = sichtbar)
//             let isQueryable = layerConfig.queryable !== undefined ? layerConfig.queryable : false;
//             let title = layerConfig.title;
//             let url = layerConfig.url || 'http://localhost:8080/geoserver/Umwelt-Gesundheit/wms';

//             // console.log("Layername: ", name);               // das klappt
//             // console.log('is Queryable:', isQueryable);      // das klappt 

//             let newLayer = new TileLayer({
//                 source: new TileWMS({
//                     url: url,  
//                     params: {'LAYERS': name},
//                     // transition: 0,
//                 }), 
                
//                 visible: isVisible, // Angabe zu Sichtbarkeit des Layers 
                
//                 // properties: {
//                 //     name: name,
//                 //     queryable: isQueryable
//                 // }
//             });
//             newLayer.set('name', name);                 
//             newLayer.set('queryable', isQueryable);     
//             newLayer.set('title', title)

//             layers.push(newLayer) // werden dem Array layers hinzugefügt, die dann auf der Karte gezeigt werden 
//                 // layers ist ein Array mit Objekten zu jedem Layer aus dem Geoserver inklusive visible

//         } 
        
//         return layers; 
        
//     }
