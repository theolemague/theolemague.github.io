import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import labels from '../configs/labels.json';
  
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


  const saveLanguage = (newLanguage) =>{
    props.setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
  }

  return (
    <header className={visible ? '' : 'hidden'}>
      <nav>
        <div className='logo'><Link to='/'>TLM</Link></div>
        <div className='nav' style={{top: visible ? '0' : '-100px', display : props.width > 768 ? 'flex': 'none'}}>
          <ol >
            <li><Link to='/'>{labels[props.language]['navbar']['home']}</Link></li>
            <li><Link to='/works'>{labels[props.language]['navbar']['works']}</Link></li>
            <li><Link to='/me'>{labels[props.language]['navbar']['me']}</Link></li>
            <li><Link to='/resume'>{labels[props.language]['navbar']['resume']}</Link></li>
          </ol>
          <select value={props.language} onChange={e => saveLanguage(e.target.value)}>
              {
                Object.keys(labels['language']).map( k => {
                  return <option key={k} value={k}>{labels['language'][k]}</option>})
              }
          </select>
        </div>
        <div className='menu' style={{display : props.width < 768 ? 'block': 'none'}}>
          <button aria-label='Menu' onClick={toggleMenu}>
            <div className='ham-box'><div id='ham-inner' className='ham-box-inner'></div></div>
          </button>
          <aside aria-hidden={!openedMenu} id='aside-menu' tabIndex={openedMenu?'1': '-1'} className='aside-menu'>
            <nav>
            <ol >
              <li><Link to='/'>{labels[props.language]['navbar']['home']}</Link></li>
              <li><Link to='/works'>{labels[props.language]['navbar']['works']}</Link></li>
              <li><Link to='/me'>{labels[props.language]['navbar']['me']}</Link></li>
            </ol>
            </nav>
          </aside>
        </div>
      </nav>
    </header>
  );
}
export default NavBar