
// import [componentname] from './filename'; oder
// import {componentname} from './filename';

// export default function [NAME] (){
    // return (); 
// }

// {} -> reads the value of a javaScript 
// <img className = '' src='' alt='' width={} heigth0{} /> 





// example: 

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
  
