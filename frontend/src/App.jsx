import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Login from './pages/login'
import HomeAdmin from './pages/admin/home'
import Cadastro from './pages/register'
import AdminRoute from './routes/AdminRoute'
import PrivateRoute from './routes/PrivateRoute'  
import Payments from './pages/admin/payments'
import Properties from './pages/admin/properties'
import Contracts from './pages/admin/contracts'
import Users from './pages/admin/users'

const App = ()=>{
  return(
    <Router>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Cadastro/>}/>

        <Route 
          path='/admin/home/' 
          element={
            <AdminRoute>
              <HomeAdmin/>
            </AdminRoute>
            }
          />

        <Route 
          path='/admin/payments/' 
          element={
            <AdminRoute>
              <Payments/>
            </AdminRoute>
            }
          />

        <Route 
          path='/admin/properties/' 
          element={
            <AdminRoute>
              <Properties/>
            </AdminRoute>
            }
          />

        <Route 
          path='/admin/contracts/' 
          element={
            <AdminRoute>
              <Contracts/>
            </AdminRoute>
            }
          />

        <Route 
          path='/admin/users/' 
          element={
            <AdminRoute>
              <Users/>
            </AdminRoute>
            }
          />

      </Routes>
    </Router>
  )
}

export default App;