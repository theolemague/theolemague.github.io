import React from 'react'
import { PageTitle } from './NavBar';
import { labels } from '../configs/labels';

export default function Home(props){

  return (
    <div>
      <PageTitle language={props.language} page="home"/>
      {
      labels[props.language]['pages']['home']['text'].map( val=>{
        return <p>{val}</p>
      })
      }
    </div>
  );
}
  