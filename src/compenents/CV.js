import React from 'react'
import { labels } from '../configs/labels';
import { PageTitle } from './NavBar';

export default function CV(props){
  return (
    <div>
      <PageTitle language={props.language} page="cv"/>
      <p>
        In construction...
      </p>
    </div>
  );
};
  