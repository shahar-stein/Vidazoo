const express = require('express')

const CONSTANTS = require('../constants')

const axios = require('axios');

const router = express.Router()
// MasterDetail Page Endpoint
// step1: להבין איך מקבלים דומיין ניים כפרמטר על ריקווסט. קווארי פארם - לחפש בגוגל אקספרס קווארי פאראם
// לבצע בקשת אייפייאיי לדומיין שקיבלתי כדי לקבל את התוכן של הקובץ הזה - לחפש nod.js api call - axios
// לקחת את הקובץ הזה ולנתח אותו - להשתמש באובייקט בגאווה סקריפט
// להחזיר את האובייקט ללקוח בגייסון

//router.get(CONSTANTS.ENDPOINT.ADS_INFO, (req, res) => {
//res.json(sampleData.textAssets)
//})


router.get(CONSTANTS.ENDPOINT.ADS_INFO, async (req, res) => {
  const { domain } = req.query;
  try { // לבדוק דומיין תקין
    const response = await axios.get(`https://${domain}/ads.txt`);
    const adsTxtContent = response.data;
    const advertiserDomains = {};

    // Extract advertiser domains and count their occurrences
    const lines = adsTxtContent.split('\n');
    lines.forEach(line => {
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

    return res.json(advertiserDomains);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Failed to retrieve ads.txt file');
  }
});

module.exports = router
