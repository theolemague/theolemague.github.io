import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'

import Home from './Home';
import CV from './CV';
import Works from './Works';
import NotFound from './NotFound';


class Container extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/works/' component={Works}/>
          <Route path='/cv/' component={CV}/>
          <Route component={NotFound}/>
        </Switch>
      </div>
    );
  }
}

export default Container;