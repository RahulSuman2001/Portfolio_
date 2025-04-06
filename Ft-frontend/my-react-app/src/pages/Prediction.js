import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Typography,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from '@mui/material';
import { Margin, UploadFile } from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
} from 'chart.js';
import Navbar from '../components/Navbar';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

const PredictionChart = () => {
  const [file, setFile] = useState(null);
  const [columns, setColumns] = useState([]);
  const [xColumns, setXColumns] = useState([]);
  const [yColumn, setYColumn] = useState('');
  const [degree, setDegree] = useState(2);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setChartData(null);
    setColumns([]);
    setXColumns([]);
    setYColumn('');

    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await axios.post('http://localhost:8000/api/get_pred_columns/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setColumns(res.data.columns || []);
    } catch (err) {
      console.error('Error fetching columns:', err);
      alert('Could not extract columns. Please check your file format.');
    }
  };

  const handleUpload = async () => {
    if (!file || xColumns.length === 0 || !yColumn) {
      alert('Please upload a file and select X and Y columns.');
      return;
    }
  
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('degree', degree);
    formData.append('x_columns', JSON.stringify(xColumns));
    formData.append('y_column', yColumn);
  
    try {
      const res = await axios.post('http://localhost:8000/predict/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      const { actual, predicted, x } = res.data;
  
      if (!actual || !predicted || !x || actual.length !== predicted.length || x.length !== predicted.length) {
        throw new Error('Mismatch in lengths of actual, predicted, and x values.');
      }
  
      // Convert each x object to a string label
      const labels = x.map((row, index) =>
        Object.entries(row)
          .map(([key, val]) => `${key}: ${val}`)
          .join(', ')
      );
  
      setChartData({
        labels,
        datasets: [
          {
            label: 'Actual Values',
            data: actual,
            borderColor: '#1976d2',
            backgroundColor: 'rgba(25, 118, 210, 0.2)',
            borderWidth: 2,
            tension: 0.3,
            fill: false,
            pointRadius: 4,
          },
          {
            label: `Predicted (Degree ${degree})`,
            data: predicted,
            borderColor: '#2e7d32',
            backgroundColor: 'rgba(46, 125, 50, 0.2)',
            borderDash: [5, 5],
            borderWidth: 2,
            tension: 0.3,
            fill: false,
            pointRadius: 4,
          },
        ],
      });
    } catch (err) {
      alert('Prediction failed or data format is incorrect.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  return (<>
  <Navbar/>
    <Box maxWidth="750px" mx="auto" mt={6}>
      <Card elevation={5} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom color="primary">
          📈 Prediction Chart
        </Typography>

        <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
          Upload your data and select X & Y columns along with polynomial degree.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <input
          type="file"
          accept=".csv, .xlsx"
          onChange={handleFileChange}
          style={{ marginBottom: '1.5rem' }}
        />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="x-columns-label">Select X Columns</InputLabel>
          <Select
            labelId="x-columns-label"
            multiple
            value={xColumns}
            onChange={(e) => setXColumns(e.target.value)}
            input={<OutlinedInput label="Select Reference columns" />}
            renderValue={(selected) => selected.join(', ')}
          >
            {columns.map((col) => (
              <MenuItem key={col} value={col}>
                <Checkbox checked={xColumns.indexOf(col) > -1} />
                <ListItemText primary={col} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="y-column-label">Select Y Column</InputLabel>
          <Select
            labelId="y-column-label"
            value={yColumn}
            onChange={(e) => setYColumn(e.target.value)}
            label="Select target Column"
          >
            {columns.map((col) => (
              <MenuItem key={col} value={col}>
                {col}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="degree-label">Polynomial Degree</InputLabel>
          <Select
            labelId="degree-label"
            value={degree}
            onChange={(e) => setDegree(e.target.value)}
            label="Polynomial Degree"
          >
            {[1, 2, 3, 4, 5].map((deg) => (
              <MenuItem key={deg} value={deg}>
                Degree {deg} {deg === 2 && '(Recommended)'}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          color="primary"
          startIcon={<UploadFile />}
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Predict & Show Chart'}
        </Button>

        {chartData && (
          <Box mt={7}>
            <Typography variant="h6" gutterBottom>
              📊 Prediction Result
            </Typography>
            <Line
  data={chartData}
  options={{
    responsive: true,
    maintainAspectRatio: true, // ✅ Keeps it from stretching vertically
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 20,
          font: { size: 14 },
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'X Axis',
        },
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
          font: { size: 10 },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Y Axis',
        },
      },
    },
  }}
  style={{ maxHeight: 400 }} // ✅ Optional: keep chart height controlled
/>



          </Box>
        )}
      </Card>
    </Box></>
  );
};

export default PredictionChart;
