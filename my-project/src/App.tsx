import { Outlet } from "react-router-dom";
import UserProvider from "./providers/userProvider";

function App() {
  return (
    <div className="w-screen max-w-full bg-[#FAFAFA]  desktop:px-[140px] ">
      <UserProvider>
        <Outlet />
      </UserProvider>
    </div>
  );
}

export default App;