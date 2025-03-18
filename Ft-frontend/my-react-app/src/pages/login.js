import { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography, CircularProgress, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    // const [token, setToken] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await axios.post("http://127.0.0.1:8000/login/", { username, password });
            setMessage({ text: response.data.message, type: "success" });
            // setToken(response.data.token)
            // console.log()
            localStorage.setItem("token",response.data.token);

            // Redirect to Dashboard after successful login
            setTimeout(() => navigate("/FileUpload"), 1000);
        } catch (error) {
            setMessage({ text: "Login failed", type: "error" });
        }
        setLoading(false);
    };

    return (<>
        <Navbar/>
        <Container maxWidth="xs" sx={{ mt: 8, p: 3, boxShadow: 3, borderRadius: 2, bgcolor: "white" }}>
            <Typography variant="h5" textAlign="center" fontWeight="bold" mb={2}>
                Login to Your Account
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
                onClick={handleLogin}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : "Login"}
            </Button>
        </Container>
        </>);
}
