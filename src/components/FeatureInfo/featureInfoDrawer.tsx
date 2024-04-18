
// FeatureInfo wird in einem Drawer angezeigt 

import React, { useEffect, useState } from 'react'; 
import TileWMS from 'ol/source/TileWMS.js';
import TileLayer from 'ol/layer/Tile';
import { MapBrowserEvent } from 'ol';
import Map from 'ol/Map';
import { Drawer } from 'antd';

import Measurement from '../Measurement/measurement';

import './featureInfo.css';
import TimeChart from '../TimeChart/TimeChart';


import Toolbar from '../Toolbar/toolbar';
import VectorSource from 'ol/source/Vector';
import GeolocationComp from '../Geolocation/geolocation';

export type FeatureInfoProps = {
    map: Map;
    source: VectorSource
};


export default function FeatureInfo ({ map, source }: FeatureInfoProps) {
    
    const [selectedFeatureInfo, setSelectedFeatureInfo] = useState<{ layerName: string, attributes: { attributeName: string, value: string }[] }[]>([]); // Zustandsvariable für ausgewählten Feature-Informationen
    const [drawerVisible, setDrawerVisible] = useState(false); // Zustandsvariable für Sichtbarkeit des Modals 
    
    const [infoButtonClicked, setInfoButtonClicked] = useState(false);
    const [areaButtonClicked, setAreaButtonClicked] = useState(false);
    const [locationButtonClicked, setLocationButtonClicked] = useState(false);


    const [measureButtonClicked, setMeasureButtonClicked] = useState(false);

    useEffect(() => {
        const handleClick = async (evt: MapBrowserEvent<any>) => {     
            if (infoButtonClicked) {     // EventListener für Klick-Ereignisse; jedes Mal bei Click auf die Karte abgerufen
                const viewResolution = map.getView().getResolution() ?? 0;      // get current view Resolution to chose the right pixel 
                let tempSelectedFeatureInfo: { layerName: string, attributes: { attributeName: string, value: string }[], layerType: string }[] = []; // create a temporary array -> um Änderungen an selectedFeatureInfo erst vorzunehmen, wenn alle asynchronen Operationen abgeschlossen sind  

                
                await Promise.all(map.getLayers().getArray().map(async layer =>  {      // asynchrone Funkion; erwartet einen Array von Promises; Funktion auf alle Layer der Karte anwenden
                    if (layer instanceof TileLayer) {                                   // wenn es ein TileLayer ist: 
                        const isLayerQueryable = layer.get('queryable') ?? false;       // queryable abrufen (falls nicht vorhanden = false)
                        const isLayerVisible = layer.get('visible') ?? false;           // visible abrufen (falls nicht vorhanden false)
                        const title = layer.get('title');                                // save the title 
                        const layerType = layer.get('layerType');


                        const name = layer.get('name');    

                        if (isLayerQueryable && isLayerVisible) {                       // if Layer is queryable and visible
                            const source = layer.getSource();                           // get Source of the layer 

                            if (source instanceof TileWMS) {                            // if it is a TileWMS 
                                const hitTolerance = 100;                               // hit tolerance 100 pixel 
                                const url = source?.getFeatureInfoUrl(                  // create an url for getting feature information for an exact position and resolution 
                                    evt.coordinate,
                                    viewResolution,
                                    'EPSG:3857',
                                    { 'INFO_FORMAT': 'application/json', 'BUFFER': hitTolerance.toString() } // response as json
                                );


                                if (url) {                                          // if the url is true                             
                                    try {
                                        const response = await fetch(url);          // call the url and get a response; await -> wait until there is an answer
                                        if (!response.ok) {                         // check if the request was successfull 
                                            throw new Error('Network response was not ok'); // if response was not okay, get an error 
                                        }
                                        const responseObject = await response.json();           // change the response in a javascript object, wait until process is completed
                                        if (responseObject.features && responseObject.features.length > 0) { // check if the object has elements named features and has features  
                                            const properties = responseObject.features[0].properties;           // 
                                            const selectedAttributes = [         // attributes that are interessting 
                                                                        'AQ Station Name', 
                                                                        // 'Air Pollution Group',
                                                                        'AirPollutionLevel',  
                                                                        'Unit Of Airpollution Level', 
                                                                        'GEN', 
                                                                        'EW/KFL', 
                                                                        'EWZ', 
                                                                        'NAME_LATN', 
                                                                        'Average_travel_time', 
                                                                        // 'Code_18', 
                                                                        'name', 
                                                                        'addr:city',
                                                                        'addr:street',
                                                                        'GRAY_INDEX'  ]

                                          
                                            // const layerAttributes: { attributeName: string, value: string }[] = []; // leerer Array 

                                            // selectedAttributes.forEach(desiredAttribute => { // Schleife über die Liste der selectedAttributes
                                            //     if (properties.hasOwnProperty(desiredAttribute)) { 
                                            //         const value = properties[desiredAttribute]; // get Value of attribut 
                                            //         layerAttributes.push({ attributeName: desiredAttribute, value: `${value}` }); // push in array 
                                            //     }
                                            // }); wird durch die folgenden Zeilen ersetzt 
                                            
                                            
                                            ////
                                            const layerAttributes: { attributeName: string, value: string }[] = []; // leerer Array 

                                            selectedAttributes.forEach(desiredAttribute => {
                                                if (properties.hasOwnProperty(desiredAttribute)) {
                                                    let attributeName = desiredAttribute; // behalte den ursprünglichen Attributnamen
                                                    let value = properties[desiredAttribute]; // Attributwert abrufen
                                            
                                                    // Hier kannst du die Attributnamen anpassen
                                                    switch (desiredAttribute) {
                                                        case 'Air Pollution Group':
                                                            attributeName = 'Air Pollution Group';
                                                            break;
                                                        case 'AirPollutionLevel':
                                                            attributeName = 'Schadstoffkonzentration';
                                                            break;

                                                        case 'GRAY_INDEX':
                                                            attributeName = 'Schadstoffkonzentration (µg/m3)';
                                                            break;

                                                        case 'AQ Station Name':
                                                            attributeName = 'Name Messstation';
                                                            break;

                                                        case 'Unit Of Airpollution Level':
                                                            attributeName = 'Einheit Schadstoffkonzentration';
                                                            break;

                                                        case 'EW/KFL':
                                                            attributeName = 'Einwohnerzahl pro Katasterfläche';
                                                            break;

                                                        case 'GEN':
                                                            attributeName = 'Gemeinde';
                                                            break;

                                                        case 'EWZ':
                                                            attributeName = 'Einwohnerzahl (gesamt)';
                                                            break;

                                                        case 'NAME_LATN':
                                                            attributeName = 'Kreis';
                                                            break;

                                                        case 'Average_travel_time':
                                                            attributeName = 'Durchschn. Fahrtzeit';
                                                            break;

                                                        case 'name':
                                                            attributeName = 'Krankenhausname';
                                                            break;

                                                        case 'addr:city':
                                                            attributeName = 'Stadt';
                                                            break;

                                                        case 'addr:street':
                                                            attributeName = 'Straße';
                                                            break;

                                                        // Füge hier weitere Umbenennungen nach Bedarf hinzu
                                                        default:
                                                            // Für andere Attribute kannst du den Namen unverändert lassen
                                                            break;
                                                    }
                                            
                                                    // Füge das umbenannte Attribut in die Liste ein
                                                    layerAttributes.push({ attributeName: attributeName, value: `${value}` });
                                                }
                                            });
                                            ////

                                            if (layerAttributes.length > 0) {
                                                tempSelectedFeatureInfo.push({ layerName: title, attributes: layerAttributes, layerType: layerType });
                                            }
                                            // console.log('selected:', tempSelectedFeatureInfo)
                                        }
                                    } catch (error) {               // if there is an error than it would be catched 
                                        console.log('my error is ', error);
                                        alert('Sorry, es ist ein Fehler aufgetreten');
                                    }


                                   
                                }
                            }
                        }
                    }                
                }));
                tempSelectedFeatureInfo.sort((a, b) => {
                    // Zuerst nach Layer-Typ sortieren vector, raster siehe config)
                    const typeComparison = b.layerType.localeCompare(a.layerType);
                    if (typeComparison !== 0) {
                        return typeComparison;
                    } else {
                        // Wenn Layer-Typen gleich sind, nach dem Namen sortieren
                        return a.layerName.localeCompare(b.layerName);
                    }
                });

                if (tempSelectedFeatureInfo.length > 0) {
                    setSelectedFeatureInfo(tempSelectedFeatureInfo); // wird nur aktualisiert, wenn tatsächlich gültige FeatureInfos vorhanden sind
                    setDrawerVisible(true);
                }
            };
        }


        map.on('singleclick', handleClick); 

        return () => {
            map.un('singleclick', handleClick); 
        };
        
    }, [map, infoButtonClicked]); 

    const handleModalCancel = () => { // function for closing the modal 
        setDrawerVisible(false);
    };
    
    const [measureType, setMeasureType] = useState<'line' | 'polygon'>('line'); // Default ist 'line'

    useEffect(() => {
        if (measureButtonClicked) {
        setMeasureType('line'); // Wenn der Measure-Button gedrückt wurde, Typ auf 'line' setzen
        } else if (areaButtonClicked) {
        setMeasureType('polygon'); // Wenn der Area-Button gedrückt wurde, Typ auf 'polygon' setzen
        }
    }, [measureButtonClicked, areaButtonClicked]);

    return (
        <div>
            <Drawer
                className='featureInfo-container'
               
                title="Feature Information"         // title in the modal 
                open={drawerVisible}                 // open when modal isVisible
                onClose={handleModalCancel}        // function for canceling modal 
                placement="left"
                footer={null}                       // no footer in the modal 
                mask={false}                        // no mask about the map 
                maskClosable={false}                // closable only on cross
                keyboard={true}                     // or close with keyboard 
                forceRender={true}                  // RasterSlider wird beim ersten rendern gerendert
                
            >                                       
                {/*content-body: */} 
                    {selectedFeatureInfo.map((featureInfo, index) => ( 
                        <div key={index}>
                            <h3>{featureInfo.layerName}</h3>
                            {featureInfo.attributes.map((attribute, attrIndex) => (
                                <div key={attrIndex} className="feature-info-container">
                                    <div className='attribute-row'>
                                        <span className="attribute-name">{attribute.attributeName}:</span>
                                        <span className="attribute-value">{attribute.value}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                }
                {infoButtonClicked && <TimeChart map={map} />} {/* Render TimeChart nur wenn infoButtonClicked true ist */}
            </Drawer>
            
            
            <Toolbar 
                drawerVisible={drawerVisible} 

                setInfoButtonClicked={setInfoButtonClicked} 
                infoButtonClicked={infoButtonClicked} 

                measureButtonClicked={measureButtonClicked} 
                setMeasureButtonClicked={setMeasureButtonClicked}

                areaButtonClicked={areaButtonClicked}
                setAreaButtonClicked={setAreaButtonClicked}

                locationButtonClicked={locationButtonClicked}
                setLocationButtonClicked={setLocationButtonClicked}
            />
                
            <Measurement
                map={map} 
                source={source}
                active={measureButtonClicked || areaButtonClicked}
                measureType={measureType}
            />

            <GeolocationComp 
                map={map} 
                activeGeoloc={locationButtonClicked}/>
        </div>
    );
};

// Kommentar:
    // asynchronen Funktionen sind notwendig, damit mit der Anzeige der featureInfos zu den verschiedenen Layern gewartet wird bis alle Informationen geladen worden sind 









