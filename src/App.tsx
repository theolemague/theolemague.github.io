import { BrowserRouter } from "react-router-dom";

import SideBar from "./components/NavBar";
import HelloWorld from "./components/HelloWorld";
import AboutMe from "./components/AboutMe";

import { I18nextProvider } from "react-i18next";
import i18n from "./lang/i18";

const App = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <div className="min-h-screen w-screen bg-slate-900 text-white flex items-start px-36 py-12">
          <nav className="sticky top-0 h-screen w-44">
            <SideBar />
          </nav>

          <main className="min-h-screen flex-1 p-12">
            <HelloWorld />
            <AboutMe />
            {/* <Works />
            <Resume /> */}
          </main>
        </div>
      </BrowserRouter>
    </I18nextProvider>
  );
};

export default App;
