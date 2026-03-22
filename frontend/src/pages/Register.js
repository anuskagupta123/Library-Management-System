import { useState } from "react";
import { getAuthErrorMessage, register } from "../services/authService";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Stack,
  Link
} from "@mui/material";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await register({ username, password });
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      alert(getAuthErrorMessage(err, "Registration failed"));
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)"
      }}
    >
      <Card
        sx={{
          width: 400,
          borderRadius: 3,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3), 0 0 60px rgba(59, 130, 246, 0.1)",
          backdropFilter: "blur(10px)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.35), 0 0 80px rgba(59, 130, 246, 0.15)"
          }
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={700} mb={4}>
            Create Account
          </Typography>

          <form onSubmit={handleRegister}>
            <Stack spacing={3}>
              <TextField
                label="Username"
                fullWidth
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    transition: "all 0.3s ease"
                  }
                }}
              />

              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    transition: "all 0.3s ease"
                  }
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ 
                  borderRadius: 2.5,
                  fontWeight: 600,
                  mt: 2,
                  py: 1.5,
                  background: "linear-gradient(90deg, #2563EB, #1D4ED8)",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "scale(1.02)",
                    boxShadow: "0 12px 32px rgba(37, 99, 235, 0.4)",
                    background: "linear-gradient(90deg, #1D4ED8, #1E40AF)"
                  },
                  "&:active": {
                    transform: "scale(0.98)"
                  }
                }}
              >
                Register
              </Button>
            </Stack>
          </form>

          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="body2" color="textSecondary">
              Already have an account?{" "}
              <Link
                component="button"
                variant="body2"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
                sx={{ 
                  cursor: "pointer", 
                  fontWeight: 600, 
                  color: "#2563EB",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#1D4ED8",
                    textDecoration: "underline"
                  }
                }}
              >
                Login here
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
