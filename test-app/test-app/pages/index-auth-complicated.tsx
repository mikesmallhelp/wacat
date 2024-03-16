import React from 'react';
import FrontPage from '../components/FrontPage';

const UnauthenticatedComponent = () => {
  const [firstLinkClicked, setFirstLinkClicked] = React.useState(false);

  const handleFirstLinkClick = async (e: React.SyntheticEvent) => {
    setFirstLinkClicked(true);
  }

  return (
    <>
      {firstLinkClicked ? (<FirstLinkClickedComponent />) : (<a onClick={handleFirstLinkClick}>Please go to an application</a>)}
    </>
  );
}

const FirstLinkClickedComponent = () => {
  const [secondLinkClicked, setSecondLinkClicked] = React.useState(false);

  const handleSecondLinkClick = async (e: React.SyntheticEvent) => {
    setSecondLinkClicked(true);
  }

  return (
    <>
      {secondLinkClicked ? (<SecondLinkClickedComponent />) : (<a onClick={handleSecondLinkClick}>Please login</a>)}
    </>
  );
}

const SecondLinkClickedComponent = () => {
  const [usernameButtonClicked, setUsernameButtonClicked] = React.useState(false);
  const [username, setUsername] = React.useState("");

  const handleUsernameButtonClick = async (e: React.SyntheticEvent) => {
    setUsernameButtonClicked(true);
  }

  return (
    <>
      {usernameButtonClicked ? (<UsernameButtonClickedComponent username={username} />) : (
        <>
          <label>
            Username:
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <button onClick={handleUsernameButtonClick}>Next</button>
        </>
      )}
    </>
  );
}

const UsernameButtonClickedComponent = ({ username }: { username: string }) => {
  const [authenticated, setAuthenticated] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [errorText, setErrorText] = React.useState("");

  const handleLoginButtonClick = async (e: React.SyntheticEvent) => {
    if (username == "Mike" && password == "Smallhelp") {
      setAuthenticated(true);
    } else {
      setErrorText("Wrong username or password!");
    }
  }

  return (
    <>
      {authenticated ? (<FrontPage pageDirectory='working-page3' showLogoutLink={true} />) : (
        <>
          <label>
            Password:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <button onClick={handleLoginButtonClick}>Login</button>
          <p>{errorText}</p>
        </>
      )}
    </>
  );
}

const IndexComponent = () => {

  return (
    <UnauthenticatedComponent />
  );
};

export default IndexComponent;
