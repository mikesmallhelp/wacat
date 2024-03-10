import React, { useState, ChangeEvent } from 'react';
import PageTemplate from '../../components/PageTemplate';
import { fetchData } from '../../util/util';

const IndexComponent = () => {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [inputValue, setInputValue] = React.useState('');
  const [optionValue, setOptionValue] = React.useState('');
  const [checkbox, setCheckbox] = useState(false);

  const handleInputValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleOptionValueChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    setOptionValue(event.target.value);
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCheckbox(event.target.checked);
  };

  const handleButtonClick = async () => {
    await fetchData('200', setLoading);
    
    if (inputValue && optionValue && checkbox) {
      setErrorMessage('Error occurred!');
    }
  }

  const PageContent = (
    <div>
      <div>{errorMessage}</div>

      <input />

      <input onChange={handleInputValueChange} />

      <select name="someValues" id="someValues">
        <option value="aaa">aaa</option>
        <option value="bbb">bbb</option>
      </select>

      <select onChange={handleOptionValueChange} name="someValues2" id="someValues2">
        <option value="aaa">aaa</option>
        <option value="bbb">bbb</option>
      </select>

      <div>
        <input type="checkbox" />
        <input type="checkbox" checked={checkbox} onChange={handleCheckboxChange} /> Second Checkbox
      </div>

      <button onClick={handleButtonClick}>Button</button>
      
      <a href='/'>Back to main page</a>
    </div>
  );

  return (
    <>
      <PageTemplate title={'Test page - input-field-and-button-push-causes-error'} content={PageContent} loading={loading} setLoading={setLoading} />
    </>
  );
};

export default IndexComponent;
