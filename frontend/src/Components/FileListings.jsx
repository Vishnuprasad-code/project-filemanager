import { fetchDownloadresponse, fetchUploadresponse } from '../http.js';
import { useState, useRef, useEffect } from 'react'
import { Modal } from './Modal.jsx'


export function FileListings({ searchPath, isFetching, bucketName, fileList, onSearch }) {
    const [uploadObject, setUploadObject] = useState({
        isModalOpen: false,
        newFiles: []
    });
    const [isUploading, setIsUploading] = useState(false);

    function handleTraverse(row) {
        (row.type === 'Folder') && onSearch(
            searchPath.replace(/^\/+|\/+$/g, '') + '/' + row.fileName);
    }

    async function handleDownload(row) {
        const objectName = searchPath.replace(/^\/+|\/+$/g, '') + '/' + row.fileName
        const responseData = await fetchDownloadresponse(
            bucketName,
            objectName.replace(/^\/+|\/+$/g, '')
        )
        const link = document.createElement('a');
        link.href = responseData.url;
        link.target = '_blank';
        link.setAttribute(
            'download',
            row.fileName,
        );

        // Append to html link element page
        document.body.appendChild(link);

        // Start download
        link.click();

        // Clean up and remove the link
        link.parentNode.removeChild(link);
    }

    const handleDragEnter = (e) => {
        e.preventDefault();
    };
    
    const handleDragLeave = (e) => {
        e.preventDefault();
        // setDragging(false);
    };
    
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    function sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function handleUploadConfirmation(event) {
        event.preventDefault();
        console.log('handleUploadConfirmation:');
        const newFiles = [...event.dataTransfer.files];
        console.log(newFiles);
        setUploadObject({
            isModalOpen: true,
            newFiles: newFiles,
        })
        await onSearch(
            searchPath.replace(/^\/+|\/+$/g, '') + '/');

    }
    async function handleUpload(newFiles) {
        setIsUploading(true);
        const fileObject = newFiles[0];
        const uploadPath = searchPath.replace(/^\/+|\/+$/g, '') + '/' + fileObject.name
        const formData = new FormData();
        formData.append("file_to_upload", fileObject);
        formData.append('bucket_name', bucketName);
        formData.append('upload_path', uploadPath);
        console.log(formData);
        const responseData = await fetchUploadresponse(
            formData
        )
        console.log(responseData);

        // await sleep(5000);
        setIsUploading(false);
    }

    return (
        <>
        <Modal
            uploadObject={uploadObject}
            setUploadObject={setUploadObject}
            onConfirm={handleUpload}
            searchPath={searchPath}/>
        <div
            id="listing-panel"
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleUploadConfirmation}
        >
            <div className="listing-header">
                <div className="listing-header-item listing-cell-type">Type</div>
                <div className="listing-header-item listing-cell-name">Name</div>
                <div className="listing-header-item listing-cell-file-size">
                File Size
                </div>
                <div className="listing-header-item listing-cell-last-modified">
                Last Modified
                </div>
                <div className="listing-header-item listing-cell-download">Download</div>
            </div>
            {!isFetching && !isUploading && fileList.length > 0 && fileList.map((row, rowIndex) => (
            <ul className="listing-row" key={rowIndex}>
                <li className="listing-cell-item listing-cell-type">{row.type}</li>
                {
                    row.type === 'File'
                    ?
                    <li className="listing-cell-item listing-cell-name">{row.fileName}</li>
                    :
                    <li className="listing-cell-item listing-cell-name" onClick={() => handleTraverse(row)}>{row.fileName}</li>
                }
                <li className="listing-cell-item listing-cell-file-size">{row.sizeInfo.displaySize}</li>
                <li className="listing-cell-item listing-cell-last-modified">{row.lastModified}</li>
                {
                    row.type === 'File'
                    ?
                    <li className="listing-cell-item listing-cell-download">
                        <img src="downloaded-symbol-svgrepo-com.svg" alt="!" onClick={() => handleDownload(row)} />
                    </li>
                    :
                    <li disabled className="listing-cell-item listing-cell-dummy"></li>
                }
            </ul>
            ))}
        </div>
        </>
    )

}