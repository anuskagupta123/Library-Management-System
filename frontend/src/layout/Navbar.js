import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Stack, 
  Chip,
  IconButton,
  useMediaQuery,
  useTheme
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { logout, getRole, isAdmin } from "../utils/auth";

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const role = getRole();
  const username = localStorage.getItem("username");
  const admin = isAdmin();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const roleColor = role === "ADMIN" ? "error" : "primary";
  const roleLabel = role === "ADMIN" ? "👑 ADMIN" : "👤 STUDENT";

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backdropFilter: "blur(10px)",
        background: "linear-gradient(90deg, #1E3A8A, #3B82F6)",
      }}
    >
      <Toolbar 
        sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          gap: 2,
          flexWrap: "wrap"
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          {isMobile && onMenuClick && (
            <IconButton
              color="inherit"
              onClick={onMenuClick}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: 1,
              cursor: "pointer",
              fontSize: { xs: "1rem", sm: "1.25rem" }
            }}
            onClick={() => navigate(admin ? "/admin" : "/dashboard")}
          >
            LibraryMS
          </Typography>
        </Stack>

        <Stack 
          direction={{ xs: "column", sm: "row" }} 
          spacing={1} 
          alignItems={{ xs: "flex-end", sm: "center" }}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          {username && (
            <Stack 
              direction={{ xs: "column", sm: "row" }} 
              spacing={1} 
              alignItems="flex-end"
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  color: "rgba(255,255,255,0.7)",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" }
                }}
              >
                {username}
              </Typography>
              <Chip
                label={roleLabel}
                size="small"
                color={roleColor}
                variant="outlined"
                sx={{ 
                  color: "white",
                  borderColor: "white",
                  fontWeight: 600,
                  fontSize: { xs: "0.65rem", sm: "0.75rem" }
                }}
              />
            </Stack>
          )}
          <Button
            variant="contained"
            color="secondary"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              padding: { xs: "4px 8px", sm: "6px 16px" },
              width: { xs: "100%", sm: "auto" },
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                transform: "scale(1.04)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
              }
            }}
          >
            Logout
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

