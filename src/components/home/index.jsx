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
  CircularProgress,
  TableSortLabel

} from '@mui/material';
import { saveAs } from 'file-saver';

function App() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortColumn, setSortColumn] = useState('');

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
      setResults(Object.entries(response.data));
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

  const handleDownloadJson = () => {
    const json = JSON.stringify(Object.fromEntries(results), null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, `${domain}-results.json`);
  };

  const handleDownloadCSV = () => {
    let csv = 'Domain,Count\n';
    for (const [domain, count] of results) {
      csv += `${domain},${count}\n`;
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${domain}-results.csv`);
  };

  const filteredAndSortedResults = results
    .filter(([key]) => key.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const [domainA, countA] = a;
      const [domainB, countB] = b;

      if (sortColumn === 'domain') {
        return sortOrder === 'asc' ? domainA.localeCompare(domainB) : domainB.localeCompare(domainA);
      } else if (sortColumn === 'count') {
        return sortOrder === 'asc' ? countA - countB : countB - countA;
      }

      return 0;
    });

  const handleSort = (column) => {
    const newSortOrder = sortColumn === column && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newSortOrder);
    setSortColumn(column);
  };

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
          {results.length > 0 && (
            <>
              <Button variant="outlined" onClick={handleDownloadJson}>
                Download JSON
              </Button>
              <Button variant="outlined" onClick={handleDownloadCSV}>
                Download CSV
              </Button>
            </>
          )}
        </Box>
      </form>
      {results.length > 0 && (
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
                    <TableSortLabel
                      active={sortColumn === 'domain'}
                      direction={sortOrder}
                      onClick={() => handleSort('domain')}
                    >
                      Domain
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortColumn === 'count'}
                      direction={sortOrder}
                      onClick={() => handleSort('count')}
                    >
                      Count
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedResults.map(([domain, count]) => (
                  <TableRow key={domain}>
                    <TableCell>{domain}</TableCell>
                    <TableCell>{count}</TableCell>
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