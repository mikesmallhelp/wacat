import React, { useState } from 'react';
import PageTemplate from '../../components/PageTemplate';
import Router from "next/router";

const IndexComponent = () => {
  const [loading, setLoading] = useState(true);

  const handleButtonClick = async () => {
    try {
      await Router.push("/middle-page2");
    } catch (error) {
      console.error(error);
    }
  };
  
  const PageContent = (
    <div>
        <input />
        <input />
  
        <input disabled type="button" value="Disabled" />
        <input type="button" value="Move to page: Middle-page 2" onClick={handleButtonClick} />
        
        <a href='/'>Back to main page</a>
    </div>
  );  

  return (
    <>
      <PageTemplate title={'Middle-page'} content={PageContent} loading={loading} setLoading={setLoading} />
    </>
  );
};

export default IndexComponent;
