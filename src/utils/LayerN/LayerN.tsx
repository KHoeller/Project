// // Layers

// Arbeit mit groups: funktioniert noch nicht!
        // notwendige Imports:
    import OSM, {ATTRIBUTION} from 'ol/source/OSM.js';
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
        osmLayer.set('legend', false);
        
        layers.push(osmLayer) 
            

        const groups = jsondata.groups; // Gruppen aus der JSON-Datei
        
    
        // Für jede Gruppe in der Konfiguration
        groups.forEach(group => {

            const groupName = group.groupName;
            const info = group.info !== undefined ? group.info: false;
            const infoTextTitle = group.infoTextTitle !== undefined ? group.infoTextTitle : 'undefined';
            const infoText = group.infoText !== undefined ? group.infoText : 'undefined';
            const enabeleSlider = group.enableSlider !== undefined ? group.enableSlider : false;
            const legendGroupName = group.legendGroupName !== undefined ? group.legendGroupName : 'undefined';
            const attribution = group.attribution !== undefined ? group.attribution : undefined;
            

            // Für jeden Layer in der Gruppe
            group.layers.forEach(layerConfig => {
                const name = layerConfig.name;
                const isVisible = layerConfig.visible !== undefined ? layerConfig.visible : false;
                const isQueryable = layerConfig.queryable !== undefined ? layerConfig.queryable : false;
                const title = layerConfig.title;
                const url = layerConfig.url || 'http://localhost:8080/geoserver/Umwelt-Gesundheit/wms';
                const year = layerConfig.year !== undefined ? layerConfig.year : false;
                const layerType = layerConfig.layerType;
                const urlLegend = layerConfig.urlLegend !== undefined ? layerConfig.urlLegend : false;
                const legend = layerConfig.legend === undefined ? true : layerConfig.legend; // alle Layer, für die es nicht explizit anders festgelegt ist, haben legend === true; (nur OSM soll keine Legende haben!)
                
                
                let newLayer = new TileLayer({
                    source: new TileWMS({
                        url: url,
                        params: { 'LAYERS': name },
                        attributions: attribution
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
                newLayer.set('urlLegend', urlLegend);
                newLayer.set('legend', legend);
                newLayer.set('legendGroupName', legendGroupName); 
    
                layers.push(newLayer); // Füge den Layer dem Array hinzu
            });
            // console.log('LayerN layers:',layers);
        });
        
        return layers;
    }

