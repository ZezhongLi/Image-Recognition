import React from 'react'
import './ImageRecognition.css'

const ImageRecognition = ({imageUrl, boxes}) => {
    const boxSet = boxes.map((box, i) => {
        return (
            <div key = {i} 
                className='bounding-box' 
                style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}>
            </div>
        )
    });
    return (
        <div className = 'center center ma'>
            <div className = 'absolute mt2'>
                <img id = 'input-image'
                    alt = ''
                    src = {imageUrl} 
                    width = '500px'
                    height = 'auto'
                />
                { boxSet }
            </div>
        </div>
    );
}

export default ImageRecognition;