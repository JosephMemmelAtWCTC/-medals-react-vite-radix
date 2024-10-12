import { useState, useEffect } from "react";
import { EnterIcon } from "@radix-ui/react-icons";
import {
  Button,
  Tooltip,
  Dialog,
  Flex,
  Text,
  TextField,
} from "@radix-ui/themes";
import * as Progress from "@radix-ui/react-progress";

function Login(props) {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [awaitingLogin, setAwaitingLogin] = useState(false);
  const [alreadyFailedLogin, setAlreadyFailedLogin] = useState(false);
	const [progress, setProgress] = useState(0);
  const expectedSeconds = 3;

  function handleModalKeyPress(e) {
    (e.keyCode ? e.keyCode : e.which) === 13 &&
      username.length > 0 &&
      password.length > 0 &&
      handleLogin();
  }

  function handleLogin(e) {
    e.preventDefault();
    setAwaitingLogin(true);
    setAlreadyFailedLogin(false)
    
    props.onLogin(username, password);
    for(let i = 0; i <= expectedSeconds*1000; i+=100){
      const timer = setTimeout(() => setProgress(i), 100);
    }
  }

  useEffect(() => {
    if(props.user.loginKey > 0){
      setAwaitingLogin(false);
      console.log("props.user.loginKey",props.user.loginKey)
      setAlreadyFailedLogin(true)
    }
  }, [props.user.loginKey]);

  return (
    <>
      <Tooltip content="Login">
        <Button
          onClick={() => setOpen(true)}
          style={{ position: "fixed", bottom: 20, left: 70, zIndex: 100, height: 45}}
          variant="ghost"
        >
          <EnterIcon />
        </Button>
      </Tooltip>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Content maxWidth="450px" onKeyUp={handleModalKeyPress}>
          <Dialog.Title>Log In</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Log in to your account
          </Dialog.Description>

          <Flex direction="column" gap="3">
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                User Name
              </Text>
              <TextField.Root
                placeholder="Enter your user name"
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                autoFocus
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Password
              </Text>
              <TextField.Root
                type="Password"
                placeholder="Enter your password"
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </Dialog.Close>
              <Button
                onClick={handleLogin}
                disabled={
                  username.trim().length === 0 || password.trim().length === 0 || awaitingLogin
                }
              >
                Login
              </Button>
          </Flex>
          {awaitingLogin ?
            <Flex>
              <Progress.Root className="ProgressRoot" value={progress} max={expectedSeconds*1000}>
                <Progress.Indicator
                  className="ProgressIndicator"
                  style={{ transform: `translateX(-${(expectedSeconds*1000) - progress}%)` }}
                />
              </Progress.Root>
            </Flex> : (alreadyFailedLogin? <center>Login Failed :(</center> : "")
          }
          
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}

export default Login;