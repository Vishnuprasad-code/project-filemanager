import { useState, useRef, useEffect } from 'react'


export function FilePathSearchBar({ searchPath, isFetching, onSearch }) {
    const searchPathRef = useRef();
    return (
        <div id="search-bar">
            <img src="search-in-folder-svgrepo-com.svg" alt="" id="root-folder-image" />
            <input
                ref={searchPathRef}
                className="search-bar-input"
                type="text"
                name="searh_path"
                value={searchPath}
            />
            <button
                className="search-go-btn"
                disabled={isFetching}
                onClick={() => onSearch(searchPathRef.current.value)}>
                    GO
            </button>
      </div>
    )
}