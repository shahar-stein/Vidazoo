const express = require('express')
const axios = require('axios');
const cache = require('memory-cache');
const CONSTANTS = require('../constants')

const router = express.Router()

router.get(CONSTANTS.ENDPOINT.ADS_INFO, async (req, res) => {
  const { domain } = req.query;
    
    // Check if the result is already in the cache
    const cachedData = cache.get(domain);
    if (cachedData) {
      return res.json(cachedData);
    }
  
    try {
      const response = await axios.get(`https://${domain}/ads.txt`);
      const adsTxtContent = response.data;
      const advertiserDomains = {};
      // Extract advertiser domains and count their occurrences
      const lines = adsTxtContent.split('\n');
      lines.forEach((line) => {
        if (!line.startsWith('#')) { // Skip lines that start with '#'
          const parts = line.split(',');
          if (parts.length > 1) {
            const domain = parts[0].trim();
            if (advertiserDomains[domain]) {
              advertiserDomains[domain]++;
            } else {
              advertiserDomains[domain] = 1;
            }
          }
        }
      });
  
      // Cache the result
      cache.put(domain, advertiserDomains);
  
      return res.json(advertiserDomains);
    } catch (error) {
      console.error(error);
      return res.status(500).send('Failed to retrieve ads.txt file');
    }
  });
  
  module.exports = router;  
