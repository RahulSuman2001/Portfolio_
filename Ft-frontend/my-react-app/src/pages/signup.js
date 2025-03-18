import { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography, CircularProgress, Alert } from "@mui/material";
import Navbar from "../components/Navbar";
export default function Signup() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        setLoading(true);
        try {
            const response = await axios.post("http://127.0.0.1:8000/signup/", { username, password });
            setMessage({ text: response.data.message, type: "success" });
        } catch (error) {
            setMessage({ text: error.response?.data?.message || "Signup failed", type: "error" });
        }
        setLoading(false);
    };

    return (<>
        <Navbar/>
        <Container maxWidth="xs" sx={{ mt: 8, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}>
            <Typography variant="h5" textAlign="center" fontWeight="bold" mb={2}>
                Create an Account
            </Typography>

            {message && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                    {message.text}
                </Alert>
            )}

            <TextField
                fullWidth
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 3 }}
            />

            <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSignup}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : "Sign Up"}
            </Button>
        </Container>
        </>);
}
