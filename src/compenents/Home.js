import React from 'react'
import labels from '../configs/labels.json';
import cv from '../configs/cv.json';
import { Link } from 'react-router-dom';

const Home = (props) => {
  return (
    <section>
      <div className='intro'><h1>{labels[props.language]['title']['home']}</h1></div>
      <div className='name'><h2>{cv['profile']['name']}</h2></div>
      <div className='situation'><h3>{labels[props.language]['title']['home-sub']}</h3></div>
      <div className='presentation'><p>{labels[props.language]['text']['home']}</p></div>
      <Link className='link' to='/works'>{labels[props.language]['labels']['home-link']}</Link>
    </section>
  );
}

export default Home