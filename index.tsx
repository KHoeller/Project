import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
} else {
    console.log('No DIV with ID root found!')
}

// <!DOCTYPE html>
// <html>
//   <head>
//     <meta charset="UTF-8">
//     <title>Tiled WMS</title>
//     <style>
//         @import "node_modules/ol/ol.css";
//     </style> 
//     <style> 
//       html, body,
//       #map {  
//         position: fixed;
//         top: 0; 
//         left: 0;
//         width: 100%;
//         height: 100%;
//         font-family: sans-serif;
//       } 
//       #info{
//         position: fixed;
//         bottom: 30px;
//         right: 15px;
        
        
//         /* padding: 5px; */
//         border: 1px solid black; 
//         z-index: 100; 
//         background-color: cornsilk;
//       }

//       #wrapper{
//         /* padding: 5px; */
//         border: 1px solid black; 
//         z-index: 100; 
//         background-color: white;
//       }
//     </style>
//   </head>
//   <body>
   
//     <div id="map"> </div> 

//     <div id="wrapper">
//       <div id = "location">
//         <div id = 'mouse-position' class = "Custom-mouse-position"></div>
//     </div>
      
//     <div id = "info">&nbsp;</div>

//     <script type="module" src="./main_test.ts"></script>
    
//     </div>
//   </body>
// </html>
