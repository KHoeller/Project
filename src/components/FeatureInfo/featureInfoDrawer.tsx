


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












// import React, { useEffect, useState } from 'react'; 
// import TileWMS from 'ol/source/TileWMS.js';
// import TileLayer from 'ol/layer/Tile';
// import { MapBrowserEvent } from 'ol';
// import Map from 'ol/Map';
// import { Modal } from 'antd';

// import './featureInfo.css';

// export type FeatureInfoProps = {
//     map: Map;
// };

// const FeatureInfo: React.FC<FeatureInfoProps> = ({ map }) => {
//     const [selectedFeatureInfo, setSelectedFeatureInfo] = useState<{ layerName: string, attributes: { attributeName: string, value: string }[] }[]>([]);
//     const [modalVisible, setModalVisible] = useState(false);

//     useEffect(() => {
//         const handleClick = async (evt: MapBrowserEvent<any>) => {
//             const viewResolution = map.getView().getResolution() ?? 0;      
//             let tempSelectedFeatureInfo: { layerName: string, attributes: { attributeName: string, value: string }[] }[] = [];

//             await Promise.all(map.getLayers().getArray().map(async layer =>  {      
//                 if (layer instanceof TileLayer) {
//                     const isLayerQueryable = layer.get('queryable') ?? false;
//                     const isLayerVisible = layer.get('visible') ?? false;
//                     const name = layer.get('title');

//                     if (isLayerQueryable && isLayerVisible) {
//                         const source = layer.getSource();

//                         if (source instanceof TileWMS) {
//                             const hitTolerance = 100;
//                             const url = source?.getFeatureInfoUrl(
//                                 evt.coordinate,
//                                 viewResolution,
//                                 'EPSG:3857',
//                                 { 'INFO_FORMAT': 'application/json', 'BUFFER': hitTolerance.toString() }
//                             );

//                             if (url) {                                              
//                                 try {
//                                     const response = await fetch(url);
//                                     if (!response.ok) {
//                                         throw new Error('Network response was not ok');
//                                     }
//                                     const responseObject = await response.json();
//                                     if (responseObject.features && responseObject.features.length > 0) {
//                                         const properties = responseObject.features[0].properties;       
//                                         const selectedAttributes = ['GRAY_INDEX', 'AirPollutionLevel', 'AQ Station Name', 'Air Pollution Group', 'Unit Of Airpollution Level', 'EW/KFL', 'GEN', 'EWZ', 'NAME_LATN', 'Average_travel_time', 'Code_18', 'addr:street', 'addr:city', 'name']

//                                         const layerAttributes: { attributeName: string, value: string }[] = [];

//                                         selectedAttributes.forEach(desiredAttribute => {
//                                             if (properties.hasOwnProperty(desiredAttribute)) {
//                                                 const value = properties[desiredAttribute];
//                                                 layerAttributes.push({ attributeName: desiredAttribute, value: `${value}` });
//                                             }
//                                         });

//                                         if (layerAttributes.length > 0) {
//                                             tempSelectedFeatureInfo.push({ layerName: name, attributes: layerAttributes });
//                                         }
//                                     }
//                                 } catch (error) {
//                                     console.log('my error is ', error);
//                                     alert('Sorry, es ist ein Fehler aufgetreten');
//                                 }
//                             }
//                         }
//                     }
//                 }                
//             }));

//             if (tempSelectedFeatureInfo.length > 0) {
//                 setSelectedFeatureInfo(tempSelectedFeatureInfo);
//                 setModalVisible(true);
//             }
//         };

//         map.on('singleclick', handleClick); 

//         return () => {
//             map.un('singleclick', handleClick); 
//         };
        
//     }, [map]); 

//     const handleModalCancel = () => {
//         setModalVisible(false);
//     };

//     return (
//         <Modal
//             title="Feature Information"
//             open={modalVisible}
//             onCancel={handleModalCancel}
//             footer={null}
//             mask={false}
//             maskClosable={false}
//         >
//             {selectedFeatureInfo.map((featureInfo, index) => (
//                 <div key={index}>
//                     <h3>{featureInfo.layerName}</h3>
//                     {featureInfo.attributes.map((attribute, attrIndex) => (
//                         <div key={attrIndex} className="feature-info-container">
//                             <div className='attribute-row'>
//                                 <span className="attribute-name">{attribute.attributeName}:</span>
//                                 <span className="attribute-value">{attribute.value}</span>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             ))}
//         </Modal>
//     );
// };

// export default FeatureInfo;


// import React, { useEffect, useState } from 'react'; 
// import TileWMS from 'ol/source/TileWMS.js';
// import TileLayer from 'ol/layer/Tile';
// import { MapBrowserEvent } from 'ol';
// import Map from 'ol/Map';

// import FeatureModal from '../FeatureInfoModal/featureInfoModal';

// // import FeatureInfoModal from '../FeatureInfoModal/featureInfoModal';
// import './featureInfo.css';


// export type FeatureInfoProps = {
//     map: Map;
// };

// export default function FeatureInfo ({ map }: FeatureInfoProps){

    
//     // useState (hook-function) um den Zustand einer Komponente zuverwalten -> updateValue = aktueller Zustandswert, setUpdatevalue = Funktion, um Zustand zu aktualisieren
//     // const [updatedValue, setUpdatedValue] = useState<{ layerName: string, attributes: { attributeName: string, value: string }[] }[]>([]); // (Typ des Zustands) Array, der Objekte enthält, die keys name und value haben
//                                                                                             // ([]) -> inital state leerer Array 

//     const [updatedValue, setUpdatedValue] = useState<{ layerName: string, attributes: { attributeName: string, value: string }[] }[]>([]);
//     const [modalVisible, setModalVisible] = useState(false);
//     const [selectedFeatureInfo, setSelectedFeatureInfo] = useState<{ layerName: string, attributes: { attributeName: string, value: string }[] } | null>(null);
                                                                                        
//     useEffect(() => {
//         const handleClick = (evt: MapBrowserEvent<any>) => {                // function for dealing with a click in the Browser 
            
//             const viewResolution = map.getView().getResolution() ?? 0;      // aktueller Kartenausschnitt und aktuelle Auflösung um den geclickten Punkt möglichst genau an GeoServer zurückzugeben
//             // TODO make use of the existing layers in the map
            
//             let tempUpdatedValue: { layerName: string, attributes: { attributeName: string, value: string }[] }[] = [];

//             // console.log(map.getLayers());
//             map.getLayers().forEach(layer =>  {      // iterate over all layers 
                
//                 if (layer instanceof TileLayer) {
//                     const isLayerQueryable = layer.get('queryable') ?? false;
//                     const isLayerVisible = layer.get('visible') ?? false;
//                     const name = layer.get('name');

//                     if (isLayerQueryable && isLayerVisible) {
//                         const source = layer.getSource();

//                         if (source instanceof TileWMS) {
//                             const hitTolerance = 100;
//                             const url = source?.getFeatureInfoUrl(
//                                 evt.coordinate,
//                                 viewResolution,
//                                 'EPSG:3857',
//                                 { 'INFO_FORMAT': 'application/json', 'BUFFER': hitTolerance.toString() }
//                             );
//                     // console.log(url)  
            
//                             if (url) {                                              // sofern die URL true ist 
//                                 fetch(url)
//                                 .then((response) => {
//                                     if (!response.ok) {
//                                         throw new Error('Network response was not ok');
//                                     }
//                                     return response.json();
//                                 })                                                  // response auf Anfrage der URL 
//                                     .then((responseObject) => {
//                                         // console.log(responseObject);
//                                         if (responseObject.features && responseObject.features.length > 0) {
                            
//                 // !!! Gray Index gibt es für Vector-Daten auf jeden Fall nicht 
//                 // !!! Toleranz-Bereich für Vector-Data, da man diese sonst nie angezeigt bekommt?! 
//                 // !!! ToleranzBereich anzeigen lassen? 
                
//                                             // const grayIndex = responseObject.features[0].properties.GRAY_INDEX; // von der response den Gray, index abfragen;
                                            
//                                             const properties = responseObject.features[0].properties;       // alle Properties anzeigen lassen 
//                                             const selectedAttributes = ['GRAY_INDEX', 
//                                                                         'AirPollutionLevel', 
//                                                                         'AQ Station Name', 
//                                                                         'Air Pollution Group', 
//                                                                         'Unit Of Airpollution Level', 
//                                                                         'EW/KFL',
//                                                                         'GEN',
//                                                                         'EWZ',
//                                                                         'NAME_LATN',
//                                                                         // 'NUTS_NAME',
//                                                                         'Average_travel_time',
//                                                                         'Code_18',
//                                                                         'addr:street',
//                                                                         'addr:city',
//                                                                         'name']

//                                             const layerAttributes: { attributeName: string, value: string }[] = [];

//                                             // Suche nach den selectedAttributes (damit nicht einfach alle Attributes ausgegeben werden)
//                                             selectedAttributes.forEach(desiredAttribute => {
//                                                 if (properties.hasOwnProperty(desiredAttribute)) {
//                                                     const value = properties[desiredAttribute];
//                                                     layerAttributes.push({ attributeName: desiredAttribute, value: `${value}` });
//                                                 }
//                                             });

//                                             // Füge nur hinzu, wenn Attribute vorhanden sind
//                                             if (layerAttributes.length > 0) {
//                                                 tempUpdatedValue.push({ layerName: name, attributes: layerAttributes });
//                                             }

//                                             setUpdatedValue([...tempUpdatedValue]);                             // die updatedValues werden bei jeder Iteration dem Array hinzugefügt 
//                                                     // setValue({name: name, value: `${grayIndex}`}); // Ursprünglich, dann wird immer nur der letzte Value festgehalten 
                                            
//                                         }
//                                     })

//                                 .catch(error => {

//                                     console.log('my error is ', error);
//                                     alert('Sorry, es ist ein Fehler aufgetreten') // TODO Show user an error -> kann man sicherlich noch etwas schöner gestalten 
//                                 });
//                             }
//                         }
//                     }
//                 };
                
//             });
            
//             // To Do show results only for selected attributes 
//         };

            
            

//         map.on('singleclick', handleClick); //

//         return () => {
//             map.un('singleclick', handleClick); // TODO should be unregister something if the component unmounts?
//         };
        
        
//     }, [map]); 
    
//     const handleFeatureClick = (featureInfo: { layerName: string, attributes: { attributeName: string, value: string }[] }) => {
//         setSelectedFeatureInfo(featureInfo);
//         setModalVisible(true);
//     };

//     const handleModalCancel = () => {
//         setModalVisible(false);
//     };

//     return (
//         <>
//             <div className="info">
//                 {/* Code für das Anzeigen der Feature-Informationen */}
//             </div>
//             <FeatureModal visible={modalVisible} onCancel={handleModalCancel} featureInfo={selectedFeatureInfo} />
//         </>
//     );
        
    // return (
    //         <div id='info' className ='info'> 
    //             {updatedValue.map((layerInfo, index) => (
    //             <div key={index}>
    //                 <h3>{layerInfo.layerName}</h3>
    //                 {layerInfo.attributes.map((attribute, attrIndex) => (
    //                     <div key={attrIndex} className="feature-info-container">
    //                         <div className="attribute-name">{attribute.attributeName}:</div>
    //                         <div className="attribute-value">{attribute.value}</div>
    //                     </div>
    //                 ))}
    //             </div>
    //             ))}
    //         </div>            
    // )
// }



// Funktioniert -- values für alle sichtbaren Layer und ÜBerschrift über Attributen 
// import React, { useEffect, useState } from 'react'; 
// import TileWMS from 'ol/source/TileWMS.js';
// import TileLayer from 'ol/layer/Tile';
// import { MapBrowserEvent } from 'ol';
// import Map from 'ol/Map';

// // import FeatureInfoModal from '../FeatureInfoModal/featureInfoModal';
// import './featureInfo.css';


// export type FeatureInfoProps = {
//     map: Map;
// };

// export default function FeatureInfo ({ map }: FeatureInfoProps){

    
//     // useState (hook-function) um den Zustand einer Komponente zuverwalten -> updateValue = aktueller Zustandswert, setUpdatevalue = Funktion, um Zustand zu aktualisieren
//     const [updatedValue, setUpdatedValue] = useState<{ layerName: string, attributes: { attributeName: string, value: string }[] }[]>([]); // (Typ des Zustands) Array, der Objekte enthält, die keys name und value haben
//                                                                                             // ([]) -> inital state leerer Array 
//     useEffect(() => {
//         const handleClick = (evt: MapBrowserEvent<any>) => {                // function for dealing with a click in the Browser 
            
//             const viewResolution = map.getView().getResolution() ?? 0;      // aktueller Kartenausschnitt und aktuelle Auflösung um den geclickten Punkt möglichst genau an GeoServer zurückzugeben
//             // TODO make use of the existing layers in the map
            
//             let tempUpdatedValue: { layerName: string, attributes: { attributeName: string, value: string }[] }[] = [];

//             // console.log(map.getLayers());
//             map.getLayers().forEach(layer =>  {      // iterate over all layers 
                
//                 if (layer instanceof TileLayer) {
//                     const isLayerQueryable = layer.get('queryable') ?? false;
//                     const isLayerVisible = layer.get('visible') ?? false;
//                     const name = layer.get('name');

//                     if (isLayerQueryable && isLayerVisible) {
//                         const source = layer.getSource();

//                         if (source instanceof TileWMS) {
//                             const hitTolerance = 100;
//                             const url = source?.getFeatureInfoUrl(
//                                 evt.coordinate,
//                                 viewResolution,
//                                 'EPSG:3857',
//                                 { 'INFO_FORMAT': 'application/json', 'BUFFER': hitTolerance.toString() }
//                             );
//                     // console.log(url)  
            
//                             if (url) {                                              // sofern die URL true ist 
//                                 fetch(url)
//                                 .then((response) => {
//                                     if (!response.ok) {
//                                         throw new Error('Network response was not ok');
//                                     }
//                                     return response.json();
//                                 })                                                  // response auf Anfrage der URL 
//                                     .then((responseObject) => {
//                                         // console.log(responseObject);
//                                         if (responseObject.features && responseObject.features.length > 0) {
                            
//                 // !!! Gray Index gibt es für Vector-Daten auf jeden Fall nicht 
//                 // !!! Toleranz-Bereich für Vector-Data, da man diese sonst nie angezeigt bekommt?! 
//                 // !!! ToleranzBereich anzeigen lassen? 
                
//                                             // const grayIndex = responseObject.features[0].properties.GRAY_INDEX; // von der response den Gray, index abfragen;
                                            
//                                             const properties = responseObject.features[0].properties;       // alle Properties anzeigen lassen 
//                                             const selectedAttributes = ['GRAY_INDEX', 
//                                                                         'AirPollutionLevel', 
//                                                                         'AQ Station Name', 
//                                                                         'Air Pollution Group', 
//                                                                         'Unit Of Airpollution Level', 
//                                                                         'EW/KFL',
//                                                                         'GEN',
//                                                                         'EWZ',
//                                                                         'NAME_LATN',
//                                                                         // 'NUTS_NAME',
//                                                                         'Average_travel_time',
//                                                                         'Code_18',
//                                                                         'addr:street',
//                                                                         'addr:city',
//                                                                         'name']

//                                             const layerAttributes: { attributeName: string, value: string }[] = [];

//                                             // Suche nach den selectedAttributes (damit nicht einfach alle Attributes ausgegeben werden)
//                                             selectedAttributes.forEach(desiredAttribute => {
//                                                 if (properties.hasOwnProperty(desiredAttribute)) {
//                                                     const value = properties[desiredAttribute];
//                                                     layerAttributes.push({ attributeName: desiredAttribute, value: `${value}` });
//                                                 }
//                                             });

//                                             // Füge nur hinzu, wenn Attribute vorhanden sind
//                                             if (layerAttributes.length > 0) {
//                                                 tempUpdatedValue.push({ layerName: name, attributes: layerAttributes });
//                                             }

//                                             setUpdatedValue([...tempUpdatedValue]);                             // die updatedValues werden bei jeder Iteration dem Array hinzugefügt 
//                                                     // setValue({name: name, value: `${grayIndex}`}); // Ursprünglich, dann wird immer nur der letzte Value festgehalten 
                                            
//                                         }
//                                     })

//                                 .catch(error => {

//                                     console.log('my error is ', error);
//                                     alert('Sorry, es ist ein Fehler aufgetreten') // TODO Show user an error -> kann man sicherlich noch etwas schöner gestalten 
//                                 });
//                             }
//                         }
//                     }
//                 };
                
//             });
            
//             // To Do show results only for selected attributes 
//         };
            
            

//         map.on('singleclick', handleClick); //

//         return () => {
//             map.un('singleclick', handleClick); // TODO should be unregister something if the component unmounts?
//         };
        
        
//     }, [map]); // TODO what happens if the map prop has changed?
    
        
//     return (
//             <div id='info' className ='info'> 
//                 {updatedValue.map((layerInfo, index) => (
//                 <div key={index}>
//                     <h3>{layerInfo.layerName}</h3>
//                     {layerInfo.attributes.map((attribute, attrIndex) => (
//                         <div key={attrIndex} className="feature-info-container">
//                             <div className="attribute-name">{attribute.attributeName}:</div>
//                             <div className="attribute-value">{attribute.value}</div>
//                         </div>
//                     ))}
//                 </div>
//                 ))}
//             </div>            
//     )
// }


{/* <div key={attrIndex}>{attribute.attributeName}: {attribute.value}</div>
.feature-info-container 
.attribute-name 
.attribute-value   */}

// import React, { useEffect, useState } from 'react'; 
// import TileWMS from 'ol/source/TileWMS.js';
// import TileLayer from 'ol/layer/Tile';
// import { MapBrowserEvent } from 'ol';
// import Map from 'ol/Map';

// // import FeatureInfoModal from '../FeatureInfoModal/featureInfoModal';
// import './featureInfo.css';


// export type FeatureInfoProps = {
//     map: Map;
// };

// export default function FeatureInfo ({ map }: FeatureInfoProps){

    
//     // useState (hook-function) um den Zustand einer Komponente zuverwalten -> updateValue = aktueller Zustandswert, setUpdatevalue = Funktion, um Zustand zu aktualisieren
//     const [updatedValue, setUpdatedValue] = useState<{ layerName: string, attributeName: string, value: string }[]>([]); // (Typ des Zustands) Array, der Objekte enthält, die keys name und value haben
//                                                                                             // ([]) -> inital state leerer Array 
//     useEffect(() => {
//         const handleClick = (evt: MapBrowserEvent<any>) => {                // function for dealing with a click in the Browser 
            
//             const viewResolution = map.getView().getResolution() ?? 0;      // aktueller Kartenausschnitt und aktuelle Auflösung um den geclickten Punkt möglichst genau an GeoServer zurückzugeben
//             // TODO make use of the existing layers in the map
            
//             let tempUpdatedValue: { layerName: string, attributeName: string, value: string }[] = [];

//             // console.log(map.getLayers());
//             map.getLayers().forEach(layer =>  {      // iterate over all layers 
                
//                 if (layer instanceof TileLayer) {
//                     const isLayerQueryable = layer.get('queryable') ?? false;
//                     const isLayerVisible = layer.get('visible') ?? false;
//                     const name = layer.get('name');

//                     if (isLayerQueryable && isLayerVisible) {
//                         const source = layer.getSource();

//                         if (source instanceof TileWMS) {
//                             const hitTolerance = 100;
//                             const url = source?.getFeatureInfoUrl(
//                                 evt.coordinate,
//                                 viewResolution,
//                                 'EPSG:3857',
//                                 { 'INFO_FORMAT': 'application/json', 'BUFFER': hitTolerance.toString() }
//                             );
//                     // console.log(url)  
            
//                             if (url) {                                              // sofern die URL true ist 
//                                 fetch(url)
//                                 .then((response) => {
//                                     if (!response.ok) {
//                                         throw new Error('Network response was not ok');
//                                     }
//                                     return response.json();
//                                 })                                                  // response auf Anfrage der URL 
//                                     .then((responseObject) => {
//                                         // console.log(responseObject);
//                                         if (responseObject.features && responseObject.features.length > 0) {
                            
               
//                 // !!! ToleranzBereich anzeigen lassen? 
                
//                                             // const grayIndex = responseObject.features[0].properties.GRAY_INDEX; // von der response den Gray, index abfragen;
                                            
//                                             const properties = responseObject.features[0].properties;       // alle Properties anzeigen lassen 
//                                             const selectedAttributes = ['GRAY_INDEX', 
//                                                                         'AirPollutionLevel', 
//                                                                         'AQ Station Name', 
//                                                                         'Air Pollution Group', 
//                                                                         'Unit Of Airpollution Level', 
//                                                                         'EW/KFL',
//                                                                         'GEN',
//                                                                         'EWZ',
//                                                                         'NAME_LATN',
//                                                                         // 'NUTS_NAME',
//                                                                         'Average_travel_time',
//                                                                         'Code_18',
//                                                                         'addr:street',
//                                                                         'addr:city',
//                                                                         'name']


//                                             // Suche nach den selectedAttributes (damit nicht einfach alle Attributes ausgegeben werden)
//                                             selectedAttributes.forEach(desiredAttribute => {
//                                                 if (properties.hasOwnProperty(desiredAttribute)) {
//                                                     const value = properties[desiredAttribute];
//                                                     tempUpdatedValue.push({ layerName: name, attributeName: desiredAttribute, value: `${value}` });
//                                                 }
//                                             });


//                                             // Object.keys(properties).forEach(key => {
//                                             //     const value = properties[key];

//                                             //     // console.log(grayIndex);
//                                             //     tempUpdatedValue.push({ layerName: name, attributeName: key, value: `${value}` });       // zum Array die neuen Informationen des Layers hinzufügen 
//                                             // });
                                            
//                                             setUpdatedValue([...tempUpdatedValue]);                             // die updatedValues werden bei jeder Iteration dem Array hinzugefügt 
//                                                     // setValue({name: name, value: `${grayIndex}`}); // Ursprünglich, dann wird immer nur der letzte Value festgehalten 
                                            
//                                         }
//                                     })

//                                 .catch(error => {

//                                     console.log('my error is ', error);
//                                     alert('Sorry, es ist ein Fehler aufgetreten') // TODO Show user an error -> kann man sicherlich noch etwas schöner gestalten 
//                                 });
//                             }
//                         }
//                     }
//                 };
                
//             });
            
//             // To Do show results only for selected attributes 
//         };
            
            

//         map.on('singleclick', handleClick); //

//         return () => {
//             map.un('singleclick', handleClick); // TODO should be unregister something if the component unmounts?
//         };
        
        
//     }, [map]); // TODO what happens if the map prop has changed?
    
        
//     return (
//             <div id='info' className ='info'> 
//                 {updatedValue.map((item, index) => (
//                 <div key={index}>
//                     <h3>{item.layerName}</h3>
//                     {item.layerName} / {item.attributeName}: {item.value}</div>
//                 ))}
//             </div>            
//     )
// }


// Code funktioniert und nur noch relevante Features, aber keine schöne Darstellung 
// import React, { useEffect, useState } from 'react'; 
// import TileWMS from 'ol/source/TileWMS.js';
// import TileLayer from 'ol/layer/Tile';
// import { MapBrowserEvent } from 'ol';
// import Map from 'ol/Map';

// import FeatureInfoModal from '../FeatureInfoModal/featureInfoModal';
// import './featureInfo.css';


// export type FeatureInfoProps = {
//     map: Map;
// };

// export default function FeatureInfo ({ map }: FeatureInfoProps){

    
//     // useState (hook-function) um den Zustand einer Komponente zuverwalten -> updateValue = aktueller Zustandswert, setUpdatevalue = Funktion, um Zustand zu aktualisieren
//     const [updatedValue, setUpdatedValue] = useState<{ layerName: string, attributeName: string, value: string }[]>([]); // (Typ des Zustands) Array, der Objekte enthält, die keys name und value haben
//                                                                                             // ([]) -> inital state leerer Array 
//     useEffect(() => {
//         const handleClick = (evt: MapBrowserEvent<any>) => {                // function for dealing with a click in the Browser 
            
//             const viewResolution = map.getView().getResolution() ?? 0;      // aktueller Kartenausschnitt und aktuelle Auflösung um den geclickten Punkt möglichst genau an GeoServer zurückzugeben
//             // TODO make use of the existing layers in the map
            
//             let tempUpdatedValue: { layerName: string, attributeName: string, value: string }[] = [];

//             // console.log(map.getLayers());
//             map.getLayers().forEach(layer =>  {      // iterate over all layers 
                
//                 if (layer instanceof TileLayer) {
//                     const isLayerQueryable = layer.get('queryable') ?? false;
//                     const isLayerVisible = layer.get('visible') ?? false;
//                     const name = layer.get('name');

//                     if (isLayerQueryable && isLayerVisible) {
//                         const source = layer.getSource();

//                         if (source instanceof TileWMS) {
//                             const hitTolerance = 100;
//                             const url = source?.getFeatureInfoUrl(
//                                 evt.coordinate,
//                                 viewResolution,
//                                 'EPSG:3857',
//                                 { 'INFO_FORMAT': 'application/json', 'BUFFER': hitTolerance.toString() }
//                             );
//                     // console.log(url)  
            
//                             if (url) {                                              // sofern die URL true ist 
//                                 fetch(url)
//                                 .then((response) => {
//                                     if (!response.ok) {
//                                         throw new Error('Network response was not ok');
//                                     }
//                                     return response.json();
//                                 })                                                  // response auf Anfrage der URL 
//                                     .then((responseObject) => {
//                                         // console.log(responseObject);
//                                         if (responseObject.features && responseObject.features.length > 0) {
                            
//                 // !!! Gray Index gibt es für Vector-Daten auf jeden Fall nicht 
//                 // !!! Toleranz-Bereich für Vector-Data, da man diese sonst nie angezeigt bekommt?! 
//                 // !!! ToleranzBereich anzeigen lassen? 
                
//                                             // const grayIndex = responseObject.features[0].properties.GRAY_INDEX; // von der response den Gray, index abfragen;
                                            
//                                             const properties = responseObject.features[0].properties;       // alle Properties anzeigen lassen 
//                                             const selectedAttributes = ['GRAY_INDEX', 
//                                                                         'AirPollutionLevel', 
//                                                                         'AQ Station Name', 
//                                                                         'Air Pollution Group', 
//                                                                         'Unit Of Airpollution Level', 
//                                                                         'EW/KFL',
//                                                                         'GEN',
//                                                                         'EWZ',
//                                                                         'NAME_LATN',
//                                                                         // 'NUTS_NAME',
//                                                                         'Average_travel_time',
//                                                                         'Code_18',
//                                                                         'addr:street',
//                                                                         'addr:city',
//                                                                         'name']


//                                             // Suche nach den selectedAttributes (damit nicht einfach alle Attributes ausgegeben werden)
//                                             selectedAttributes.forEach(desiredAttribute => {
//                                                 if (properties.hasOwnProperty(desiredAttribute)) {
//                                                     const value = properties[desiredAttribute];
//                                                     tempUpdatedValue.push({ layerName: name, attributeName: desiredAttribute, value: `${value}` });
//                                                 }
//                                             });


//                                             // Object.keys(properties).forEach(key => {
//                                             //     const value = properties[key];

//                                             //     // console.log(grayIndex);
//                                             //     tempUpdatedValue.push({ layerName: name, attributeName: key, value: `${value}` });       // zum Array die neuen Informationen des Layers hinzufügen 
//                                             // });
                                            
//                                             setUpdatedValue([...tempUpdatedValue]);                             // die updatedValues werden bei jeder Iteration dem Array hinzugefügt 
//                                                     // setValue({name: name, value: `${grayIndex}`}); // Ursprünglich, dann wird immer nur der letzte Value festgehalten 
                                            
//                                         }
//                                     })

//                                 .catch(error => {

//                                     console.log('my error is ', error);
//                                     alert('Sorry, es ist ein Fehler aufgetreten') // TODO Show user an error -> kann man sicherlich noch etwas schöner gestalten 
//                                 });
//                             }
//                         }
//                     }
//                 };
                
//             });
            
//             // To Do show results only for selected attributes 
//         };
            
            

//         map.on('singleclick', handleClick); //

//         return () => {
//             map.un('singleclick', handleClick); // TODO should be unregister something if the component unmounts?
//         };
        
        
//     }, [map]); // TODO what happens if the map prop has changed?
    
        
//     return (
//             <div id='info' className ='info'> 
//                 {updatedValue.map((item, index) => (
//                 <div key={index}>{item.layerName} / {item.attributeName}: {item.value}</div>
//                 ))}
//             </div>            
//     )
// }


// import React, { useState, useEffect } from 'react'; 
// import TileWMS from 'ol/source/TileWMS.js';
// import TileLayer from 'ol/layer/Tile';
// import { MapBrowserEvent } from 'ol';
// import Map from 'ol/Map';

// import FeatureInfoModal from '../FeatureInfoModal/featureInfoModal';
// import './featureInfo.css';

// export type FeatureInfoProps = {
//     map: Map;
// };

// export default function FeatureInfo ({ map }: FeatureInfoProps){

//     const [updatedValue, setUpdatedValue] = useState<{ layerName: string, attributeName: string, value: string }[]>([]); 

//     useEffect(() => {
//         const handleClick = (evt: MapBrowserEvent<any>) => {                
//             const viewResolution = map.getView().getResolution() ?? 0;      

//             let tempUpdatedValue: { layerName: string, attributeName: string, value: string }[] = [];

//             map.getLayers().forEach(layer =>  {      
//                 if (layer instanceof TileLayer) {
//                     const isLayerQueryable = layer.get('queryable') ?? false;
//                     const isLayerVisible = layer.get('visible') ?? false;
//                     const name = layer.get('name');

//                     if (isLayerQueryable && isLayerVisible) {
//                         const source = layer.getSource();

//                         if (source instanceof TileWMS) {
//                             const hitTolerance = 100;
//                             const url = source?.getFeatureInfoUrl(
//                                 evt.coordinate,
//                                 viewResolution,
//                                 'EPSG:3857',
//                                 { 'INFO_FORMAT': 'application/json', 'BUFFER': hitTolerance.toString() }
//                             );

//                             if (url) {                                              
//                                 fetch(url)
//                                 .then((response) => {
//                                     if (!response.ok) {
//                                         throw new Error('Network response was not ok');
//                                     }
//                                     return response.json();
//                                 })                                                  
//                                 .then((responseObject) => {
//                                     if (responseObject.features && responseObject.features.length > 0) {
//                                         const properties = responseObject.features[0].properties;       
//                                         Object.keys(properties).forEach(key => {
//                                             const value = properties[key];
//                                             tempUpdatedValue.push({ layerName: name, attributeName: key, value: `${value}` }); 
//                                         });
//                                         setUpdatedValue([...tempUpdatedValue]);                             
//                                     }
//                                 })
//                                 .catch(error => {
//                                     console.log('my error is ', error);
//                                     alert('Sorry, es ist ein Fehler aufgetreten') 
//                                 });
//                             }
//                         }
//                     }
//                 };
//             });
//         };

//         map.on('singleclick', handleClick); 

//         return () => {
//             map.un('singleclick', handleClick); 
//         };
        
//     }, [map]); 

//     const handleCloseModal = () => {
//         setUpdatedValue([]);
//     };

//     return (
//         <>
//             {/* <div id='info' className ='info'> 
//                 {updatedValue.map((item, index) => (
//                     <div key={index}>{item.layerName} / {item.attributeName}: {item.value}</div>
//                 ))}
//             </div> */}
//             <FeatureInfoModal 
//                 map={map} 
//                 updatedValue={updatedValue} 
//                 setUpdatedValue={setUpdatedValue} 
//                 onClose={handleCloseModal} 
//             />
//         </>
//     )
// }

// was ist mit Einheiten zu den verschiedenen Eigenschaften???? 

// funktioniert
    // import React, { useEffect, useState } from 'react'; 
    // import TileWMS from 'ol/source/TileWMS.js';
    // import TileLayer from 'ol/layer/Tile';
    // import { MapBrowserEvent } from 'ol';
    // import Map from 'ol/Map';

    // import FeatureInfoModal from '../FeatureInfoModal/featureInfoModal';
    // import './featureInfo.css';


    // export type FeatureInfoProps = {
    //     map: Map;
    // };

    // export default function FeatureInfo ({ map }: FeatureInfoProps){

        
    //     // useState (hook-function) um den Zustand einer Komponente zuverwalten -> updateValue = aktueller Zustandswert, setUpdatevalue = Funktion, um Zustand zu aktualisieren
    //     const [updatedValue, setUpdatedValue] = useState<{ layerName: string, attributeName: string, value: string }[]>([]); // (Typ des Zustands) Array, der Objekte enthält, die keys name und value haben
    //                                                                                             // ([]) -> inital state leerer Array 
    //     useEffect(() => {
    //         const handleClick = (evt: MapBrowserEvent<any>) => {                // function for dealing with a click in the Browser 
                
    //             const viewResolution = map.getView().getResolution() ?? 0;      // aktueller Kartenausschnitt und aktuelle Auflösung um den geclickten Punkt möglichst genau an GeoServer zurückzugeben
    //             // TODO make use of the existing layers in the map
                
    //             let tempUpdatedValue: { layerName: string, attributeName: string, value: string }[] = [];

    //             // console.log(map.getLayers());
    //             map.getLayers().forEach(layer =>  {      // iterate over all layers 
                    
    //                 if (layer instanceof TileLayer) {
    //                     const isLayerQueryable = layer.get('queryable') ?? false;
    //                     const isLayerVisible = layer.get('visible') ?? false;
    //                     const name = layer.get('name');

    //                     if (isLayerQueryable && isLayerVisible) {
    //                         const source = layer.getSource();

    //                         if (source instanceof TileWMS) {
    //                             const hitTolerance = 100;
    //                             const url = source?.getFeatureInfoUrl(
    //                                 evt.coordinate,
    //                                 viewResolution,
    //                                 'EPSG:3857',
    //                                 { 'INFO_FORMAT': 'application/json', 'BUFFER': hitTolerance.toString() }
    //                             );
    //                     // console.log(url)  
                
    //                             if (url) {                                              // sofern die URL true ist 
    //                                 fetch(url)
    //                                 .then((response) => {
    //                                     if (!response.ok) {
    //                                         throw new Error('Network response was not ok');
    //                                     }
    //                                     return response.json();
    //                                 })                                                  // response auf Anfrage der URL 
    //                                     .then((responseObject) => {
    //                                         // console.log(responseObject);
    //                                         if (responseObject.features && responseObject.features.length > 0) {
                                
    //                 // !!! Gray Index gibt es für Vector-Daten auf jeden Fall nicht 
    //                 // !!! Toleranz-Bereich für Vector-Data, da man diese sonst nie angezeigt bekommt?! 
    //                 // !!! ToleranzBereich anzeigen lassen? 
                    
    //                                             // const grayIndex = responseObject.features[0].properties.GRAY_INDEX; // von der response den Gray, index abfragen;
                                                
    //                                             const properties = responseObject.features[0].properties;       // alle Properties anzeigen lassen 
    //                                             Object.keys(properties).forEach(key => {
    //                                                 const value = properties[key];

    //                                                 // console.log(grayIndex);
    //                                                 tempUpdatedValue.push({ layerName: name, attributeName: key, value: `${value}` });       // zum Array die neuen Informationen des Layers hinzufügen 
    //                                             });
                                                
    //                                             setUpdatedValue([...tempUpdatedValue]);                             // die updatedValues werden bei jeder Iteration dem Array hinzugefügt 
    //                                                     // setValue({name: name, value: `${grayIndex}`}); // Ursprünglich, dann wird immer nur der letzte Value festgehalten 
                                                
    //                                         }
    //                                     })

    //                                 .catch(error => {

    //                                     console.log('my error is ', error);
    //                                     alert('Sorry, es ist ein Fehler aufgetreten') // TODO Show user an error -> kann man sicherlich noch etwas schöner gestalten 
    //                                 });
    //                             }
    //                         }
    //                     }
    //                 };
                    
    //             });
                
    //             // To Do show results only for selected attributes 
    //         };
                
                

    //         map.on('singleclick', handleClick); //

    //         return () => {
    //             map.un('singleclick', handleClick); // TODO should be unregister something if the component unmounts?
    //         };
            
            
    //     }, [map]); // TODO what happens if the map prop has changed?
        
            
    //     return (
    //             <div id='info' className ='info'> 
    //                 {updatedValue.map((item, index) => (
    //                 <div key={index}>{item.layerName} / {item.attributeName}: {item.value}</div>
    //                 ))}
    //             </div>            
    //     )
    // }


// {updatedValue.map((item, index) => (
//     <div key={index}>{item.layerName} - {item.attributeName}: {item.value}</div>
// ))}

// Basis FeatureInfo für jeden sichtbaren und queryable Layer ausgeben lassen (aber nur der letzte in der Konsole!) 
// import React, { useEffect, useState } from 'react';
// import Layers from '../../utils/LayerN/LayerN';
// import TileWMS from 'ol/source/TileWMS.js';
// import { MapBrowserEvent } from 'ol';
// import Map from 'ol/Map';

// import './featureInfo.css';
// // import LayerConfig from '../../../conf/config.json';

// export type FeatureInfoProps = {
//     map: Map
// };

// export default function FeatureInfo ({ map }: FeatureInfoProps){

//     // console.log(map)
//     console.log(Layers);
    
//     const [value, setValue] = useState('');
 
//     useEffect(() => {
//         const handleClick = (evt: MapBrowserEvent<any>) => {
//             // console.log(evt.coordinate);
//             const viewResolution = map.getView().getResolution() ?? 0;      // aktueller Kartenausschnitt und aktuelle Auflösung um den geclickten Punkt möglichst genau an GeoServer zurückzugeben
//             // TODO make all* (config.json) layers queryable
//             const layersArray = Layers();

//             for (const layer of layersArray) {
                
//                 const isLayerQueryable = layer.get('queryable') ?? false;
//                 const isLayerVisible = layer.get('visible') ?? false; 
//                 console.log(isLayerVisible);

//                 if (isLayerQueryable && isLayerVisible) {
//                     const source = layer.getSource();
//                     console.log(source)
//                 if (source instanceof TileWMS) {                                    // sofern die Quelle TileWMS ist -> kann getFeatureInfo abgerufen werden 
//                 const url = source?.getFeatureInfoUrl(                             // mit der Eventkoordinate, der aktuellen Auflösung/Kartenausschnitt, dem CRS und dem Format für die Ausgabe 
//                     evt.coordinate,
//                     viewResolution,
//                     'EPSG:3857',
//                     { 'INFO_FORMAT': 'application/json' }                          
//                 );
//                 // console.log(url)  
        
//                 if (url) {
//                     fetch(url)
//                         .then((response) => response.json())
//                         .then((responseObject) => {
//                             console.log(responseObject);
//                             if (responseObject.features && responseObject.features.length > 0) {
//                                 const grayIndex = responseObject.features[0].properties.GRAY_INDEX;
//                                 console.log(grayIndex);
//                                 setValue(`${grayIndex}`); /*GRAY_INDEX: */
//                             }
//                         })
//                         .catch(error => {
                            
//                             console.log('my error is ', error);
//                             alert('Sorry, es ist ein Fehler aufgetreten') // TODO Show user an error -> kann man sicherlich noch etwas schöner gestalten 
//                         });
//                 }
//                 }
//                 };
//             }
//         }
            
            

//         map.on('singleclick', handleClick); //

//         return () => {
//             map.un('singleclick', handleClick); // TODO should be unregister something if the component unmounts?
//         };
        
        
//     }, [map]); // TODO what happens if the map prop has changed?
    
        
//     return (
//             <div id='info' className ='info'>Value: {value} </div>            
//     )
// }


// map.on('singleclick', function (evt) {                      // map.on - Arbeiten auf der map; on ist die Methode -> zwei Argumente - vordefiniertes Event! singeclick/dblclick/click; 
//     //funktion mit einem Event und ist eine Callbackfunktion, weil sie erst abgerufen wird, wenn geclickt wird
//  console.log(evt.coordinate)                               // Coordinaten des Events werden ausgegeben 
//  const infoElement = document.getElementById('info')
//  if(infoElement) {               
//      infoElement.innerHTML = '';
//      const viewResolution = evt.map.getView().getResolution() ?? 0;      // aktueller Kartenausschnitt und aktuelle Auflösung um den geclickten Punkt möglichst genau an GeoServer zurückzugeben
//      const source = layers[7]?.getSource();                               // Quelle des Layers (auf position 1 des Arrays)
//      if (source instanceof TileWMS) {                                    // sofern die Quelle TileWMS ist -> kann getFeatureInfo abgerufen werden 
//          const url = source.getFeatureInfoUrl(                             // mit der Eventkoordinate, der aktuellen Auflösung/Kartenausschnitt, dem CRS und dem Format für die Ausgabe 
//                      evt.coordinate,
//                      viewResolution,
//                      'EPSG:3857',
//                      { 'INFO_FORMAT': 'application/json' }                           // am besten und einfachsten zu lesen 
//          );
//          console.log(url)                                                   // url zu den Features 
//           if (url) {
//          fetch(url)                                                          // url abrufen und den Text zurückgeben lassen also object 
//              .then((response) => response.json())
//              .then((responseObject) => {
//          console.log(responseObject);                                   // Object anzeigen lassen 

//          let fet = responseObject.features[0].properties.GRAY_INDEX;
//          console.log(fet);

//          infoElement.innerHTML = `GRAY_INDEX: ${fet}`;
//      })
//              .catch(error => {
//          console.log('my error is ', error)                             // falls url fehlerhaft ist wird ein Fehler gemeldet 
//          });
//      }
//     }
// }
// target: infoElement
// });


// export default function addFeatureInfo() {
    
    // function handleClick(){
    //     alert('You clicked me')
    // }
   
    // console.log(info(onclick));
    // const [info, setInfo] = useState('');

    // function handleClick(){
    //     // setInfo(info, );
    // }

 
    // const layers = Layers(); 
    
    


//     return(
//         <button id='info' className ='info' onClick={}>value: {}</button>
//     )
// }


// Hinzufügen in dok.css 
    // #info{
    //     position: fixed;
    //     bottom: 30px;
    //     right: 15px;
        
        
    //     /* padding: 5px; */
    //     border: 1px solid black; 
    //     z-index: 100; 
    //     background-color: cornsilk;
    //   }