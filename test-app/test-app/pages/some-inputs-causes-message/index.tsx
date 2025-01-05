import React, { useState, ChangeEvent } from 'react';
import PageTemplate from '../../components/PageTemplate';
import { fetchData } from '../../util/util';

const IndexComponent = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = React.useState('');
  const [url, setUrl] = React.useState('');
  const [textEmail, setTextEmail] = React.useState('');
  const [textCcNumber, setCcNumber] = React.useState('');
  const [textBirthDate, setTextBirthDate] = React.useState('');
  const [checkbox, setCheckbox] = useState(false);

  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  const handleTextEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTextEmail(event.target.value);
  };

  const handleCcNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCcNumber(event.target.value);
  };

  const handleTextBirthDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTextBirthDate(event.target.value);
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCheckbox(event.target.checked);
  };

  const handleButtonClick = async () => {
    await fetchData('200', setLoading);

    if (url && textEmail && textCcNumber && textBirthDate && checkbox) {
      setMessage('Have a nice day!');
    } else {
      setMessage('');
    }

    setUrl('');
    setTextEmail('');
    setCcNumber('');
    setTextBirthDate('');
    setCheckbox(false);
  }

  const PageContent = (
    <div>
      <div>{message}</div>

      <div>
        <label>Url</label>
        <input type="url" onChange={handleUrlChange} />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input type="text" id="email" onChange={handleTextEmailChange} />
      </div>

      <div>
        <label>Credit card's number</label>
        <input type="text" autoComplete='cc-number' onChange={handleCcNumberChange} />
      </div>

      <div>
        <label>Date of birth</label>
        <input placeholder='01/01/1990' onChange={handleTextBirthDateChange} />
      </div>

      <input type="checkbox" checked={checkbox} onChange={handleCheckboxChange} />

      <button onClick={handleButtonClick}>Button</button>

      <a href='/'>Back to main page</a>
    </div>
  );

  return (
    <>
      <PageTemplate title={'Test page'} content={PageContent} loading={loading} setLoading={setLoading} />
    </>
  );
};

export default IndexComponent;
