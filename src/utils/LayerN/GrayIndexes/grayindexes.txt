// get feature Info für verschiedene Jahre für geclickten Pixel


  //// 

  const layerNames = map.getLayers().getArray().map(layer => layer.get('name')).filter(name => name && name.startsWith('R'));
  const years = map.getLayers().getArray().map(layer => layer.get('year')).filter(year => year !== undefined && year !== false);;
  console.log('year:', years);          // nur Jahre Rasterlayer
  console.log('layername', layerNames); // nur LayerNamen Rasterlayer

  const url1 = 'http://localhost:8080/geoserver/Umwelt-Gesundheit/wms?REQUEST=GetFeatureInfo&QUERY_LAYERS=';
  const url2 = '&SERVICE=WMS&VERSION=1.3.0&FORMAT=image%2Fpng&STYLES=&TRANSPARENT=true&';
  const url3 = '&INFO_FORMAT=application%2Fjson&BUFFER';

  // String split()
  // String join()
  // URL

  // TODO: es fehlt noch dieser Teil der URL =100&I=221&J=247&WIDTH=256&HEIGHT=256&CRS=EPSG%3A3857&BBOX=768039.2602094524%2C6589483.334408475%2C772931.2300197036%2C6594375.304218726

  const finalUrl = layerNames.map(layer => {
      const layerUrl = `${url1}${layer}${url2}${layer}${url3}`;
      return layerUrl;
  })

  console.log('array mit URL:', finalUrl)

  ////

  
// kompletter Link: http://localhost:8080/geoserver/Umwelt-Gesundheit/wms?REQUEST=GetFeatureInfo&QUERY_LAYERS=
// R_NOx_2018
// &SERVICE=WMS&VERSION=1.3.0&FORMAT=image%2Fpng&STYLES=&TRANSPARENT=true&LAYERS=
// R_NOx_2018&INFO_FORMAT=application%2Fjson&BUFFER
// =100&I=221&J=247&WIDTH=256&HEIGHT=256&CRS=EPSG%3A3857&BBOX=768039.2602094524%2C6589483.334408475%2C772931.2300197036%2C6594375.304218726