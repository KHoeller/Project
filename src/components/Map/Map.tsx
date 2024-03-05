import './Map.css';

// import './myComponentStyle.css';

export default function Map () {
    return (
        <div 
          id='map' 
          className ='map'> 
        </div>
    );
}

// CSS
    // {
    //     position: fixed;
    //     top: 0; 
    //     left: 0;
    //     width: 100%;
    //     height: 100%;
    //     font-family: sans-serif;
    // }

// Alternative zu extra CSS-Datei:
    // export default function Map () {
    //     return (
    //         <div 
    //           id='map' 
    //           className ='map'
    //           style={{
    //             position: 'fixed',
    //             top: 0, 
    //             left: 0,
    //             width: '100%',
    //             height: '100%',
    //             fontFamily: 'sans-serif' 
    //           }}
    //         >
    
    //         </div>
    //     );
    // }