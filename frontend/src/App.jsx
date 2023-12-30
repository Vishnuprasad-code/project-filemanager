import { useState, useEffect } from 'react'
import { ListPanel } from './Components/ListPanel.jsx'

function App() {
  const [credentails, setCredentials] = useState({})

  function handleConnect(event){
    event.preventDefault();
    let inputCredentials = new FormData(event.target);
    inputCredentials = Object.fromEntries(inputCredentials.entries());
    console.log(inputCredentials);
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputCredentials),
    }
    fetch('/api/s3/connect', requestOptions)
      .then((response) => {
        return response.json();
      })
      .then((resData) => {
        console.log(resData)
        setCredentials(resData.data)
      });
  }

  return (
    <div id="container">
      <form className="credential-form" onSubmit={handleConnect}>
        <div className="credential-element-wrap">
          <div className="credential-element">
            <label htmlFor="aws_access_key_id">Access Key*: </label>
            <input type="text" name="aws_access_key_id" />
          </div>
          <div className="credential-element">
            <label htmlFor="aws_secret_access_key">Sectret Key*:</label>
            <input type="text" name="aws_secret_access_key" />
          </div>
          <div className="credential-element">
            <label htmlFor="bucket_name">Bucket*: </label>
            <input type="text" name="bucket_name" />
          </div>
          <div className="credential-element">
            <label htmlFor="region_name">Region Name: </label>
            <input type="text" name="region_name" placeholder="us-east-1" />
          </div>
          <div className="credential-element">
            <label htmlFor="config">Config: </label>
            <input type="text" name="config" placeholder="s3v4" />
          </div>
        </div>
        <button className="credential-submit" type="submit">Connect</button>
      </form>

      <ListPanel bucketName={credentails.bucket_name} />
    </div>
  )
}

export default App
