import React from 'react'

class NavBar extends React.Component {
  render(){

    return (
      <header class="header">
        <div class="navigation">
          <a href="/" class="logo">Theo Le Magueresse</a>

          <ul class="menu">
            <li class="menu__entry"><a href="/">Home</a></li>
            <li class="menu__entry"><a href="/blog">Blog</a></li>
            <li class="menu__entry"><a href="/cv">CV</a></li>
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
