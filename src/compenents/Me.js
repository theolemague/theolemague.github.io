import React from 'react';
import labels from '../configs/labels.json';
import cv from '../configs/cv.json';

const Me = (props) => {

  let sections = {}
  for (let section in cv){
    if (section !== 'profile') sections[section] = cv[section]
  }
  return (
    <div>
      <AboutMe language={props.language} ></AboutMe>
      <Educations language={props.language} ></Educations>
    </div>
  );
};
export default Me


export const AboutMe = (props) => {
  const profile = cv['profile'];
  return (
    <section>
      <h2>{profile['name']}</h2>
      <h3>{profile['address'][props.language]}</h3>
      <p>{profile['description'][props.language]}</p>
    </section>
  )
}

export const Educations = (props) => {
  const education = cv['education'];
  return (
    <section>
      <h2>{labels[props.language]['title']['education']}</h2>
      {
        education.map(val => {
          return <Education language={props.language} edu={val} key={val['name']['fr']}></Education>
        })
      }
    </section>
  )
}

export const Education = (props) => {
  return (
    <div>
      <h3>{props.edu['name'][props.language]}</h3>
      <h4>{props.edu['university'][props.language]}</h4>
      <h4>{props.edu['starting-date'][props.language]+'-'+props.edu['finishing-date'][props.language]}</h4>
      <p>{props.edu['description'][props.language]}</p>
    </div>
  )
}