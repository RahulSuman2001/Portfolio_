import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "../pages/signup.js";  // Your existing Signup page
import Login from "../pages/login.js";    // Login page
import FileUpload from "../pages/FileUpload.js";
import Dashboard from "../pages/Dashboard.js";
import UserManagement from "../pages/UserManagement.js";
import PredictionChart from "../pages/Prediction.js";
export default function AppRoutes() {
    return (
        <Router >
            <Routes>
                <Route path="/" element={<PredictionChart />} /> 
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/FileUpload" element={<FileUpload />} />
                {/* <Route path="/columns" element={<ColumnSelection />} /> */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/predict" element={<PredictionChart />} />

                <Route path="/UserManagement" element={<UserManagement />} />
            </Routes>
        </Router>
    );
}
