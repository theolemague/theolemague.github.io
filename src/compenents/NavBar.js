import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { labels } from '../configs/labels';
import { FaGithub, FaBars } from 'react-icons/fa'
  
export default function NavBar(props) {
  const [opened, setOpened] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(()=>{
    const handleResize = (e) => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return ()=>{
      window.addEventListener("resize", handleResize);
    } 
  })

  return (
    <header className="header">
      <div className="w-100">
        <Link to="/" className="logo">Theo Le Magueresse</Link>
        <div className="menu-button" onClick={()=>setOpened(!opened)}><FaBars/></div>
        <ul className={opened ? "menu active" : "menu"}>
          <li className="menu-entry" onClick={()=>setOpened(false)}><Link to="/">{labels[props.language]['pages']['home']['navbar']}</Link></li>
          <li className="menu-entry" onClick={()=>setOpened(false)}><Link to="/works">{labels[props.language]['pages']['works']['navbar']}</Link></li>
          <li className="menu-entry" onClick={()=>setOpened(false)}><Link to="/cv">{labels[props.language]['pages']['cv']['navbar']}</Link></li>
          <li className="menu-entry" onClick={()=>setOpened(false)}>
            <a href="https://github.com/theolemague" rel="noreferrer" target="_blank">
              {width > 500 ? <FaGithub/>: "Github"}
            </a>
          </li>
          
        </ul>
      </div>


    </header>
  );
}

export function PageTitle(props) {
  return (
      <div className="page-title">
        <h1 className="page-title-subtitle">{labels[props.language]['pages'][props.page]['title']}</h1>
        <div className="page-title-text">{labels[props.language]['pages'][props.page]['sub-title']}</div>
      </div>
  );
}




