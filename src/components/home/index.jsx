import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress

} from '@mui/material';
import { saveAs } from 'file-saver';

function App() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [search, setSearch] = useState('');

  const handleDomainChange = (event) => {
    setDomain(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateDomain(domain)) {
      setErrorMessage('Invalid domain');
      return;
    }
    setErrorMessage('');
    setLoading(true);

    try {
      const response = await axios.get(`/api/ads-info?domain=${domain}`);
      setResults(response.data);
    } catch (error) {
      console.error(error);
      setErrorMessage('Failed to retrieve ads.txt file');
    }
    setLoading(false);
  };

  const validateDomain = (value) => {
    const domainPattern = /^[a-zA-Z0-9-.]+\.[a-zA-Z]{2,}$/;
    return domainPattern.test(value);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleDownload = () => {
    const json = JSON.stringify(results, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, `${domain}-results.json`);
  };

  const handleDownloadCSV = () => {
    let csv = 'Domain,Count\n';
    for (const domain of Object.keys(results)) {
      csv += `${domain},${results[domain]}\n`;
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${domain}-results.csv`);
  };

  const filteredResults = Object.fromEntries(Object.entries(results).filter(([key, value]) =>
    key.toLowerCase().includes(search.toLowerCase())
  ));

  return (
    <Box p={2}>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Domain"
          value={domain}
          onChange={handleDomainChange}
          variant="outlined"
          fullWidth
          error={!!errorMessage}
          helperText={errorMessage}
        />
        <Box mt={2}>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
          {Object.keys(results).length > 0 && (
            <>
              <Button variant="outlined" onClick={handleDownload}>
                Download JSON
              </Button>
              <Button variant="outlined" onClick={handleDownloadCSV}>
                Download CSV
              </Button>
            </>
          )}
        </Box>
      </form>
      {Object.keys(results).length > 0 && (
        <Box mt={4}>
          <Box display="flex" alignItems="center">
            <TextField
              label="Search"
              value={search}
              onChange={handleSearch}
              variant="outlined"
              size="small"
            />

          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                      Domain
                  </TableCell>
                  <TableCell>
                      Count
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(filteredResults).map((domain) => (
                  <TableRow key={domain}>
                    <TableCell>{domain}</TableCell>
                    <TableCell>{results[domain]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Box>
  );
}

export default App;              