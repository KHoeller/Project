// Root Document (App)

// imports from OSM 
import Map from 'ol/Map';   
import View from 'ol/View.js';
import {ScaleLine, defaults as defaultControls} from 'ol/control.js';

import React, { useMemo } from 'react';

// import Object with Layers 
import Layers from "./src/utils/LayerN/LayerN";
// import MapView and ZoomLevel
import { mapView } from './conf/config.json'; 

import './General.css';

// import Components 
import MapComp from './src/components/Map/Map';
import FeatureInfo from './src/components/FeatureInfo/featureInfo';
import Toolbar from './src/components/Toolbar/toolbar';
import Sidebar from './src/components/Sidebar/sidebar';
// import NominatimSearch from './src/components/Search/search';

export default function App () {
    console.log(mapView);

    const scaleControl = useMemo(() => new ScaleLine(), []);
   
    const map = useMemo(() => { 
        return new Map({  
            controls: defaultControls().extend([scaleControl]),                      
            layers: Layers(),                   // damit Array statt der Funktion verwendet wird 
            view: new View({                    // initial view
                center: mapView.center,
                zoom: mapView.zoom            
            }),
        });
    }, [scaleControl]) 
    
  

    return ( 
        <> 
            <MapComp
                map={map} />  

            {/* <NominatimSearch map={map}/> */}
            <FeatureInfo
                map={map} />   
            
            <Toolbar/>

            <Sidebar map={map}/>

        </>
    )
}






// import [componentname] from './filename'; oder
// import {componentname} from './filename';

// export default function [NAME] (){
    // return (); 
// }

// {} -> reads the value of a javaScript 
// <img className = '' src='' alt='' width={} heigth0{} /> 

// example: 

// export function Name(){} -> aufrufen in anderem File mit Namen -> import {Name} from '';
// export default function ->aufrufen und neuen Namen vergeben -> import xName from ''; (meist gleicher Name wie export default function)

// Arrays
    // ADD:
    // setArtists( // Replace the state
    //   [ // with a new array
    //     ...artists, // that contains all the old items
    //     { id: nextId++, name: name } // and one new item at the end
    //   ]
    // );                                   // oder neues ArrayElement davor setzen 
            // statt:
                // artists.push({
                    //   id: nextId++,
                    //   name: name,
                    // });

    // Filter/remove
    // setArtists(
        //  artists.filter(a =>
        //  a.id !== artist.id
        //  )
    // );    --> no modification at the original array!!!! 

    // Transform
        // function handleClick() {
        //     const nextShapes = shapes.map(shape => {
        //       if (shape.type === 'square') {
        //         // No change
        //         return shape;
        //       } else {
        //         // Return a new circle 50px below
        //         return {
        //           ...shape,
        //           y: shape.y + 50,
        //         };
        //       }
        //     });


// immer - library (not important for me?)


    // import { useState } from 'react';
    // import { sculptureList } from './data.js';

    // export default function Gallery() {
    //   const [index, setIndex] = useState(0);
    //   const [showMore, setShowMore] = useState(false);

    //   const hasNext = index < sculptureList.length - 1;      // give a maximum to the index -> it must be smaller than the length of the sculpturelist
    //   const hasPrevious = index >= 1;
    
    //   function handleNextClick() {
    //     if (hasNext){setIndex(index + 1);}
    //   }
    //   function handlePreviousClick() {
    //     if (hasPrevious) {setIndex(index - 1);}
    //   }
    //   function handleMoreClick() {
    //     setShowMore(!showMore);
    //   }
    //   let sculpture = sculptureList[index];
    //   return (
    //     <>
    //          <button onClick={handlePreviousClick}
    //            disabled ={!hasPrevious}>                 // when hasPrevious nicht true ist, dann wird der Button ausgegraut 
    //           Previous </button>                         // Schrift auf dem button 
    //         <button onClick={handleNextClick}>
    //           Next </button>
    //       <h2>
    //         <i>{sculpture.name} </i> 
    //         by {sculpture.artist}
    //       </h2>
    //       <h3>  
    //         ({index + 1} of {sculptureList.length})
    //       </h3>
    //       <button onClick={handleMoreClick}>
    //         {showMore ? 'Hide' : 'Show'} details
    //       </button>
    //       {showMore && <p>{sculpture.description}</p>}
    //       <img 
    //         src={sculpture.url} 
    //         alt={sculpture.alt}
    //       />
    //     </>
    //   );
    // }



// reactions on click 
    // export default function Button{
    // function handleClick () {                    // this is a Event Handler Function -normally named with handle + usually defined inside your components
    //     alert('You clicked on me!')
    // }
    // return (
    //     <button onClick={handleClick}> Click me </button> // <> hier kann ein Text stehen, der dort stehen soll</> (dazwischen sind keine Interaktionen)
    // );}
        // onClick ist eine feststehende FUnktion, bei der auf Klick etwas passiert, in diesem Fall entsprechend der obigen Funktion ein Fenster öffnen 
        // handleClick was püassed like a prop to <button> 
    // passing a function: <button onClick={handleClick}>       // remember the function and only call it when the user clicks the button 
        // alternative: <button onClick={() => alert('')}> -> must be an anonymous function
    // calling a function (incorrect in this case): <button onClick={handleClick()}   // immediately called during rendering without clicks 

    // an event propagates up the tree, so if buttons of children are over these of parents, 
    // than first the children and then the parent button would be executed (when clicking on the children button)
        // to stopthis propagation: use event object (e) <button onClick={e => {e.stopPropagation(); onClick();}}>
        // <button onClick={e => {
        //     e.stopPropagation();
        //     onChangeColor();
        //   }}>



// state = data that changes over time, addable to any component and update it as needed 
// state is also usable for the components memory; change as a result of an interaction 
// The useState Hook provides those two things:   // function starting with “use”, is called a Hook
    //     A state variable to retain the data between renders.
    //     A state setter function to update the variable and trigger React to render the component again.
// state is local to a component; if you render the same component twice -> each copy will have completely isolated state

// use State: const [index, setIndex] = useState(0); -> convention that something (current state), setSomething (function to update state); number in braces - intial value 


// pure functions
    // given the same input, it should be the same output/result; react assume that every component is a pure function 

// Rendering Lists:
// manipulate an array with filter or map 

    // map -> to copy the elements of an array to a new one
    // filter - to filter specific elements according a value 
    // arrays/objects should have a key to identify the elements probably even when elements are deleted 
    // add keys with a stable ID based on the data 

// Conditions 
    // if (isPacked) {
    //     return <li className="item">{name} ✔</li>;
    //   }
    //   return <li className="item">{name}</li>;

// return (
//     <li className='item'>
//         {isaPacked ? name + 'check' : name}
//     </li>
// );


// function Item({ name, isPacked }) {
//     return (
//       <li className="item">
//         {isPacked ? (
//           <del>                              // durchstreichen 
//             {name + ' ✔'}
//           </del>
//         ) : (
//           name
//         )}
//       </li>
//     );
// }
  
// AND Operator && 
    // return (
    //     <li className="item">
    //       {name} {isPacked && '✔'}
    //     </li>
    //   );
    // -> “if isPacked, then (&&) render the checkmark, otherwise, render nothing”.


// function Profile(props) {
//     return (
//       <div className="card">
//         <Avatar {...props} />
//       </div>
//     );
// }                                // alle props von Avatar einladen 


// Props information passed from parent to child)
// function Avatar() {
//     return (
//       <img
//         className="avatar"
//         src="https://i.imgur.com/1bX5QH6.jpg"
//         alt="Lin Lanying"
//         width={100}
//         height={100}
//       />
//     );
// }
  
//   export default function Profile() {
//     return (
//       <Avatar />
//     );
//   }  // infos about scr, width etc are assed to component Profile 


// File 1: 
    // import Gallery from './Gallery.js'; // import Gallery as a default import from the file Gallery.js 

    // export default function App() {      // export the App component
    //   return (
    //     <Gallery />
    //   );
    // }

// File 2:
// function Profile() {                     // function could only be used within the same file, is not exported 
//     return (
//       <img
//         src="https://i.imgur.com/QIrZWGIs.jpg"
//         alt="Alan L. Hart"
//       />
//     );
//   }
  
//   export default function Gallery() {    // export Gallery component
//     return (
//       <section>
//         <h1>Amazing scientists</h1>
//         <Profile />
//         <Profile />
//         <Profile />
//       </section>
//     );
//   }
  
