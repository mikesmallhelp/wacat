import React, { useState, ChangeEvent } from 'react';
import PageTemplate from '../../components/PageTemplate';
import { fetchData } from '../../util/util';

const IndexComponent = () => {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [inputValue, setInputValue] = React.useState('');
  const [optionValue, setOptionValue] = React.useState('');
  const [checkbox, setCheckbox] = useState(false);
  const [radioValue, setRadioValue] = useState('');

  const handleInputValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleOptionValueChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    setOptionValue(event.target.value);
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCheckbox(event.target.checked);
  };

  const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRadioValue(event.target.value);
  };

  const handleButtonClick1 = async () => {
    await fetchData('200', setLoading);
    setCheckbox(false);
  }

  const handleButtonClick2 = async () => {
    await fetchData('200', setLoading);

    if (inputValue && optionValue && checkbox) {
      setErrorMessage('Error occurred!');
    }
  }

  const PageContent = (
    <div>
      <div>{errorMessage}</div>

      <input />
      <input />
      <input onChange={handleInputValueChange} />

      <select name="someValues" id="someValues">
        <option value="aaa">aaa</option>
        <option value="bbb">bbb</option>
        <option value="ccc">ccc</option>
        <option value="ddd">ddd</option>
      </select>

      <select name="someValues2" id="someValues2">
        <option value="aaa">aaa</option>
        <option value="bbb">bbb</option>
        <option value="ccc">ccc</option>
        <option value="ddd">ddd</option>
      </select>

      <select onChange={handleOptionValueChange} name="someValues3" id="someValues3">
        <option value="aaa">aaa</option>
        <option value="bbb">bbb</option>
        <option value="ccc">ccc</option>
        <option value="ddd">ddd</option>
      </select>

      <input type="checkbox" />
      <input type="checkbox" />
      <input type="checkbox" checked={checkbox} onChange={handleCheckboxChange} />

      <div>RadioGroup 1</div>
      <input type="radio" name="radioGroup" value="Option 1" />
      <input type="radio" name="radioGroup" value="Option 2" />
      <input type="radio" name="radioGroup" value="Option 3" />

      <div>RadioGroup 2</div>
      <input type="radio" name="radioGroup2" value="Option 1" />
      <input type="radio" name="radioGroup2" value="Option 2" />
      <input type="radio" name="radioGroup2" value="Option 3" />

      <div>RadioGroup 3</div>
      <input type="radio" name="radioGroup3" value="Option 1" onChange={handleRadioChange} />
      <input type="radio" name="radioGroup3" value="Option 2" onChange={handleRadioChange} />
      <input type="radio" name="radioGroup3" value="Option 3" onChange={handleRadioChange} />

      <button onClick={handleButtonClick1}>Button1</button>
      <button onClick={handleButtonClick2}>Button2</button>

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
