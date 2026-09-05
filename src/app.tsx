import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';

import i18n from '@/lang/i18n';
import Gate from '@/pages/gate';
import Fun from '@/pages/fun';
import Serious from '@/pages/serious';
import Header from '@/components/ui/header';

const App = () => (
  <I18nextProvider i18n={i18n}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Gate />} />
          <Route path="/serious/*" element={<Serious />} />
          <Route path="/fun/*" element={<Fun />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </I18nextProvider>
);

const Layout = () => {
  const location = useLocation();
  const isGate = location.pathname === '/';
  return (
    <div className="mx-auto px-6 md:px-12 flex flex-col min-h-dvh">
      <Outlet />
      {!isGate && <Header />}
    </div>
  );
};

export default App;
