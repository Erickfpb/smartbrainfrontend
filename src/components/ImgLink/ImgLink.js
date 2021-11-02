import React from 'react';
import './ImgLink.css'

const ImgLink = ({ onInputChange, onButtonSubmit }) => {
    return(
    <div>
        <p className='f2'>
            {'¡THIS LITTLE BRAIN WILL DETECT A FACE IN YOUR PICTURES!'}
        </p>
        <p className='f5'>
            {'Place the "URL" of a picture with a face in the box!'}
        </p>
        <div className='center'>
            <div className='form center pa4 br3 shadow-5'>
                <input className='f4 pa2 w-70 center' type='text' onChange={onInputChange}/>
                <button className='w-30 grow f4 link ph3 pv2 dib white bg-light-purple' 
                onClick={onButtonSubmit} 
                >Detect</button>
            </div>
        </div>
    </div>
    );
}

export default ImgLink;