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

        <button onClick={handleButtonClick}>Move to page: Middle-page 2</button>
        
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
