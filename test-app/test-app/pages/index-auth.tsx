import React from 'react';
import FrontPage from '../components/FrontPage';

const IndexComponent = () => {
  const [authenticated, setAuthenticated] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorText, setErrorText] = React.useState("");

  const handleLogin = async (e: React.SyntheticEvent) => {
    if (username == "Mike" && password == "Smallhelp") {
      setAuthenticated(true);
    } else {
      setErrorText("Wrong username or password!");
    }
  }

  return (
    <>
      {authenticated ? (
        <FrontPage pageDirectory='working-page3' />
      ) : (
        <>
          <label>
            Username:
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label>
            Password:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <button onClick={handleLogin}>Login</button>
          <p>{errorText}</p>
        </>
      )}
    </>
  );
};

export default IndexComponent;
