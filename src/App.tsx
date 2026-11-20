import { Routes, Route } from "react-router-dom";
import Tienda from "./pages/Tienda"; 
import Admin from "./pages/Admin";
import OAuthCallback from "./pages/OAuthCallback";
import PageProducto from "./pages/PageProducto";
import DrawerCarrito from "./components/DrawerCarrito";
import CompletarTelefono from "./pages/CompletarTelefono";
import PagePrivacidad from "./pages/PagePrivacidad";

const App = () => (
  <>
  <Routes>
    <Route path="/" element={<Tienda />} />
    <Route path="/admin" element={<Admin />} />
    <Route path="/oauth2/callback" element={<OAuthCallback />} />
    <Route path="/producto/:id" element={<PageProducto />} />
    <Route path="/completar-telefono" element={<CompletarTelefono />}/>
    <Route path="/privacidad" element={<PagePrivacidad />} />
  </Routes>

  <DrawerCarrito />
    </>

);

export default App;