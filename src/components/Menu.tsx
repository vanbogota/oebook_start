import { useAuth } from "@/contexts/LocalAuthContext";
import MenuGuest from "./MenuGuest";
import MenuUser from "./MenuUser";
const Menu = () => {
  const { userProfile } = useAuth();
  return <>{userProfile ? <MenuUser /> : <MenuGuest />}</>;
};
export default Menu;