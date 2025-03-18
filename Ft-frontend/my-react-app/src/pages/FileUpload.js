import React, { useState } from "react";
import { Button, Container, Typography, Box, Card, CardContent, CircularProgress } from "@mui/material";
import { CloudUpload, CheckCircle } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setSuccess(false);
        }
    };

    const handleUpload = async () => {
        if (!file) return alert("Please select a file!");

        const formData = new FormData();
        formData.append("file", file);

        setUploading(true);
        setSuccess(false);

        try {
            await axios.post("http://127.0.0.1:8000/api/upload-file/", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setSuccess(true);
            localStorage.setItem("file",file)
            setTimeout(() => navigate("/dashboard"), 1000);
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("File upload failed.");
        } finally {
            setUploading(false);
        }
    };

    return (<>
    <Navbar/>
        <Container maxWidth="sm" sx={{ mt: 6 }}>

            <Card sx={{ p: 3, textAlign: "center", boxShadow: 3, borderRadius: 3, bgcolor: "#f9f9f9" }}>
                <CardContent>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>
                        Upload Your File
                    </Typography>

                    {/* Upload Box */}
                    <Box
                        sx={{
                            border: "2px dashed #1976d2",
                            borderRadius: 2,
                            p: 3,
                            textAlign: "center",
                            cursor: "pointer",
                            bgcolor: "#f5f5f5",
                            "&:hover": { bgcolor: "#e3f2fd" }
                        }}
                        onClick={() => document.getElementById("fileInput").click()}
                    >
                        {success ? (
                            <CheckCircle sx={{ fontSize: 60, color: "green" }} />
                        ) : (
                            <CloudUpload sx={{ fontSize: 60, color: "#1976d2" }} />
                        )}
                        <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 500 }}>
                            {file ? file.name : "Click or Drag & Drop to Upload"}
                        </Typography>
                    </Box>

                    <input
                        id="fileInput"
                        type="file"
                        hidden
                        onChange={handleFileChange}
                        accept=".csv, .xlsx"
                    />

                    {/* Upload Button */}
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3, px: 4, borderRadius: 3 }}
                        onClick={handleUpload}
                        disabled={uploading || !file}
                        startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
                    >
                        {uploading ? "Uploading..." : "Upload & Proceed"}
                    </Button>
                </CardContent>
            </Card>
        </Container>
        </> );
};

export default FileUpload;
