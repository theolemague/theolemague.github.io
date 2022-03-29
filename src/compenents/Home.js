import React from 'react'
import confLabels from '../configs/labels.json';
import cv from '../configs/cv.json';
import { Link } from 'react-router-dom';

const Home = (props) => {
  const labels = confLabels[props.language]
  return (
    <section>
      <div className='intro'><h1>{labels['title']['home']}</h1></div>
      <div className='name'><h2>{cv['profile']['name']}</h2></div>
      <div className='situation'><h3>{labels['title']['home-sub']}</h3></div>
      <div className='presentation'><p>{labels['text']['home']}</p></div>
      <Link className='link' to='/works'>{labels['labels']['home-link']}</Link>
    </section>
  );
}

export default Home