import { Navigate, Route, Routes } from 'react-router-dom';

import Home from './home';

const FunRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="*" element={<Navigate to="/fun" replace />} />
  </Routes>
);

export default FunRoutes;
