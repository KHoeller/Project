// Versuch die URL der Legende in die Config hinzuzufügen 
import jsondata from '../../../conf/config.json'; //  

const urlWMS = 'https://datahub.uba.de/server/services/VeLa/LK/MapServer/WMSServer?request=GetCapabilities&service=WMS';

async function fetchData() {
    try {
        const response = await fetch(urlWMS);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const responseText = await response.text();

        // Create a new DOMParser object
        const parser = new DOMParser();

        // Parse XML data and get the resulting Document object
        const xmlDoc = parser.parseFromString(responseText, 'text/xml');    

        // Example: Extract layer titles and BoundingBoxes
        const layerElements = xmlDoc.querySelectorAll('Layer');
        // console.log(layerElements) 

        
        
        layerElements.forEach(layerElement => {
            // Extract Title
            const titleElement = layerElement.querySelector('Title');
            const title = titleElement ? titleElement.textContent?.trim() : '';

            // Extract Name (if available)
            const nameElement = layerElement.querySelector('Name');
            const name = nameElement ? nameElement.textContent?.trim() : '';

            // Extract OnlineResource
            const onlineResourceElement = layerElement.querySelector('OnlineResource');
            const onlineResource = onlineResourceElement ? onlineResourceElement.getAttribute('xlink:href') : '';

            // Log or process the extracted information
            // console.log('Layer Title:', title);
            // console.log('Layer Name:', name);
            // console.log('Online Resource:', onlineResource);
            // console.log('------------------');
        
            const wmsLaermGroup = jsondata.groups.find(group => group.groupName === 'Lärmbelastung');

            if (wmsLaermGroup) {
                // Check if a layer with the same title already exists in the group
                const existingLayer = wmsLaermGroup.layers.find(layer => layer.title === title);

                if (!existingLayer) {
                    // Layer with this title does not exist, add it to the group
                    wmsLaermGroup.layers.push({
                        name: name,
                        title: title,
                        urlLegende: onlineResource,
                        visible: false,
                        queryable: false
                    });
                }
            }
        });

        // console.log(jsondata); // Log the updated configuration

        // Hier kannst du die aktualisierte Konfiguration speichern oder weiterverarbeiten

    } catch (error) {
        console.error('Error fetching or parsing WMS Capabilities:', error);
    }
}

// Aufruf der asynchronen Funktion fetchData
fetchData();
