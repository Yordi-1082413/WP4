// apiexample.js
import React, { useState, useEffect } from 'react';

function ApiExample() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/exampleadmin', {
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => setData(data.message))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div>
      {data ? `Message from API: ${data}` : 'Loading...'}
    </div>
  );
}

export default ApiExample;
