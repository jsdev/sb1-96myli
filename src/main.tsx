import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import BlokusShapesApp from './BlokusShapesApp';
// import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BlokusShapesApp />
  </StrictMode>
);
