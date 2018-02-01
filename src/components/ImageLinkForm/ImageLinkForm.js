import React from 'react';
import './ImageLinkForm.css'

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
    return (
        <div>
            <p className = 'f3 white'>
                { 'This Magic Brain will detect faces in your pictures. Give it a try!' }
            </p>
            <div className = 'center'>
                <div className = 'form center pa4 br3 shadow-5'>
                    <input 
                        className = 'f3 pa2 w-70 center' 
                        type = 'tex' 
                        onChange = {onInputChange}
                    />
                    <button 
                        className = 'w-40 grow f4 link ph3 pv2 dib white bg-light-purple pointer br3'
                        onClick = {onButtonSubmit}>
                        Detect
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ImageLinkForm;