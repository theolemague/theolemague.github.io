import { Route, Switch } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';

import NavBar from './compenents/NavBar';
import Home from './compenents/Home';
import Me from './compenents/Me';
import Works from './compenents/Works';
import NotFound from './compenents/NotFound';
import Resume from './compenents/Resume';

import confLabels from './configs/labels.json';

const App = () => {

  var prevLanguage = localStorage.getItem('language');
  if (prevLanguage == null || !(prevLanguage in confLabels.language)) localStorage.setItem('language', 'fr');
  const [language, setLanguage] = useState(localStorage.getItem('language'))
  const [width, setWidth] = useState(window.innerWidth);
  const handleResize = useCallback(() => setWidth(window.innerWidth), []);
  
  useEffect( () =>{
    window.addEventListener('resize', handleResize);
    return ()=> window.removeEventListener('resize', handleResize);
  }, [handleResize])

  return (  
    <div className='content'>
      <NavBar language={language} setLanguage={setLanguage} width={width}/>
      <main className='body'>
        <Switch>
          <Route exact path='/'><Home language={language}></Home></Route>
          <Route path='/works/'><Works language={language}></Works></Route>
          <Route path='/me/'><Me language={language}></Me></Route> 
          <Route path='/resume/'><Resume language={language}></Resume></Route> 
          <Route ><NotFound language={language}></NotFound></Route>
        </Switch>
      </main>
    </div>
  );
}

export default App