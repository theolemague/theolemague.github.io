import { Navigate, Route, Routes } from 'react-router-dom';

import Home from './home';

const SeriousRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="*" element={<Navigate to="/serious" replace />} />
  </Routes>
);

export default SeriousRoutes;
