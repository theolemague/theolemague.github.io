import React from 'react'
import { Link } from 'react-router-dom';

class NavBar extends React.Component {
  render(){

    return (
      <header class="header">
        <div class="navigation">
          <a href="/" class="logo">Theo Le Magueresse</a>

          <ul class="menu">
            <li class="menu__entry"><Link to="/">Home</Link></li>
            <li class="menu__entry"><Link to="/works/">Blog</Link></li>
            <li class="menu__entry"><Link to="/cv/">CV</Link></li>
          </ul>
        </div>

        <ul class="social-links">

        <a href="https://github.com/theolemague" class="social-links__entry" rel="noreferrer" target="_blank">Github</a>

        </ul>
      </header>
    );
  }
}

export default NavBar;
