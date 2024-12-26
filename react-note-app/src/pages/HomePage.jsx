import React from 'react';
import Filter from '../components/Filter';
import NoteCardContainer from '../components/NoteCardContainer';

const HomePage = ({notes,loading,handleFilterText}) => {
  return (
    <div>
      <>
      <Filter handleFilterText={handleFilterText}/>
      <NoteCardContainer notes={notes} loading={loading}/>
      </>
    </div>
  );
}

export default HomePage;
