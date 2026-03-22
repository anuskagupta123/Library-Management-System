import { Box, Typography, Button, Container, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background:
          "linear-gradient(135deg, #1E3A8A 0%, #2563EB 50%, #60A5FA 100%)",
        color: "white",
      }}
    >
      <Box
        sx={{
          width: "100%",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
          backgroundColor: "rgba(0,0,0,0.12)",
          backdropFilter: "blur(8px)"
        }}
      >
        <Container sx={{ py: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={800}>
              LibraryMS
            </Typography>

            <Stack direction="row" spacing={1.2}>
              <Button
                variant="text"
                sx={{ color: "white", fontWeight: 700 }}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#F59E0B",
                  color: "#111827",
                  fontWeight: 700,
                  borderRadius: 2
                }}
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container sx={{ flex: 1, display: "flex", alignItems: "center" }}>
        <Stack spacing={4} maxWidth={700} py={4}>
          <Typography variant="h2" fontWeight={800} sx={{ fontSize: { xs: "2.2rem", md: "3.6rem" } }}>
            Modern Library Management
          </Typography>

          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            Manage books, monitor fines, track due dates and control users —
            all inside one powerful dashboard.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5}>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#F59E0B",
                fontWeight: 600,
                borderRadius: 3,
                color: "#111827"
              }}
              onClick={() => navigate("/login")}
            >
              Get Started
            </Button>

            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: "white",
                color: "white",
                borderRadius: 3
              }}
              onClick={() => navigate("/register")}
            >
              Create Account
            </Button>
          </Stack>
        </Stack>
      </Container>

      <Box
        sx={{
          width: "100%",
          borderTop: "1px solid rgba(255,255,255,0.2)",
          backgroundColor: "rgba(0,0,0,0.12)",
          backdropFilter: "blur(8px)"
        }}
      >
        <Container sx={{ py: 2.2 }}>
          <Typography variant="body2" sx={{ textAlign: "center", opacity: 0.9 }}>
            © {new Date().getFullYear()} LibraryMS • Smart borrowing, smooth returns, zero hassle.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
