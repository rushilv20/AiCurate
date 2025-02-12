import React from 'react';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Root, Upload, Gallery } from './pages';

const RoutesComp = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />}>
          <Route path="/" element={<Upload />} />
          <Route path="gallery" element={<Gallery />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default RoutesComp;
