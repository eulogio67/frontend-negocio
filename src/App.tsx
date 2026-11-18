import { Routes, Route } from "react-router-dom";
import Tienda from "./pages/Tienda"; 
import Admin from "./pages/Admin";
import OAuthCallback from "./pages/OAuthCallback";
import PageProducto from "./pages/PageProducto";
import DrawerCarrito from "./components/DrawerCarrito";

const App = () => (
  <div className="touch-pan-x touch-pan-y">
  <Routes>
    <Route path="/" element={<Tienda />} />
    <Route path="/admin" element={<Admin />} />
    <Route path="/oauth2/callback" element={<OAuthCallback />} />
    <Route path="/producto/:id" element={<PageProducto />} />
  </Routes>

  <DrawerCarrito />
    </div>

);

export default App;