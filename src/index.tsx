import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { SchemaProvider } from './context/SchemaContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <SchemaProvider>
    <App />
  </SchemaProvider>
);