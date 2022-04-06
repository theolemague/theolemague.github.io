import React from 'react';
import confLabels from '../configs/labels.json';
import confAboutMe from '../configs/aboutMe.json';

const Me = (props) => {
  const labels = confLabels[props.language];
  return (
    <section className='me'>
      <h2>{labels['title']['about-me']}</h2>
      <AboutMe language={props.language}/>
      <h2>{labels['title']['education']}</h2> 
      <Educations language={props.language}/>
      <h2>{labels['title']['experiences']}</h2> 
      <Experiences language={props.language}/>
      <h2>{labels['title']['skills']}</h2> 
      <Skills language={props.language}/>
      <h2>{labels['title']['project']}</h2> 
      <Projects language={props.language}/>
      <h2>{labels['title']['personal-interest']}</h2> 
      <Interests language={props.language}/>
    </section>
  );
};
export default Me

/** - ABOUT ME - **/
const AboutMe = ({language}) => {
  const aboutMe = confAboutMe['about-me'][language];
  return (
    <section className='about-me'>
      {
        aboutMe.map((v, i) => {
          return <p key={i}>{v}</p>
        })
      }
    </section>
  )
}

/** - EDUCATIONS - **/
const Educations = ({language}) => {
  const educations = confAboutMe['educations'][language];
  return (
    <section className='educations'>
      {
        educations.map((v, i) => {
          return <Education edu={v} key={i}/>
        })
      }
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
const Experiences = ({language}) => {
  const experiences = confAboutMe['work-experiences']['fr'];
  return (
    <section className='experiences'>  
      {
        experiences.map((v, i) => {
          return <Experience exp={v} key={i}/>
        })
      }
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
const Skills = ({language}) => {
  const skills = confAboutMe['skills'][language];
  return (
    <section className='skills'>
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
const Projects = ({language}) => {
  const projects = confAboutMe['projects'][language];
  return (
    <section className='projects'>
      {
        projects.map((v, i)=> {
          return <Project key={i} proj={v}/>
        })
      }
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
const Interests = ({language}) => {
  const interests = confAboutMe['personal-interests'][language];
  return (
    <section className='interests'>
      {
        interests.map((v, i)=> {
          return <Interest key={i} inter={v}/>
        })
      }
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
