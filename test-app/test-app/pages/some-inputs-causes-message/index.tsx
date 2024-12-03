import React, { useState, ChangeEvent } from 'react';
import PageTemplate from '../../components/PageTemplate';
import { fetchData } from '../../util/util';

const IndexComponent = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = React.useState('');
  const [textEmail, setTextEmail] = React.useState('');
  const [textBirthDate, setTextBirthDate] = React.useState('');
  const [checkbox, setCheckbox] = useState(false);
  let [buttonClickCount, setButtonClickCount] = useState(0);

  const handleTextEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTextEmail(event.target.value);
  };

  const handleTextBirthDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTextBirthDate(event.target.value);
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCheckbox(event.target.checked);
  };

  const handleButtonClick = async () => {
    setButtonClickCount(buttonClickCount++);
    await fetchData('200', setLoading);

    if (buttonClickCount === 1 && textEmail && textBirthDate && checkbox) {
      setMessage('Have a nice day!');
    }
  }

  const PageContent = (
    <div>
      <div>{message}</div>

      <div>
        <label htmlFor="email">Email</label>
        <input type="text" id="email" onChange={handleTextEmailChange} />
      </div>

      <div>
        <label htmlFor="birthDate">Date of birth</label>
        <input type="text" id="birthDate" onChange={handleTextBirthDateChange} />
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
