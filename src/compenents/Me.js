import React, { useEffect, useState } from 'react';
import confLabels from '../configs/labels.json';
import confAboutMe from '../configs/aboutMe.json';

const Me = (props) => {
  const labels = confLabels[props.language];
  return (
    <section className='me'>
      <AboutMe language={props.language} title={labels['title']['about-me']}/>
      <Educations language={props.language} title={labels['title']['education']}/>
      <Experiences language={props.language} title={labels['title']['experiences']}/>
      <Skills language={props.language} title={labels['title']['skills']}/>
      <Projects language={props.language} title={labels['title']['project']}/>
      <Interests language={props.language} title={labels['title']['personal-interest']}/>
    </section>
  );
};
export default Me

// TODO see opactiy when object appear on the screen (find position of element)

/** - ABOUT ME - **/
const AboutMe = ({title, language}) => {
  const aboutMe = confAboutMe['about-me'][language];
  const [opacity, setOpactity] = useState(0);

  useEffect(()=> {
    const timer = setTimeout(() => {setOpactity(1);}, 50);
    return () => clearTimeout(timer);
  }, [setOpactity])

  return (
    <section className='about-me' style={{opacity:opacity}}>
      <h2>{title}</h2>
      {
        aboutMe.map((v, i) => {
          return <p key={i}>{v}</p>
        })
      }
    </section>
  )
}

/** - EDUCATIONS - **/
const Educations = ({title, language}) => {
  const educations = confAboutMe['educations'][language];
  const [opacity, setOpactity] = useState(0);

  useEffect(()=> {
    const timer = setTimeout(() => {setOpactity(1);}, 250);
    return () => clearTimeout(timer);
  }, [setOpactity]);

  return (
    <section className='educations' style={{opacity:opacity}}>
      <h2>{title}</h2>
      <div className='grid'>
        {
          educations.map((v, i) => {
            return <Education edu={v} key={i}/>
          })
        }
      </div>
    </section>
  )
}
const Education = ({edu}) => {
  return (
    <>
      <h3>{edu['city']}</h3>
      <div>
        <h4><span>{edu['name']}</span>{edu['university']}</h4>
        <h5>{edu['starting-date']+'-'+edu['finishing-date']}</h5>
        <p>{edu['description']}</p>
      </div>
    </>
  )
}

/** - WORK EXPERIENCES - **/
const Experiences = ({title, language}) => {
  const experiences = confAboutMe['work-experiences']['fr'];
  const [opacity, setOpactity] = useState(0);

  useEffect(()=> {
    const timer = setTimeout(() => {setOpactity(1);}, 450);
    return () => clearTimeout(timer);
  }, [setOpactity]);
  
  return (
    <section className='experiences' style={{opacity:opacity}}> 
      <h2>{title}</h2> 
      <div className='grid'>
        {
          experiences.map((v, i) => {
            return <Experience exp={v} key={i}/>
          })
        }
      </div>
    </section>
  )
}
const Experience = ({exp}) => {
  return (
    <>
      <h3>{exp['company']}</h3>
      <div>
        <h4>{exp['name']}</h4>
        <h5>{exp['starting-date']+'-'+exp['finishing-date']+' / '+exp['city']}</h5>
        <p >{exp['description']}</p>
        <div className='description'>
          {
            exp['missions'].map( (v,i) => {
              return <p key={i}>{'> '+v}</p>
            })
          }
        </div>
      </div>
    </>
  )
}

/** - SKILLS - **/
const Skills = ({title, language}) => {
  const skills = confAboutMe['skills'][language];
  const [opacity, setOpactity] = useState(0);

  useEffect(()=> {
    const timer = setTimeout(() => {setOpactity(1);}, 650);
    return () => clearTimeout(timer);
  }, [setOpactity]);
  
  return (
    <section className='skills' style={{opacity:opacity}}>
      <h2>{title}</h2>
      {
        skills.map((v, i)=>{
          return <Skill key={i} skill={v}/>
        })
      }
    </section>
  )
}
const Skill = ({skill}) => {  
  const buildSkillsValues = (config) => {
    var values = []
    if (config.includes('!')){
      config.split('!').forEach(e => {
        values = [...values, ...e.split('-')];
      })
    } else values = config.split('-');
    return values;
  }
  return (
    <>
      <h3>{skill['name']}</h3>
      <div className={skill['skills'][0].includes('!') ? 'grid ling': 'grid'}>
        {
          skill['skills'].map((v, i) => {
              return <SkillRow key={i} values={buildSkillsValues(v)}/>
          })
        }
      </div>
    </>
  )
}
const SkillRow = ({values}) => {
  return (
    <>
      {
        values.map((v, i) => {
          if (i%2===0) return <h4 key={i}>{v}</h4>
          else return <p key={i}>{v}</p>
        })
      }
    </>
  )
}

/** - PROJECTS - **/
const Projects = ({title, language}) => {
  const projects = confAboutMe['projects'][language];
  const [opacity, setOpactity] = useState(0);

  useEffect(()=> {
    const timer = setTimeout(() => {setOpactity(1);}, 850);
    return () => clearTimeout(timer);
  }, [setOpactity]);
  
  return (
    <section className='projects' style={{opacity:opacity}}>
      <h2>{title}</h2>
      <div className='grid'>
        {
          projects.map((v, i)=> {
            return <Project key={i} proj={v}/>
          })
        }
      </div>
    </section>
  )
}
const Project = ({proj}) => {
  return (
    <>
      <h3>{proj['company']}</h3>
      <div>
        <h4>{proj['name']}</h4>
        <p >{proj['description']}</p>
      </div>
    </>
  )
}

/** - INTERESTS - **/
const Interests = ({title, language}) => {
  const interests = confAboutMe['personal-interests'][language];
  const [opacity, setOpactity] = useState(0);

  useEffect(()=> {
    const timer = setTimeout(() => {setOpactity(1);}, 1050);
    return () => clearTimeout(timer);
  }, [setOpactity]);
  
  return (
    <section className='interests' style={{opacity:opacity}}>
      <h2>{title}</h2>
      <div className='grid'>
        {
          interests.map((v, i)=> {
            return <Interest key={i} inter={v}/>
          })
        }
      </div>
    </section>
  )
}
const Interest = ({inter}) => {
  return (
    <>
      <h3>{inter['name']}</h3>
      <div>
        <div className='description'>
          {
            inter['description'].map( (v,i) => {
              return <p key={i}>{'> '+v}</p>
            })
          }
        </div>
      </div>
    </>
  )
}
