import { Routes, Route } from "react-router-dom";
import Tienda from "./pages/Tienda"; 
import Admin from "./pages/Admin";
import OAuthCallback from "./pages/OAuthCallback";

const App = () => (
  <Routes>
    <Route path="/" element={<Tienda />} />
    <Route path="/admin" element={<Admin />} />
    <Route path="/oauth2/callback" element={<OAuthCallback />} />
  </Routes>
);

export default App;