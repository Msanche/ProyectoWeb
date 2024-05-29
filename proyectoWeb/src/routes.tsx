import App from "./App";
import ErrorPage from "./Components/ErrorPage";
import Feed from './Components/Feed';
import Publish from './Components/Publish';


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
];

export default routes;