import App from "./App";
import ErrorPage from "./Components/ErrorPage";
import Feed from './Components/Feed';
import Publish from './Components/Publish';
import Intro from "./Components/intro";

const routes = [
    {
    path:"/",
    element: <App/>,
    errorElement: <ErrorPage/>
  },
  {
    path:"feed",
    element: <Feed/>,
  },
  {
    path:"Publish",
    element: <Publish/>,
  },
  {
    path:"intro",
    element: <Intro/>,
  },
];

export default routes;