import React, { useEffect, useState } from 'react'
import confLabels from '../configs/labels.json';
import { Link } from 'react-router-dom';

const Home = (props) => {
  const labels = confLabels[props.language]
  const [opacity, setOpactity] = useState(0);

  useEffect(()=> {
    const timer = setTimeout(() => {
      setOpactity(1);
    }, 50);
    return () => clearTimeout(timer);
  
  }, [setOpactity])

  return (
    <section style={{opacity:opacity}}>
      <div className='intro'><h2>{labels['title']['home']}</h2></div>
      <div className='name'><h1>{confLabels['global']['name']}</h1></div>
      <div className='situation'><h3>{labels['title']['home-sub']}</h3></div>
      <div className='presentation'><p>{labels['text']['home']}</p></div>
      <Link className='link' to='/works'>{labels['labels']['home-link']}</Link>
    </section>
  );
}

export default Home