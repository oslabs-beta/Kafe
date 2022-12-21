import React from 'react';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

import App from './App';

const container = document.getElementById('root')!;
const root = createRoot(container);

const client = new ApolloClient({
  uri: 'http://localhost:3000/gql',
  cache: new InMemoryCache(),
});

const theme = createTheme({
    palette: {
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

root.render(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </ThemeProvider>
)

