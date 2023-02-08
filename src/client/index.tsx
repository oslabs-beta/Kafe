import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import 'regenerator-runtime/runtime';
import App from './App';

import './global.css';

const container = document.getElementById('root')!;
const root = createRoot(container);

const client = new ApolloClient({
  uri: 'http://localhost:3000/gql',
  cache: new InMemoryCache(),
});

const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        light: '#CCE1EB',
        main: '#71ABC5',
        dark: '#0F1031',
        contrastText: '#fff',
      },
      secondary: {
        light: '#adb5bd',
        main: '#6c757d',
        dark: '#495057',
        contrastText: '#fff',
      },
    },

    typography: {
      fontFamily: [
        'Roboto',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Segoe UI Symbol"',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
      ].join(','),
    },
  });

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        light: '#B2DFDB',
        main: '#00796B',
        dark: '#004C40',
        contrastText: '#fff',
      },
      secondary: {
        light: '#f5f5f5',
        main: '#9e9e9e',
        dark: '#616161',
        contrastText: '#fff',
      },
    },
    typography: {
      fontFamily: [
        'Roboto',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Segoe UI Symbol"',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
      ].join(','),
    },
  });

const Root = () => {
  const [theme, setTheme] = useState('light');

  const toggleThemeHandler = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  };

  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <CssBaseline />
      <ApolloProvider client={client}>
        <App toggleTheme={toggleThemeHandler}/>
      </ApolloProvider>
    </ThemeProvider>
  )
};

root.render(
    <Root/>
);

