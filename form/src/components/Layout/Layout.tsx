import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Tabs,
  Tab,
} from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getTabValue = () => {
    switch (location.pathname) {
      case '/create':
        return 0;
      case '/preview':
        return 1;
      case '/myforms':
        return 2;
      default:
        return 0;
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    switch (newValue) {
      case 0:
        navigate('/create');
        break;
      case 1:
        navigate('/preview');
        break;
      case 2:
        navigate('/myforms');
        break;
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Form Builder
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={getTabValue()} onChange={handleTabChange} aria-label="form builder navigation">
            <Tab label="Create Form" />
            <Tab label="Preview Form" />
            <Tab label="My Forms" />
          </Tabs>
        </Box>
        
        <Box sx={{ minHeight: 'calc(100vh - 200px)' }}>
          {children}
        </Box>
      </Container>
    </Box>
  );
};

export default Layout;
