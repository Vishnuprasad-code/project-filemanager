import { useState, useRef, useEffect } from 'react'

import { fetchFilePaths } from '../http.js';
import { FileListings } from './FileListings.jsx'
import { FilePathSearchBar } from './FilePathSearchBar.jsx'


export function ListPanel({ bucketName }) {
    const [fileList, setFileList] = useState([]);
    const [searchPath, setSearchPath] = useState("");
    const [isFetching, setIsFetching] = useState(false);

    function sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function handleSearchPathClick(directory){
        console.log('Go Clicked');
        setIsFetching(true);
        const newSearchPath = directory.replace(/^\/+|\/+$/g, '')
        const responseData = await fetchFilePaths(
            bucketName,
            newSearchPath,
        );
        setFileList(responseData.filePaths);
        setSearchPath(responseData.prefix);
        // await sleep(5000);
        setIsFetching(false);
    }

    function handleDownload(fileName){
        console.log(fileName);
    }
    return (
        <>
        <FilePathSearchBar
            searchPath={searchPath}
            setSearchPath={setSearchPath}
            isFetching={isFetching}
        />
        <FileListings
            searchPath={searchPath}
            isFetching={isFetching}
            bucketName={bucketName}
            fileList={fileList}
            onSearch={handleSearchPathClick}
        />   
        </>
    )
};