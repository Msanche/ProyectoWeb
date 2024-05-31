import ErrorPage from "./Components/ErrorPage";
import Feed from './Components/Feed';
import Publish from './Components/Publish';
import Login from "./Components/Login";
import Register from "./Components/Register";


const routes = [

  {
    path:"feed",
    element: <Feed/>,
  },
  {
    path:"Publish",
    element: <Publish/>,
  },
  {
    path:"/",
    element: <Login/>,
    errorElement: <ErrorPage/>

  },
  {
    path:"Register",
    element: <Register/>,
  },

];

export default routes;