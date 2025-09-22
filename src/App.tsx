import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserLayout from './layout/userLayout';
import AuthLayout from './layout/authLayout';
import UserHome from './pages/User/UserHome';
import About from './pages/User/About';
import Login from './pages/User/Login';
import Register from './pages/User/Register';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<UserHome />} />
          <Route path="products" element={<div className="container mx-auto px-4 py-8"><h1 className="text-3xl font-bold">Sản phẩm</h1></div>} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<div className="container mx-auto px-4 py-8"><h1 className="text-3xl font-bold">Liên hệ</h1></div>} />
        </Route>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    </Router>
  );
}
