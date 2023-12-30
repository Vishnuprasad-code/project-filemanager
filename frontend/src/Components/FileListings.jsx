import { fetchDownloadresponse, fetchUploadresponse } from '../http.js';


export function FileListings({ searchPath, isFetching, bucketName, fileList, onSearch }) {

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
    
    const handleDragLeave = () => {
        setDragging(false);
    };
    
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    async function handleUpload(event) {
        event.preventDefault();
        const fileObject = event.dataTransfer.files[0];
        const uploadPath = searchPath.replace(/^\/+|\/+$/g, '') + '/' + fileObject.name
        const formData = new FormData();
        formData.append("file_to_upload", fileObject);
        formData.append('bucket_name', bucketName);
        formData.append('upload_path', uploadPath);

        const responseData = await fetchUploadresponse(
            formData
        )
        console.log(responseData);
    }

    let downloadSvg = <svg fill="#000000" height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 29.978 29.978" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M25.462,19.105v6.848H4.515v-6.848H0.489v8.861c0,1.111,0.9,2.012,2.016,2.012h24.967c1.115,0,2.016-0.9,2.016-2.012 v-8.861H25.462z"></path> <path d="M14.62,18.426l-5.764-6.965c0,0-0.877-0.828,0.074-0.828s3.248,0,3.248,0s0-0.557,0-1.416c0-2.449,0-6.906,0-8.723 c0,0-0.129-0.494,0.615-0.494c0.75,0,4.035,0,4.572,0c0.536,0,0.524,0.416,0.524,0.416c0,1.762,0,6.373,0,8.742 c0,0.768,0,1.266,0,1.266s1.842,0,2.998,0c1.154,0,0.285,0.867,0.285,0.867s-4.904,6.51-5.588,7.193 C15.092,18.979,14.62,18.426,14.62,18.426z"></path> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </g> </g></svg>
    return (
        <div
        id="listing-panel"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleUpload}
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
            {!isFetching && fileList.length > 0 && fileList.map((row, rowIndex) => (
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
                    <li className="listing-cell-item listing-cell-download" onClick={() => handleDownload(row)}>{downloadSvg}</li>
                    :
                    <li disabled className="listing-cell-item listing-cell-dummy"></li>
                }
            </ul>
            ))}
        </div>
    )

}