import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserLayout from './layout/userLayout';
import UserHome from './pages/User/UserHome';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<UserHome />} />
          <Route path="products" element={<div className="container mx-auto px-4 py-8"><h1 className="text-3xl font-bold">Sản phẩm</h1></div>} />
          <Route path="about" element={<div className="container mx-auto px-4 py-8"><h1 className="text-3xl font-bold">Về chúng tôi</h1></div>} />
          <Route path="contact" element={<div className="container mx-auto px-4 py-8"><h1 className="text-3xl font-bold">Liên hệ</h1></div>} />
        </Route>
      </Routes>
    </Router>
  );
}
