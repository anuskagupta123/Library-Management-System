import { Snackbar, Alert, Slide } from "@mui/material";

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

export default function AppSnackbar({ open, message, severity, onClose }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      TransitionComponent={SlideTransition}
    >
      <Alert 
        severity={severity} 
        onClose={onClose} 
        variant="filled"
        sx={{
          borderRadius: 2,
          boxShadow: "0 12px 32px rgba(0,0,0,0.2)",
          minWidth: "300px",
          fontSize: "0.95rem",
          fontWeight: 500,
          animation: "slideUp 0.3s ease-out",
          "@keyframes slideUp": {
            from: {
              transform: "translateY(100px)",
              opacity: 0
            },
            to: {
              transform: "translateY(0)",
              opacity: 1
            }
          }
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
