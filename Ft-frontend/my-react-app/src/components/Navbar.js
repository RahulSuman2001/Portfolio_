import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { MdAnalytics } from "react-icons/md"; // Prediction icon

export default function Navbar() {
    const navigate = useNavigate();

    return (
        <AppBar position="static" color="primary" sx={{ width: '100%',padding:'10px',borderBottomLeftRadius:'10px',borderBottomRightRadius:'10px'}}>
            <Toolbar sx={{ justifyContent: "space-between", px: 2 }}>
                {/* App Logo + Title */}
                <Box
                    onClick={() => navigate("/")}
                    sx={{ display: "flex", alignItems: "center", cursor: "pointer", gap: 1}}
                >
                    <MdAnalytics size={24} />
                    <Typography variant="h6" sx={{ fontWeight: "bold", letterSpacing: 1 ,fontSize:"150%" }}>
                        Prediction & UM
                    </Typography>
                </Box>

                {/* Navigation Buttons */}
                <Box>
                    <Button color="inherit" startIcon={<LoginIcon />} onClick={() => navigate("/login")} sx={{ textTransform: "none",fontSize:"120%"  }}>
                        Login
                    </Button>
                    <Button color="inherit" startIcon={<PersonAddIcon />} onClick={() => navigate("/signup")} sx={{ textTransform: "none",fontSize:"120%" }}>
                        Signup
                    </Button>
                    <Button color="inherit" startIcon={<AdminPanelSettingsIcon />} onClick={() => navigate("/UserManagement")} sx={{ textTransform: "none",fontSize:"120%" }}>
                        User Management
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
