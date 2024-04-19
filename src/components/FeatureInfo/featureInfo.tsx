// Feature Info in einem Modal 


import React, { useEffect, useState } from 'react'; 
import TileWMS from 'ol/source/TileWMS.js';
import TileLayer from 'ol/layer/Tile';
import { MapBrowserEvent } from 'ol';
import Map from 'ol/Map';
import { Modal } from 'antd';

import './featureInfo.css';
import TimeChart from '../TimeChart/TimeChart';

export type FeatureInfoProps = {
    map: Map;
};


export default function FeatureInfo ({ map }: FeatureInfoProps) {
    
    const [selectedFeatureInfo, setSelectedFeatureInfo] = useState<{ layerName: string, attributes: { attributeName: string, value: string }[] }[]>([]); // Zustandsvariable für ausgewählten Feature-Informationen
    const [modalVisible, setModalVisible] = useState(false); // Zustandsvariable für Sichtbarkeit des Modals 

    useEffect(() => {
        const handleClick = async (evt: MapBrowserEvent<any>) => {          // EventListener für Klick-Ereignisse; jedes Mal bei Click auf die Karte abgerufen
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
                            const hitTolerance = 20;                               // hit tolerance 100 pixel 
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
                                        const selectedAttributes = ['GRAY_INDEX',           // attributes that are interessting 
                                                                    'AQ Station Name', 
                                                                    'Air Pollution Group',
                                                                    'AirPollutionLevel',  
                                                                    'Unit Of Airpollution Level', 
                                                                    'GEN', 
                                                                    'EW/KFL', 
                                                                    'EWZ', 
                                                                    'NAME_LATN', 
                                                                    'Average_travel_time', 
                                                                    'Code_18', 
                                                                    'name', 
                                                                    'addr:city',
                                                                    'addr:street']

                                        const layerAttributes: { attributeName: string, value: string }[] = []; // leerer Array 

                                        selectedAttributes.forEach(desiredAttribute => { // Schleife über die Liste der selectedAttributes
                                            if (properties.hasOwnProperty(desiredAttribute)) { 
                                                const value = properties[desiredAttribute]; // get Value of attribut 
                                                layerAttributes.push({ attributeName: desiredAttribute, value: `${value}` }); // push in array 
                                            }
                                        });

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
                const typeComparison = a.layerType.localeCompare(b.layerType);
                if (typeComparison !== 0) {
                    return typeComparison;
                } else {
                    // Wenn Layer-Typen gleich sind, nach dem Namen sortieren
                    return a.layerName.localeCompare(b.layerName);
                }
            });

            if (tempSelectedFeatureInfo.length > 0) {
                setSelectedFeatureInfo(tempSelectedFeatureInfo); // wird nur aktualisiert, wenn tatsächlich gültige FeatureInfos vorhanden sind
                setModalVisible(true);
            }
        };


        

        map.on('singleclick', handleClick); 

        return () => {
            map.un('singleclick', handleClick); 
        };
        
    }, [map]); 

    const handleModalCancel = () => { // function for closing the modal 
        setModalVisible(false);
    };
    

    return (
        <div>
            <Modal
                className='featureInfo-container'
                wrapClassName='Modal-Feature'       // important for css and rendering to distinguish the modal from others 
                title="Feature Information"         // title in the modal 
                open={modalVisible}                 // open when modal isVisible
                onCancel={handleModalCancel}        // function for canceling modal 
                footer={null}                       // no footer in the modal 
                mask={false}                        // no mask about the map 
                maskClosable={false}                // closable only on cross
                keyboard={true}                     // or close with keyboard 
                
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
                <TimeChart
                    map={map}
                />
            </Modal>
        </div>
    );
};

// Kommentar:
    // asynchronen Funktionen sind notwendig, damit mit der Anzeige der featureInfos zu den verschiedenen Layern gewartet wird bis alle Informationen geladen worden sind 


