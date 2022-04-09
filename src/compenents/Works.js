import React, { useEffect, useState } from 'react'
import { Octokit } from 'octokit';
import confLabels from '../configs/labels.json';
import { FiFolder, FiGithub } from 'react-icons/fi'

const Works = (props) => {
  const labels = confLabels[props.language];
  const [repos, setRepos] = useState([]);
  const [opacity, setOpactity] = useState(0);

  useEffect(()=> {
    const timer = setTimeout(() => {
      setOpactity(1);
    }, 50);
    return () => clearTimeout(timer);
  
  }, [setOpactity])
  
  // TODO understand callback (https://reactjs.org/docs/hooks-faq.html#is-it-safe-to-omit-functions-from-the-list-of-dependencies)
  useEffect(()=> {
    const octokit = new Octokit();
    var loadingRepos = [];
    const getRepos = async () => {  
      octokit.request("GET /users/{user}/repos", {user: "theolemague",type: "public"})
        .then( async res => {
          if (res.data.length === 0) {
            setRepos(null);
          } else {
            var asyncfunctions = [];
            for (let i in res.data){
              asyncfunctions.push(getRepoInfo(res.data[i].name, res.data[i].html_url));
            }
            await Promise.all(asyncfunctions);
            setRepos(loadingRepos);
            
      }});
    }
  
    const getRepoInfo = async (name, link) =>{
      var res = await octokit.rest.repos.getReadme({owner:"theolemague",repo:name})
      const content = atob(res.data.content)
      const description = content.substring(content.indexOf('\n')+1, content.indexOf('#', 1))  
      res = await octokit.rest.repos.listLanguages({owner:"theolemague",repo:name});
      loadingRepos.push({'id' : loadingRepos.length,'name' : name,'desc' : description, 'languages' : Object.keys(res.data), 'link':link});
    }
    getRepos()
  }, []);

  return (
    <section className='works' style={{opacity:opacity}}>
      <h2>{labels['title']['works']}</h2>
      <p>{labels['title']['works-sub']} | (I am cleaning them, they should appear soon)</p>
      { repos === null ?
        <h3>{labels['labels']['no-works']}</h3> :
        repos.length === 0 ? 
        <h3>{labels['labels']['loading']}</h3> :
        <CardGrid repos={repos}/>
      } 
    </section>
  );
}
export default Works;

const CardGrid = ({repos}) => {
  return (
    <div className='cards-grid'>
    {
      repos.map((repo, i) => {
        return <Card key={i} repo={repo} index={i}/>
      })
    }
    </div>
  )
}

const Card = ({repo, index}) => {
  const [opacity, setOpactity] = useState(0);

  useEffect(()=> {
    const timer = setTimeout(() => {
      setOpactity(1);
    }, index*200);
    return () => clearTimeout(timer);
  
  }, [setOpactity, index])
  
  const formatDesc = (desc) => {
    if (desc.includes('](')) {
      const prevlink = desc.slice(0, desc.indexOf(']('));
      const postlink = desc.slice(desc.indexOf('](')+2);
      const text = prevlink.slice(0, prevlink.lastIndexOf('['))
      const name = prevlink.slice(prevlink.lastIndexOf('[') +1)
      const link = postlink.slice(0, postlink.indexOf(')'));
      return <>{text}<a href={link} target="_blank" rel="noreferrer">{name}</a>{formatDesc(postlink.slice(postlink.indexOf(')')+1))}</>;
    } else {
      return <>{desc}</>
    }
  }

  return (
    <div className='card' style={{opacity:opacity}}>
      <header>
        <FiFolder/>
        <a href={repo.link} target="_blank" rel="noreferrer"><FiGithub/></a>
      </header>
      <main>
        <a href={repo.link} target="_blank" rel="noreferrer"><h3>{repo.name}</h3></a>
        <p>{formatDesc(repo.desc)}</p>
      </main>
      <footer>
        {
          repo.languages.map( (l, i) => {
            return <p key={i}>{l}</p>
          })
        }
      </footer>
    </div>
  )
}