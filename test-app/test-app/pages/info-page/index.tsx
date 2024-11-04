import React, { useState } from 'react';
import PageTemplate from '../../components/PageTemplate';
import { fetchData } from '../../util/util';

const IndexComponent = () => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState('');

  const handleButtonClick = async () => {
      try {
          await fetchData('200', setLoading);
          setResult('No results found! Please check the spelling or try searching for something else!');
      } catch (error) {
          console.error(error);
      }
  };

  const PageContent = (
    <div>
      <h1>This is an info page</h1>

      <p>Gift code:</p>
      <input />      

      <p>Email:</p>
      <input type="email" />

      <button onClick={handleButtonClick}>Info button</button>

      <div>{result}</div>

      <a href='/'>Back to main page</a>
    </div>
  );

  return (
    <>
      <PageTemplate title={'Info-page'} content={PageContent} loading={loading} setLoading={setLoading} />
    </>
  );
};

export default IndexComponent;
