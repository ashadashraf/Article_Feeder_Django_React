import './App.css';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import UserLogin from './Pages/User/UserLogin';
import UserSignup from './Pages/User/UserSignup';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import UserHome from './Pages/User/UserHome';
import ArticlePreference from './Components/ArticlePreference';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route exact path='/'>
            <UserHome />
          </Route>
          <Route path='/login'>
            <UserLogin />
          </Route>
          <Route path='/signup'>
            <UserSignup />
          </Route>
          <Route path='/articlepreference'>
            <ArticlePreference />
          </Route>
          <Route path='/admin-dashboard'>
            <AdminDashboard />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
