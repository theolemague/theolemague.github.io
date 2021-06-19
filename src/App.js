import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';

import CV from './compenents/CV';
import NavBar from './compenents/NavBar';
import Works from './compenents/Works'

function App() {
  return (
    <div class="wrapper">
      <NavBar />
      <BrowserRouter>
        <Switch>
          <Route path="/works">
            <Works />
          </Route>
          <Route path="/cv">
            <CV />
          </Route>
        </Switch>
      </BrowserRouter>
      <p>
        In construction...
      </p>
    </div>
  
  );
}

export default App;
