//import React from "react";
//import axios from "axios";

// step 1: design basic structure, input (domain), button (to trigger the ads-info endpoint), table (to show ads-info response)
// step 2: make the input work
// step 3: make the button send an api request with the input value as the domain
// step 4: save the response and show it in the table



import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [domain, setDomain] = useState('');
  const [advertisers, setAdvertisers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDomainChange = (event) => {
    setDomain(event.target.value);
  };

  const handleGetAdsInfo = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/ads-info?domain=${domain}`);
      setAdvertisers(response.data);
    } catch (error) {
      console.error(error);
      setError('Failed to retrieve ads.txt file');
    }
    setIsLoading(false);
  };

  return (
    <div>
      <label htmlFor="domain-input">Domain:</label>
      <input
        type="text"
        id="domain-input"
        value={domain}
        onChange={handleDomainChange}
      />
      <button onClick={handleGetAdsInfo} disabled={!domain || isLoading}>
        {isLoading ? 'Loading...' : 'Get Ads Info'}
      </button>
      {error && <div>Error: {error}</div>}
      {Object.keys(advertisers).length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Domain</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(advertisers).map(([domain, count]) => (
              <tr key={domain}>
                <td>{domain}</td>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;

