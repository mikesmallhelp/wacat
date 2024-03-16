import React, { useState, ChangeEvent } from 'react';
import PageTemplate from '../../components/PageTemplate';
import { fetchData } from '../../util/util';

const IndexComponent = () => {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [inputValue, setInputValue] = React.useState('');
  const [inputValue2, setInputValue2] = React.useState('');
  const [optionValue, setOptionValue] = React.useState('');
  const [checkbox, setCheckbox] = useState(false);
  const [radioButtonValue, setRadioButtonValue] = useState('');
  const [radioButtonValue2, setRadioButtonValue2] = useState('');
  const [radioButtonValue3, setRadioButtonValue3] = useState('');
  const [emailValue, setEmailValue] = React.useState('');
  const [passwordValue, setPasswordValue] = React.useState('');

  const handleInputValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputValueChange2 = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue2(event.target.value);
  };

  const handleOptionValueChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    setOptionValue(event.target.value);
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCheckbox(event.target.checked);
  };

  const handleRadioButtonChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRadioButtonValue(event.target.value);
  };

  const handleRadioButtonChange2 = (event: ChangeEvent<HTMLInputElement>) => {
    setRadioButtonValue2(event.target.value);
  };

  const handleRadioButtonChange3 = (event: ChangeEvent<HTMLInputElement>) => {
    setRadioButtonValue3(event.target.value);
  };

  const handleEmailValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmailValue(event.target.value);
  };

  const handlePasswordValueChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPasswordValue(event.target.value);
  };

  const handleButtonClick1And2 = async () => {
    await fetchData('200', setLoading);
    setCheckbox(false);
  }

  const handleButtonClick3 = async () => {
    await fetchData('200', setLoading);

    if (inputValue && inputValue2 && optionValue && checkbox && radioButtonValue3 && emailValue && passwordValue) {
      setErrorMessage('Error occurred!');
    }
  }

  const PageContent = (
    <div>
      <div>{errorMessage}</div>

      <input />
      <input onChange={handleInputValueChange} />
      <input type="text" onChange={handleInputValueChange2} />

      <select name="someValues" id="someValues">
      <option value="">-- Select --</option>
        <option value="aaa">aaa</option>
        <option value="bbb">bbb</option>
        <option value="ccc">ccc</option>
      </select>

      <select name="someValues2" id="someValues2">
        <option value="">-- Select --</option>
        <option value="aaa">aaa</option>
        <option value="bbb">bbb</option>
        <option value="ccc">ccc</option>

      </select>

      <select onChange={handleOptionValueChange} name="someValues3" id="someValues3">
        <option value="">-- Select --</option>
        <option value="aaa">aaa</option>
        <option value="bbb">bbb</option>
        <option value="ccc">ccc</option>
      </select>

      <input type="checkbox" />
      <input type="checkbox" />
      <input type="checkbox" checked={checkbox} onChange={handleCheckboxChange} />

      <div>RadioButtonGroup</div>
      <input type="radio" name="radioButtonGroup" value="Option 1" onChange={handleRadioButtonChange} checked={radioButtonValue === "Option 1"} />
      <input type="radio" name="radioButtonGroup" value="Option 2" onChange={handleRadioButtonChange} checked={radioButtonValue === "Option 2"} />
      <input type="radio" name="radioButtonGroup" value="Option 3" onChange={handleRadioButtonChange} checked={radioButtonValue === "Option 3"} />

      <div>RadioButtonGroup 2</div>
      <input type="radio" name="radioButtonGroup2" value="Option 1" onChange={handleRadioButtonChange2} checked={radioButtonValue2 === "Option 1"} />
      <input type="radio" name="radioButtonGroup2" value="Option 2" onChange={handleRadioButtonChange2} checked={radioButtonValue2 === "Option 2"} />
      <input type="radio" name="radioButtonGroup2" value="Option 3" onChange={handleRadioButtonChange2} checked={radioButtonValue2 === "Option 3"} />

      <div>RadioButtonGroup 3</div>
      <input type="radio" name="radioButtonGroup3" value="Option 1" onChange={handleRadioButtonChange3} checked={radioButtonValue3 === "Option 1"} />
      <input type="radio" name="radioButtonGroup3" value="Option 2" onChange={handleRadioButtonChange3} checked={radioButtonValue3 === "Option 2"} />
      <input type="radio" name="radioButtonGroup3" value="Option 3" onChange={handleRadioButtonChange3} checked={radioButtonValue3 === "Option 3"} />

      <div>Emails</div>
      <input type="email" />
      <input type="email" />
      <input type="email" onChange={handleEmailValueChange} />

      <div>Passwords</div>
      <input type="password" />
      <input type="password" />
      <input type="password" onChange={handlePasswordValueChange} />

      <button onClick={handleButtonClick1And2}>Button1</button>
      <button onClick={handleButtonClick1And2}>Button2</button>
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
