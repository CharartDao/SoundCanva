import React from 'react';
import { Routes, Route as PublicRoute } from 'react-router-dom';
import {
  SOUNDCANVA
} from './public';

import SoundCanvaPage from '../pages/sound-canva-page/sound-canva-page';

const Route: React.FC = () => {
  return (
    <Routes>
      {/* Public PAGES */}
      <PublicRoute path={SOUNDCANVA} element={<SoundCanvaPage />} />
    </Routes>
  );
};

export default Route;