import React, { useState } from 'react';
import PageTemplate from '../../components/PageTemplate';
import { fetchData } from '../../util/util';

const IndexComponent = () => {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = React.useState('');

  const handleButtonClick = async () => {
    try {
      await fetchData('200', setLoading);
      setErrorMessage('Error occurred!');
    } catch (error) {
      console.error(error);
    }
  };
  
  const PageContent = (
    <div>
      <div>{errorMessage}</div>

      <button>Normal button</button>

      <button onClick={handleButtonClick}>Error button</button>
      
      <a href='/'>Back to main page</a>
    </div>
  );

  return (
    <>
      <PageTemplate title={'Test page - button-push-causes-error'} content={PageContent} loading={loading} setLoading={setLoading} />
    </>
  );
};

export default IndexComponent;

