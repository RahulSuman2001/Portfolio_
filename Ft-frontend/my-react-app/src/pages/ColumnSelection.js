import React, { useState, useEffect } from "react";
import { FormControl, Button, Grid, MenuItem, Select, Card, CardContent, Typography } from "@mui/material";
import axios from "axios";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, AreaChart, Area, ScatterChart, Scatter, LineChart, Line, Treemap } from "recharts";

const chartOptions = [
    { category: "Single Column Charts", charts: ["Pie Chart", "Histogram", "Word Cloud", "Treemap"] },
    { category: "Two Column Charts", charts: ["Bar Chart", "Scatter Plot", "Area Chart", "Box and Whisker Plot", "Line Chart", "Heat Map"] },
    { category: "Three Column Charts", charts: ["Correlation Matrices"] },
];

const ColumnSelection = () => {
    const [columns, setColumns] = useState([]);
    const [sections, setSections] = useState(
        Array(6).fill().map(() => ({ selectedColumns: [], selectedChart: "", data: null }))
    );

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/columns/")
            .then(response => setColumns(response.data.columns))
            .catch(error => console.error("Error fetching columns:", error));
    }, []);

    const handleDropdownChange = (sectionIndex, event) => {
        setSections(prevSections => {
            const updatedSections = [...prevSections];
            updatedSections[sectionIndex].selectedColumns = event.target.value;
            return updatedSections;
        });
    };

    const handleChartChange = (sectionIndex, event) => {
        setSections(prevSections => {
            const updatedSections = [...prevSections];
            updatedSections[sectionIndex].selectedChart = event.target.value;
            return updatedSections;
        });
    };

    const handleGenerate = (sectionIndex) => {
        const section = sections[sectionIndex];
        if (section.selectedColumns.length === 0 || !section.selectedChart) return;

        axios.post("http://127.0.0.1:8000/generate-visualization/", {
            columns: section.selectedColumns,
            chartType: section.selectedChart
        })
        .then(response => {
            setSections(prevSections => {
                const updatedSections = [...prevSections];
                updatedSections[sectionIndex].data = response.data.data;
                return updatedSections;
            });
        })
        .catch(error => console.error("Error generating visualization:", error));
    };

    return (
        <Grid container spacing={1} justifyContent="center">
            {sections.map((section, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card sx={{ padding: 1, borderRadius: 2, boxShadow: 2 }}>
                        <CardContent>
                            <Typography variant="caption" gutterBottom>Section {index + 1}</Typography>
                            <FormControl fullWidth size="small">
                                <Typography variant="caption">Select Columns:</Typography>
                                <Select
                                    multiple
                                    value={section.selectedColumns}
                                    onChange={(e) => handleDropdownChange(index, e)}
                                    fullWidth
                                    size="small"
                                >
                                    {columns.map((col, colIndex) => (
                                        <MenuItem key={colIndex} value={col}>
                                            {col}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth margin="dense" size="small">
                                <Typography variant="caption">Select Chart Type:</Typography>
                                <Select value={section.selectedChart} onChange={(e) => handleChartChange(index, e)} size="small">
                                    <MenuItem value="">-- Select Chart Type --</MenuItem>
                                    {chartOptions.map(({ category, charts }) => (
                                        charts.map((chart, chartIndex) => (
                                            <MenuItem key={chartIndex} value={chart}>{chart}</MenuItem>
                                        ))
                                    ))}
                                </Select>
                            </FormControl>
                            <Button variant="contained" color="primary" onClick={() => handleGenerate(index)} sx={{ mt: 1, fontSize: "0.65rem", padding: "2px 6px" }}>
                                Generate
                            </Button>
                            <div style={{ marginTop: 10 }}>
                                {section.data && (
                                    section.selectedChart === "Bar Chart" ? (
                                        <ResponsiveContainer width="100%" height={200}>
                                            <BarChart data={section.data}>
                                                <XAxis dataKey={section.selectedColumns[0]} />
                                                <YAxis />
                                                <Tooltip />
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <Bar dataKey={section.selectedColumns[1]} fill="#8884d8" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : section.selectedChart === "Pie Chart" ? (
                                        <ResponsiveContainer width="100%" height={200}>
                                            <PieChart>
                                            <Pie data={section.data} dataKey={section.selectedColumns[0]} nameKey={section.selectedColumns[1]} outerRadius={100} fill="#8884d8">
                                                {section.data.map((entry, i) => (
                                                    <Cell key={`cell-${i}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][i % 4]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                        </ResponsiveContainer>
                                    ) : section.selectedChart === "Histogram" ? (
                                        <ResponsiveContainer width="100%" height={200}>
                                            <BarChart data={section.data}>
                                                <XAxis dataKey={section.selectedColumns[0]} />
                                                <YAxis />
                                                <Tooltip />
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <Bar dataKey={section.selectedColumns[0]} fill="#8884d8" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : section.selectedChart === "Scatter Plot" ? (
                                        <ResponsiveContainer width="100%" height={200}>
                                        <ScatterChart>
                                            <CartesianGrid />
                                            <XAxis type="number" dataKey={section.selectedColumns[0]} name={section.selectedColumns[0]} />
                                            <YAxis type="number" dataKey={section.selectedColumns[1]} name={section.selectedColumns[1]} />
                                            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                                            <Scatter name="Data Points" data={section.data} fill="#8884d8" />
                                        </ScatterChart>
                                    </ResponsiveContainer>
                                    
                                    ) : section.selectedChart === "Area Chart" ? (
                                        <ResponsiveContainer width="100%" height={200}>
                                            <AreaChart data={section.data}>
                                                <XAxis dataKey={section.selectedColumns[0]} />
                                                <YAxis />
                                                <Tooltip />
                                                <Area type="monotone" dataKey={section.selectedColumns[1]} fill="#8884d8" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    ) : section.selectedChart === "Line Chart" ? (
                                        <ResponsiveContainer width="100%" height={200}>
                                            <LineChart data={section.data}>
                                                <XAxis dataKey={section.selectedColumns[0]} />
                                                <YAxis />
                                                <Tooltip />
                                                <Line type="monotone" dataKey={section.selectedColumns[1]} stroke="#8884d8" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    ) : null
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default ColumnSelection;