import { useState, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom';


export function Modal({uploadObject, setUploadObject, searchPath, onConfirm}) {
    if (!uploadObject.isModalOpen) return null;

    console.log(uploadObject);
    let fileObject = uploadObject.newFiles[0];
    let uploadPath = searchPath.replace(/^\/+|\/+$/g, '') + '/' + fileObject.name

    return ReactDOM.createPortal(
        <>
            <div className="overlay">
                <div className='upload-popup'>
                    <button className='close-btn' onClick={() => setUploadObject({
                        isModalOpen: false,
                        newFiles: []
                    })}></button>
                    <h3>Confirm Upload Path</h3>
                    <p>path: <strong>{uploadPath}</strong></p>
                    <button className='upload-popup-btn' onClick={() => onConfirm(uploadObject.newFiles)}>Confirm</button>
                    <button className='upload-popup-btn' onClick={() => setUploadObject({
                        isModalOpen: false,
                        event: []
                    })}>Close</button>
                </div>

            </div>
        </>,
        document.getElementById('modal')
    )
}