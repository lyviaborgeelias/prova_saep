import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Login from './pages/login'
import Home from './pages/admin/home'
import Estoque from "./pages/admin/estoque";
import Produtos from "./pages/admin/produtos";

const App = ()=>{
  return(
    <Router>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/admin/home' element={<Home/>}/>
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/estoque" element={<Estoque />} />
      </Routes>
    </Router>
  )
}
export default App;