import React, { useState } from 'react';
import PageTemplate from '../../components/PageTemplate';
import Router from 'next/router';

const IndexComponent = () => {
  const [loading, setLoading] = useState(true);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await Router.push("/different-types-inputs-and-button-push-causes-error");
    } catch (error) {
      console.error(error);
    }
  };
  
  const PageContent = (
    <form onSubmit={handleSubmit}>
        <input />
        <input />

        <input disabled type="submit" value="Disabled"/>
        <input type="submit" value="Move to page: Test page - different-types-inputs-and-button-push-causes-error"/>
        
        <a href='/'>Back to main page</a>
    </form>
  );

  return (
    <>
      <PageTemplate title={'Middle-page2'} content={PageContent} loading={loading} setLoading={setLoading} />
    </>
  );
};

export default IndexComponent;
