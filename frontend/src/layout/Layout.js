import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#F4F7FB" }}>
      {isMobile ? (
        <Sidebar open={drawerOpen} onClose={closeDrawer} />
      ) : (
        <Sidebar />
      )}

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Navbar onMenuClick={isMobile ? toggleDrawer : undefined} />

        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            maxWidth: "1400px",
            width: "100%",
            margin: "0 auto",
            overflow: "auto"
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
