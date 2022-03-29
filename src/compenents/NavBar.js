import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import confLabels from '../configs/labels.json';
  
const NavBar = (props) => {
  const [openedMenu, setOpenedMenu] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const handleScroll = useCallback(() => {
    const currentScrollPos = window.pageYOffset;
    if ((prevScrollPos < currentScrollPos) && (currentScrollPos > 100) && visible) setVisible(false);
    if (prevScrollPos > currentScrollPos && !visible) setVisible(true);
    setPrevScrollPos(currentScrollPos);
  }, [prevScrollPos, visible]);

  const toggleMenu = () =>{
    const hamInner = document.getElementById('ham-inner');
    const asideMenu = document.getElementById('aside-menu');
    
    if (openedMenu) {
      setOpenedMenu(false)
      hamInner.classList.add('opened')
      asideMenu.classList.add('opened')
    }
    else{
      setOpenedMenu(true)
      hamInner.classList.remove('opened')
      asideMenu.classList.remove('opened')
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <>
      <header className={visible ? 'nav' : 'nav hidden'}>
          <div className="nav-config">
            <NavConfig language={props.language} setLanguage={props.setLanguage}/>
          </div>
        <div className="nav-wrapper">
          <nav>
            <div className='logo'><Link to='/'>{confLabels['global']['logo']}</Link></div>
            <div className='nav-list' style={{top: visible ? '0' : '-100px', display : props.width > 768 ? 'flex': 'none'}}>
              <NavList language={props.language}/>
            </div>
            <div className='menu' style={{display : props.width < 768 ? 'block': 'none'}}>
              <button aria-label='Menu' onClick={toggleMenu}>
                <div className='ham-box'><div id='ham-inner' className='ham-box-inner'></div></div>
              </button>
              <aside aria-hidden={!openedMenu} id='aside-menu' tabIndex={openedMenu?'1': '-1'} className='aside-menu'>
                <nav>
                  <NavList language={props.language}/>
                </nav>
              </aside>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
export default NavBar

const NavList = ({language}) => {
  const labels = confLabels[language]
  return (
    <>
      <ol>
        <li><Link to='/'>{labels['navbar']['home']}</Link></li>
        <li><Link to='/works'>{labels['navbar']['works']}</Link></li>
        <li><Link to='/me'>{labels['navbar']['me']}</Link></li>
        <li><Link to='/resume'>{labels['navbar']['resume']}</Link></li>
      </ol>
    </>
  )
}

const NavConfig = ({language, setLanguage}) => {
  const themes = confLabels['themes']

  const handleThemeChange = (i)=>{
    const t = themes[i]
    document.documentElement.style.setProperty('--ff-title', t['ff-title']);
    document.documentElement.style.setProperty('--ff-text', t['ff-text']);
    document.documentElement.style.setProperty('--ff-caption', t['ff-caption']);
    document.documentElement.style.setProperty('--ff-link', t['ff-link']);
    document.documentElement.style.setProperty('--c-background-shadow', t['c-background-shadow'])
    document.documentElement.style.setProperty('--c-background', t['c-background'])
    document.documentElement.style.setProperty('--c-background-65', t['c-background-65'])
    document.documentElement.style.setProperty('--c-border', t['c-border'])
    document.documentElement.style.setProperty('--c-text', t['c-text'])
    document.documentElement.style.setProperty('--c-text-50', t['c-text-50'])
    document.documentElement.style.setProperty('--c-highligth', t['c-highligth'])
    document.documentElement.style.setProperty('--c-highligth-50', t['c-highligth-50'])
    document.documentElement.style.setProperty('--c-caption', t['c-caption'])
    document.documentElement.style.setProperty('--svg-select', 'url("' + t['svg-select']+ '")');
  }
  const handleLanguageChange = (l) =>{
    setLanguage(l)
    localStorage.setItem('language', l)
  }

  return (
    <>
      <select value={language} onChange={e => handleLanguageChange(e.target.value)}>
        {
          Object.keys(confLabels['language']).map( k => {
            return <option key={k} value={k}>{confLabels['language'][k]}</option>})
        }
      </select>
      <select onChange={e => handleThemeChange(e.target.value)}>
        {
          themes.map( (t, i) => {
            return <option key={i} value={i}>{t['name']}</option>})
        }
      </select>
    </>
  )
}