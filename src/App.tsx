import { Routes, Route } from "react-router-dom";
import Tienda from "./pages/Tienda"; 
import Admin from "./pages/Admin";
import OAuthCallback from "./pages/OAuthCallback";
import PageProducto from "./pages/PageProducto";
import DrawerCarrito from "./components/DrawerCarrito";
import CompletarTelefono from "./pages/CompletarTelefono";
import PagePrivacidad from "./pages/PagePrivacidad";
import CategoriaPage from "./pages/CategoriaPage";
import PageDevoluciones from "./pages/PageDevoluciones";


const App = () => (
  <>
  <Routes>
    <Route path="/" element={<Tienda />} />
    <Route path="/admin" element={<Admin />} />
    <Route path="/oauth2/callback" element={<OAuthCallback />} />
    <Route path="/producto/:id" element={<PageProducto />} />
    <Route path="/completar-telefono" element={<CompletarTelefono />}/>
    <Route path="/privacidad" element={<PagePrivacidad />} />
    <Route path="/categorias/:id" element={<CategoriaPage />} />
    <Route path="/devoluciones" element={<PageDevoluciones />} />

  </Routes>

  <DrawerCarrito />
    </>

);

export default App;