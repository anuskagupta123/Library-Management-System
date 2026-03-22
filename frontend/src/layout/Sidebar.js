import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  useTheme,
  useMediaQuery
} from "@mui/material";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddIcon from "@mui/icons-material/Add";
import BookIcon from "@mui/icons-material/LibraryBooks";
import GroupIcon from "@mui/icons-material/Group";

import { useNavigate } from "react-router-dom";
import { isAdmin } from "../utils/auth";

export default function Sidebar({ open = false, onClose = null }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const admin = isAdmin();

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile && onClose) {
      onClose();
    }
  };

  const drawerWidth = 240;
  const variant = isMobile ? "temporary" : "permanent";

  const drawerContent = (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          📚 LibraryMS
        </Typography>
      </Box>

      <List>
        <ListItemButton onClick={() => handleNavigation(admin ? "/admin" : "/dashboard")}>
          <ListItemIcon sx={{ color: isMobile ? "inherit" : "white" }}>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton onClick={() => handleNavigation("/books")}>
          <ListItemIcon sx={{ color: isMobile ? "inherit" : "white" }}>
            <MenuBookIcon />
          </ListItemIcon>
          <ListItemText primary="Books" />
        </ListItemButton>

        <ListItemButton onClick={() => handleNavigation("/my-books")}>
          <ListItemIcon sx={{ color: isMobile ? "inherit" : "white" }}>
            <BookIcon />
          </ListItemIcon>
          <ListItemText primary="My Books" />
        </ListItemButton>

        {admin && (
          <>
            <ListItemButton onClick={() => handleNavigation("/add-book")}>
              <ListItemIcon sx={{ color: isMobile ? "inherit" : "white" }}>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="Add Book" />
            </ListItemButton>

            <ListItemButton onClick={() => handleNavigation("/admin/users")}>
              <ListItemIcon sx={{ color: isMobile ? "inherit" : "white" }}>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary="Manage Users" />
            </ListItemButton>
          </>
        )}
      </List>
    </>
  );

  if (isMobile) {
    return (
      <Drawer
        variant={variant}
        open={open}
        onClose={onClose}
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "#111827",
            color: "#E5E7EB"
          }
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          background: "#111827",
          color: "#E5E7EB",
          borderRight: "none"
        }
      }}
    >
      {drawerContent}
    </Drawer>
  );
}
