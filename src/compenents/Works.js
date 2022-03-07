import React from 'react'
import { Octokit } from 'octokit';
import labels from '../configs/labels.json';

const Works = (props) => {
  
  return (
    <div>
      <p>
        In construction ! Trying to understand octokit documentation...
      </p>
    </div>
  );
}
export default Works


/**
 * Recover the README.md file of the past repo
 * @param {String} repo Git repo name
 */
function getReadMe(repo){
  // Get the repo readme link
  const octokit = new Octokit()
  octokit.rest.repos.getContent({
    owner:"theolemague",
    repo:repo,
    path:"README.md"
  })
  .then((res)=>{
    console.log(repo+" "+res)
    // fetch(res.data.download_url)
    // .then(res=>{
      //   // console.log(res)
      
      //   return res.text()})
      // .then(res =>{
        //   // console.log(res)
        //   return res;
        // });
  });
      // .catch(err=>{
        //   console.log(err)
        // })
}

/**
 * Recover the list of my repositories
 * 
 */
function getReposList(){  
  const octokit = new Octokit()
  octokit.request("GET /users/{user}/repos", {
    user: "theolemague",
    type: "public",
  }).then(res=>{
    for (var i in res.data){
      // const readme = this.getReadMe(res.data[i].name);
      // console.log(res.data[i].name + readme)
      console.log(res.data[i].name)    
    }
    this.setState({repo : res.data.length })
  });

}
