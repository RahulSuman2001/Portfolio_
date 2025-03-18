import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ColumnSelection from "./ColumnSelection";
import { Container, Grid, Card, CardContent, Typography } from "@mui/material";
import Navbar from "../components/Navbar";

const Dashboard = () => {
    const [visualizations, setVisualizations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if a file is stored in localStorage
        const file = localStorage.getItem("file");
        if (!file) {
            // Redirect to File Upload page if no file is found
            navigate("/FileUpload");
        }
    }, [navigate]);

    const handleVisualizationGenerated = (newVisualization) => {
        setVisualizations([...visualizations, newVisualization]);
    };

    return (
        <Container>
            <Navbar />
            <Typography variant="h4" style={{ marginBottom: "20px" }}>Dashboard</Typography>

            {/* Column Selection Component */}
            <ColumnSelection onVisualizationGenerated={handleVisualizationGenerated} />

            {/* Visualization Display */}
            <Grid container spacing={2} style={{ marginTop: "20px" }}>
                {visualizations.map((viz, index) => (
                    <Grid item xs={6} key={index}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">Visualization {index + 1}</Typography>
                                <img src={`data:image/png;base64,${viz}`} 
                                     alt={`Visualization ${index + 1}`} 
                                     style={{ width: "100%" }} 
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Dashboard;
