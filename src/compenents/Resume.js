import React, { useState } from 'react'
import confLabels from '../configs/labels.json';
import confResume from '../configs/resume.json';
import confThemes from '../configs/themes.json';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


const Resume = (props) => {
  const labels = confLabels[props.language]
  const themes = confThemes['resume']['themes']
  const fonts = confThemes['resume']['fonts']
  const colors = confThemes['resume']['colors']
  const colorProps = ['--cv-c-background', '--cv-c-highlight', '--cv-c-caption', '--cv-c-text'];
  const fontProps = ['--cv-ff-text', '--cv-ff-title'];  
  
  // TODO continue this page age refomate it
  
  const buildPdf = (e) => {
    e.preventDefault()
    let html = document.getElementById('resume');
    // Lack of quality
    html2canvas(html).then( canvas => {
      let pdf = new jsPDF('p', 'mm', 'a4');
			pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 211, 298);
			pdf.save("test.pdf");
    })
    
    // TODO see further to adpat the pdf style
    // let doc = new jsPDF('p', 'mm','a4');
    // doc.html(html, {
      //   callback: () => {
        //     doc.save('test.pdf');
        //   }
        // });
  }
      
  const handleThemeChange = (i) => {
    const t = themes[i]
    document.documentElement.style.setProperty('--cv-c-background', t['c-background']);
    document.documentElement.style.setProperty('--cv-c-highlight', t['c-highlight']);
    document.documentElement.style.setProperty('--cv-c-caption', t['c-caption']);
    document.documentElement.style.setProperty('--cv-c-text', t['c-text']);
    document.documentElement.style.setProperty('--cv-ff-text', t['ff-text']);
    document.documentElement.style.setProperty('--cv-ff-title', t['ff-title']);
  }
      
  const handlePropertyChange = (p, c) => {
    document.documentElement.style.setProperty(p, c);
  }

  return (
    <>
      <div className='select-form'>
        <div className='select'>
          <label>{labels['labels']['theme']}</label>
          <select onChange={e => handleThemeChange(e.target.value)}>
            {
              themes.map( (v, i) => {
                return <option key={i} value={i}>{v['name']}</option>
              })
            }
          </select>
        </div>
      </div>
      <div className='select-form'>
        {
          colorProps.map( (p, i) => {
            return (
            <div key={i} className='select'>
              <label>{labels['labels'][p.slice(5)]}</label>
              <select onChange={e => handlePropertyChange(p, e.target.value)}>
                {
                  colors.map((v, j) => {
                    return <option key={j} value={v}>{v}</option>
                  })
                }
              </select>
            </div>)
          })
        }
      </div>
      <div className='select-form'>
        {
          fontProps.map( (p, i) => {
            return (
              <div key={i} className='select'>
              <label>{labels['labels'][p.slice(5)]}</label>
              <select onChange={e => handlePropertyChange(p, e.target.value)}>
                  {
                    fonts.map( (v, j) => {
                      return <option key={j} value={v}>{v}</option>
                    })
                  }
                </select>
            </div>)
          })
        }
      </div>
      <div>
        <button onClick={buildPdf}>{labels['labels']['print']}</button>
      </div>
      <div className='resume-wrapper'>
        <CV language={props.language}/>
      </div>
    </>
  );
}
export default Resume


const CV = ({language}) => {
  const labels = confLabels[language]
  const cv = confResume[language];
  const profile = confResume['profile'];

  const buildAge = (birthdate) => {
    // now - birthday (ms) / 1000ms * 60s * 60min * 24h * 365.25j
    return Math.floor((new Date()-new Date(birthdate))/31557600000);
  }

  const buildContacts = () => {
    return buildAge(profile['birthdate']) + ' ' + labels['labels']['years-old']+ ' / '+profile['email']+' / '+profile['number']+' / '+profile['website']
  }

  const buildDates = (start, end) => {
    return labels['labels']['from']+' '+start+' '+labels['labels']['to']+' '+end
  }

  return (
    <div id='resume' className='resume'>
      <div className='header'>
        <h1 className='name'>{profile['name']}</h1>
        <p className='description'>{profile['description'][language]}</p>
        <p className='contacts'>{buildContacts()}</p>
      </div>
      <div className='main'>
        <div className='main-column'>
          <section id='experience'>
            <h2>{labels['title']['work-experience']}</h2>
            <div className='content'>
              {
                cv['work-experience'].map((e)=>{
                  return <Experience key={e['name']} title={e['name']} caption={buildDates(e['starting-date'], e['finishing-date'])} subtitle={e['company']} description={e['missions']}/>
                })
              }
            </div>
          </section>
        
          <section id='skills'>
            <h2>{labels['title']['skills']}</h2>
            <div className='content'>
              {
                cv['skills'].map((s)=>{
                  return <Skill key={s['name']} title={s['name']} skills={s['skills']}/>
                })
              }
            </div>
          </section>
        </div>       
        
        <div className='side-column'>
          <section id='education'>
            <h2>{labels['title']['education']}</h2>
            <div className='content'>
              {
                cv['education'].map((e)=>{
                  return <Education key={e['name']} title={e['name']} caption={buildDates(e['starting-date'], e['finishing-date'])} subtitle={e['university']} description={e['description']}/>
                })
              }
            </div>
          </section>
          <section id='project'>
            <h2>{labels['title']['project']}</h2>
            <div className='content'>
            {
              cv['projects'].map((e)=>{
                return <Project key={e['name']} title={e['name']} subtitle={e['company']} description={e['description']}/>
              })
            }
            </div>
          </section>
          <section id='interest'>
            <h2>{labels['title']['personal-interest']}</h2>
            <div className='content'>
            {
              cv['personal-interests'].map((e)=>{
                return <Interest key={e['name']} title={e['name']} description={e['description']}/>
              })
            }
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}


const Experience = ({title, description, subtitle, caption}) => {
  return (
    <div className='article'>
      <h3>{title}</h3>
      <h4 className='caption'>{caption}</h4>
      <h4 className='subtitle'>{subtitle}</h4>
      <div className='description'>{
        description.map( t => {
          return <p key={t}>{'> '+t}</p>
        })
      }</div>
    </div>
  )
}

const Education = ({title, description, subtitle, caption}) => {
  return (
    <div className='article'>
        <h3>{title}</h3>
        <h4 className='caption'>{caption}</h4>
        <h4 className='subtitle'>{subtitle}</h4>
        <div className='description'><p>{description}</p></div>
    </div>
  )
}

const Skill = ({title, skills}) => {
  return (
    <div className='table'>
        <h3>{title}</h3>
        <table>
            <tbody>
            {
              skills.map( (s) => {
                if (s.includes('!')){
                  return (
                    <tr key={s}>
                        <td className='subtitle'><h4>{s.split('!')[0].split(' - ')[0]}</h4></td>
                        <td><p>{s.split('!')[0].split(' - ')[1]}</p></td>
                        <td className='subtitle'><h4>{s.split('!')[1].split(' - ')[0]}</h4></td>
                        <td><p>{s.split('!')[1].split(' - ')[1]}</p></td>
                    </tr>
                  )
                }
                return (
                  <tr key={s}>
                      <td className='subtitle'><h4>{s.split(' - ')[0]}</h4></td>
                      <td><p>{s.split(' - ')[1]}</p></td>
                  </tr>
                )
              })
            }
            </tbody>
        </table>
    </div>
  )
}

const Project = ({title, description, subtitle}) => {
  return (
    <div className='article'>
        <h3>{title}</h3>
        <h4 className='subtitle'>{subtitle}</h4>
        <div className='description'><p>{description}</p></div>
    </div>
  )
}

const Interest = ({title, description}) => {
  return (
    <div className='article'>
        <h3>{title}</h3>
        <div className='description'>
        {
          description.map( (t, i) => {
            return <p key={i}>{'> '+t}</p>
          })
        }
        </div>
    </div>
  )
}
