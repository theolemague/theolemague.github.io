import React, { useEffect, useState } from 'react'
import confLabels from '../configs/labels.json';
import confCV from '../configs/cv.json';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


const Resume = (props) => {
  const labels = confLabels[props.language]
  const themes = confCV['themes']
  const fonts = confCV['fonts']
  const colors = confCV['colors']

  
  const [theme, setTheme] = useState(0);
  const [background, setBackground] = useState(themes[0]['values']['background']);
  const [textColor, setTextColor] = useState(themes[0]['values']['text-color']);
  const [captionColor, setCaptionColor] = useState(themes[0]['values']['caption-color']);
  const [highlightColor, setHighlightColor] = useState(themes[0]['values']['highlight-color']);
  const [titleFont, setTitleFont] = useState(themes[0]['values']['title-font']);
  const [textFont, setTextFont] = useState(themes[0]['values']['text-font']);
  
  const selectsColor = { 'background': setBackground, 'text-color': setTextColor, 'caption-color' : setCaptionColor, 'highlight-color' : setHighlightColor}
  const selectsFont = { 'title-font': setTitleFont, 'text-font': setTextFont}
  

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

  const handleThemeChange = (t) => {
    setTheme(t)
    setBackground(themes[t]['values']['background'])
    setTextColor(themes[t]['values']['text-color'])
    setCaptionColor(themes[t]['values']['caption-color'])
    setHighlightColor(themes[t]['values']['highlight-color'])
    setTextFont(themes[t]['values']['text-font'])
    setTitleFont(themes[t]['values']['title-font'])
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
          Object.keys(selectsColor).map( (k) => {
            return (
            <div className='select'>
              <label>{labels['labels'][k]}</label>
              <select onChange={e => selectsColor[k](e.target.value)}>
                {
                  colors.map( (v, i) => {
                    return <option key={i} value={v}>{v}</option>
                  })
                }
              </select>
            </div>)
          })
        }
        </div>
        <div className='select-form'>
        {
          Object.keys(selectsFont).map( (k) => {
            return (
              <div className='select'>
              <label>{labels['labels'][k]}</label>
              <select onChange={e => selectsFont[k](e.target.value)}>
                {
                  fonts.map( (v, i) => {
                    return <option key={i} value={v}>{v}</option>
                  })
                }
              </select>
            </div>)
          })
        }
        </div>
        <button onClick={buildPdf}>{labels['labels']['print']}</button>

      <CV language={props.language} background={background} titleFont={titleFont} textFont={textFont} highlightColor={highlightColor} textColor={textColor} captionColor={captionColor} />      
    </>
  );
}
export default Resume


const CV =(props) => {
  const labels = confLabels[props.language]
  const cv = confCV[props.language];
  const profile = confCV['profile'];

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
    <div id='resume' className='resume' style={{backgroundColor:props.background, color:props.textColor, fontFamily:props.textFont}}>
      <div className='header'>
        <h1 className='name' style={{fontFamily:props.titleFont, color:props.textColor}}>{profile['name']}</h1>
        <p className='description' style={{fontFamily:props.titleFont, color:props.captionColor}}>{profile['description'][props.language]}</p>
        <p className='contacts' style={{fontFamily:props.textFont, color:props.textColor}}>{buildContacts()}</p>
      </div>
      <div className='main'>
        <div className='main-column'>
          <section id='experience'>
            <h2 style={{fontFamily:props.titleFont, color:props.highlightColor}}>{labels['title']['work-experience']}</h2>
            <div className='content'>
              {
                cv['work-experience'].map((e)=>{
                  return <Experience key={e['name']} title={e['name']} caption={buildDates(e['starting-date'], e['finishing-date'])} subtitle={e['company']} description={e['missions']} titleFont={props.titleFont} textFont={props.textFont} highlightColor={props.highlightColor} textColor={props.textColor} captionColor={props.captionColor} />
                })
              }
            </div>
          </section>
        
          <section id='skills'>
            <h2 style={{fontFamily:props.titleFont, color:props.highlightColor}}>{labels['title']['skills']}</h2>
            <div className='content'>
              {
                cv['skills'].map((s)=>{
                  return <Skill key={s['name']} title={s['name']} skills={s['skills']} titleFont={props.titleFont} textFont={props.textFont} highlightColor={props.highlightColor} textColor={props.textColor} captionColor={props.captionColor} />
                })
              }
            </div>
          </section>
        </div>       
        
        <div className='side-column'>
          <section id='education'>
            <h2 style={{fontFamily:props.titleFont, color:props.highlightColor}}>{labels['title']['education']}</h2>
            <div className='content'>
              {
                cv['education'].map((e)=>{
                  return <Education key={e['name']} title={e['name']} caption={buildDates(e['starting-date'], e['finishing-date'])} subtitle={e['university']} description={e['description']} titleFont={props.titleFont} textFont={props.textFont} highlightColor={props.highlightColor} textColor={props.textColor} captionColor={props.captionColor} />
                })
              }
            </div>
          </section>
          <section id='project'>
            <h2 style={{fontFamily:props.titleFont, color:props.highlightColor}}>{labels['title']['project']}</h2>
            <div className='content'>
            {
              cv['projects'].map((e)=>{
                return <Project key={e['name']} title={e['name']} subtitle={e['company']} description={e['description']} titleFont={props.titleFont} textFont={props.textFont} highlightColor={props.highlightColor} textColor={props.textColor} captionColor={props.captionColor} />
              })
            }
            </div>
          </section>
          <section id='interest'>
            <h2 style={{fontFamily:props.titleFont, color:props.highlightColor}}>{labels['title']['personal-interest']}</h2>
            <div className='content'>
            {
              cv['personal-interests'].map((e)=>{
                return <Interest key={e['name']} title={e['name']} description={e['description']} titleFont={props.titleFont} textFont={props.textFont} highlightColor={props.highlightColor} textColor={props.textColor} captionColor={props.captionColor} />
              })
            }
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}


const Experience = (props) => {
  return (
    <div className='article'>
      <h3 style={{fontFamily:props.titleFont, color:props.textColor}}>{props.title}</h3>
      <h4 className='caption' style={{fontFamily:props.textFont, color:props.captionColor}}>{props.caption}</h4>
      <h4 className='subtitle' style={{fontFamily:props.textFont, color:props.highlightColor}}>{props.subtitle}</h4>
      <div className='description'>{
        props.description.map( t => {
          return <p key={t}>{'> '+t}</p>
        })
      }</div>
    </div>
  )
}

const Education = (props) => {
  return (
    <div className='article'>
        <h3 style={{fontFamily:props.titleFont, color:props.textColor}}>{props.title}</h3>
        <h4 className='caption' style={{fontFamily:props.textFont, color:props.captionColor}}>{props.caption}</h4>
        <h4 className='subtitle' style={{fontFamily:props.textFont, color:props.highlightColor}}>{props.subtitle}</h4>
        <div className='description'><p>{props.description}</p></div>
    </div>
  )
}

const Skill = (props) => {
  return (
    <div className='table'>
        <h3 style={{fontFamily:props.titleFont, color:props.textColor}}>{props.title}</h3>
        <table>
            <tbody>
            {
              props.skills.map( (s) => {
                if (s.includes('!')){
                  return (
                    <tr key={s}>
                        <td className='subtitle'><h4 style={{fontFamily:props.textFont, color:props.highlightColor}}>{s.split('!')[0].split(' - ')[0]}</h4></td>
                        <td><p>{s.split('!')[0].split(' - ')[1]}</p></td>
                        <td className='subtitle'><h4 style={{fontFamily:props.textFont, color:props.highlightColor}}>{s.split('!')[1].split(' - ')[0]}</h4></td>
                        <td><p>{s.split('!')[1].split(' - ')[1]}</p></td>
                    </tr>
                  )
                }
                return (
                  <tr key={s}>
                      <td className='subtitle'><h4 style={{fontFamily:props.textFont, color:props.highlightColor}}>{s.split(' - ')[0]}</h4></td>
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

const Project = (props) => {
  return (
    <div className='article'>
        <h3 style={{fontFamily:props.titleFont, color:props.textColor}}>{props.title}</h3>
        <h4 className='subtitle' style={{fontFamily:props.textFont, color:props.highlightColor}}>{props.subtitle}</h4>
        <div className='description'><p>{props.description}</p></div>
    </div>
  )
}

const Interest = (props) => {
  return (
    <div className='article'>
        <h3 style={{fontFamily:props.titleFont, color:props.textColor}}>{props.title}</h3>
        <div className='description'>
        {
          props.description.map( t => {
            return <p key={t}>{'> '+t}</p>
          })
        }
        </div>
    </div>
  )
}
