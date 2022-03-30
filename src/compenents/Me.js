import React from 'react';
import confLabels from '../configs/labels.json';
import confResume from '../configs/resume.json';

const Me = (props) => {
  let sections = {}
  for (let section in confResume){
    if (section !== 'profile') sections[section] = confResume[section]
  }
  return (
    <div>
      In construction
      {/* <AboutMe language={props.language} ></AboutMe>
      <Educations language={props.language} ></Educations> */}
    </div>
  );
};
export default Me


export const AboutMe = (props) => {
  const profile = confResume['profile'];
  return (
    <section>
      <h2>{profile['name']}</h2>
      <h3>{profile['address'][props.language]}</h3>
      <p>{profile['description'][props.language]}</p>
    </section>
  )
}

export const Educations = ({language}) => {
  const labels =  confLabels[language]
  const education = confResume[language]['education'];
  // TODO see to remove this thing which look useless
  return (
    <section>
      <h2>{labels['title']['education']}</h2>
      
      {
        education.map((val, i) => {
          return <Education language={language} edu={val} key={i}></Education>
        })
      }
    </section>
  )
}

export const Education = ({language, edu}) => {
  return (
    <div>
      <h3>{edu['name'][language]}</h3>
      <h4>{edu['university'][language]}</h4>
      <h4>{edu['starting-date'][language]+'-'+edu['finishing-date'][language]}</h4>
      <p>{edu['description'][language]}</p>
    </div>
  )
}