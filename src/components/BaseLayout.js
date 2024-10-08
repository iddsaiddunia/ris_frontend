import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../pages/non-auth/Login';
import Signup from '../pages/non-auth/Signup';
import Home from '../pages/auth/Home';
import PrivateRoute from './PrivateRoute';

const BaseLayout = () => {
  return (
    <div className ="h-screen ">
        <Router>
        
            <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path='/home' element={<PrivateRoute>
                <Home />
            </PrivateRoute>} />
            
            </Routes>
        </Router>
    </div>
    
  )
}

export default BaseLayout;
