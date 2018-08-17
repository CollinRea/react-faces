import React from 'react';

import './FaceRecognition.css';

const FaceRecognition = ({imageUrl, boxData}) => {
  return ( 
    <div className="center ma pa3">
      <div className="absolute mt2">
        <img id="inputimage" src={imageUrl} width="500px" height="auto" alt=""/>
        {
          boxData.map(box => {
            return (
              <div 
                className='bounding-box' 
                key={"key" + box.topRow + box.bottomRow}
                style={{
                  top: box.topRow, 
                  right: box.rightCol, 
                  bottom: box.bottomRow, 
                  left: box.leftCol
                }}></div>
            )
          })
        }
      </div>
    </div>
  )
}


export default FaceRecognition;