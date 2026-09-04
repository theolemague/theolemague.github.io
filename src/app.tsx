import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

import i18n from '@/lang/i18n';
import Gate from '@/pages/gate';
import FunRoutes from '@/pages/fun';
import SeriousRoutes from '@/pages/serious';

const App = () => (
  <I18nextProvider i18n={i18n}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Gate />} />
        <Route path="/serious/*" element={<SeriousRoutes />} />
        <Route path="/fun/*" element={<FunRoutes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </I18nextProvider>
);

export default App;
