export async function fetchFilePaths(bucketName, prefix) {
    const requestOptions = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            bucket_name: bucketName,
            prefix: prefix || ''
        }),
    }

    const response = await fetch('/api/s3/list', requestOptions);
    const resData = await response.json();
    if (!response.ok) {
      throw new Error('Failed to fetch places');
    }
  
    return resData.data;
  }
  
export async function fetchDownloadresponse(bucketName, objectName) {
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
  },
      body: JSON.stringify({
          bucket_name: bucketName,
          object_name: objectName
      }),
  }

    const response = await fetch('/api/s3/download', requestOptions);
    const resData = await response.json();
    if (!response.ok) {
      throw new Error('Failed to fetch download response');
    }

    return resData.data;
}


export async function fetchUploadresponse(formData) {
  const requestOptions = {
    method: 'POST',
    body: formData,
  }

  const response = await fetch('/api/s3/upload', requestOptions);
  const resData = await response.json();
  if (!response.ok) {
    throw new Error('Failed to fetch upload response');
  }

  return resData.data;
  }