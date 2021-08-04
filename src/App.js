import { Route, Switch } from 'react-router-dom';
import { useState } from 'react';

import NavBar from './compenents/NavBar';
import Home from './compenents/Home';
import CV from './compenents/CV';
import Works from './compenents/Works';
import NotFound from './compenents/NotFound';



export default function App() {
  const [language, setLanguage] = useState(localStorage.getItem("language") || "fr")

  function saveLanguage(newLanguage){
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  return (  
    <div className="wrapper">
      <div className="language">
        <select value={language}onChange={e => saveLanguage(e.target.value)}>
            <option value="fr">Français</option>
            <option value="en">English</option>
        </select>
      </div>
      <NavBar language={language} />
      <Switch>
        <Route exact path='/'><Home language={language}></Home></Route>
        <Route path='/works/'><Works language={language}></Works></Route>
        <Route path='/cv/'><CV language={language}></CV></Route> 
        <Route ><NotFound language={language}></NotFound></Route>
      </Switch>
    </div>
  );
}

