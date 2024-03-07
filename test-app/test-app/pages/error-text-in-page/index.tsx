import React, { useState, useEffect } from 'react';
import PageTemplate from '../../components/PageTemplate';

const IndexComponent = () => {
  const [loading, setLoading] = useState(true);
  
  const PageContent = (
      <div>Error occurred!</div>
  );

  useEffect(() => {
    console.error("Hello! Something wrong!");
  }, []);

  return (
    <>
      <PageTemplate title={'Test page - error-text-in-page'} content={PageContent} loading={loading} setLoading={setLoading} />
    </>
  );
};

export default IndexComponent;
