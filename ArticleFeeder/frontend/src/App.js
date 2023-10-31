import './App.css';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import UserLogin from './Pages/User/UserLogin';
import UserSignup from './Pages/User/UserSignup';
import AdminDashboard from './Pages/Admin/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route path='/login'>
            <UserLogin />
          </Route>
          <Route path='/signup'>
            <UserSignup />
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
