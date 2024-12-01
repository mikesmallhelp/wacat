import React, { useState, ChangeEvent } from 'react';
import PageTemplate from '../../components/PageTemplate';
import { fetchData } from '../../util/util';

const IndexComponent = () => {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [textEmail, setTextEmail] = React.useState('');
  const [optionValue, setOptionValue] = React.useState('');

  const handleTextEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTextEmail(event.target.value);
  };

  const handleOptionValueChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    setOptionValue(event.target.value);
  };

  const handleButtonClick3 = async () => {
    await fetchData('200', setLoading);

    if (!textEmail || (textEmail &&  optionValue)) {
      setErrorMessage('An unexpected error occurred! Please try again after some time.');
    }
  }

  const PageContent = (
    <div>
      <div>{errorMessage}</div>

      <div>
        <label htmlFor="email">Email</label>
        <input type="text" id="email" onChange={handleTextEmailChange} />
      </div>

      <select onChange={handleOptionValueChange} name="someValues3" id="someValues3">
        <option value="">-- Select --</option>
        <option value="aaa">aaa</option>
        <option value="bbb">bbb</option>
        <option value="ccc">ccc</option>
      </select>

      <button onClick={handleButtonClick3}>Button3</button>

      <a href='/'>Back to main page</a>
    </div>
  );

  return (
    <>
      <PageTemplate title={'Test page - different-types-inputs-and-button-push-causes-error'} content={PageContent} loading={loading} setLoading={setLoading} />
    </>
  );
};

export default IndexComponent;
