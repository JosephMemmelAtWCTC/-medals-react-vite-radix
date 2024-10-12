import { ExitIcon } from "@radix-ui/react-icons";
import { Button, Tooltip } from "@radix-ui/themes";
function Logout(props) {
  return (
    <Tooltip content="Logout">
      <Button
        onClick={props.onLogout}
        style={{ position: "fixed", bottom: 20, left: 70, zIndex: 100, height: 40 }}
        variant="ghost"
      >
        <ExitIcon />
      </Button>
    </Tooltip>
  );
}
export default Logout;