import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './containers/Dashboard';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const theme = createTheme({
    palette: {
      primary: {
        light: '#8ad297',
        main: '#5aa069',
        dark: '#2a713e',
        contrastText: '#fff',
      },
      secondary: {
        light: '#dbffff',
        main: '#a7ffeb',
        dark: '#75ccb9',
        contrastText: '#000',
      },
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
  });

const App = () => {
    return (
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <div>
                    Kafe PandaWhale
                </div>
                <div>
                    <Dashboard />
                </div>
            </ThemeProvider>
        </BrowserRouter>
    )
};

export default App;