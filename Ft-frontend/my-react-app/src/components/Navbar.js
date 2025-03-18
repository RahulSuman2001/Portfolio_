import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

export default function Navbar() {
    const navigate = useNavigate();

    return (
        <AppBar position="static" sx={{ bgcolor: "#333" }}>
            <Toolbar>
                {/* Logo */}
                <Typography
                    variant="h6"
                    sx={{ flexGrow: 1, display: "flex", alignItems: "center", cursor: "pointer" }}
                    onClick={() => navigate("/")}
                >
                    🚀 MyApp
                </Typography>

                {/* Navigation Buttons */}
                <Box>
                    <Button color="inherit" startIcon={<LoginIcon />} onClick={() => navigate("/login")}>
                        Login
                    </Button>
                    <Button color="inherit" startIcon={<PersonAddIcon />} onClick={() => navigate("/signup")}>
                        Signup
                    </Button>
                    <Button color="inherit" startIcon={<AdminPanelSettingsIcon />} onClick={() => navigate("/UserManagement")}>
                        User Management
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
