import { Route, Routes } from "react-router-dom"
import {Toaster} from "react-hot-toast"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Jobs from "./pages/Jobs"
import ProtectedRoute from "./components/ProtectedRoute"


function App() {

  return (
    <>
    <Toaster/>
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />
      <Route
        path="/register"
        element={<Register />}
      />
      <Route
        path="/jobs"
        element={<ProtectedRoute>
          <Jobs />
        </ProtectedRoute>}
      />
    </Routes>
    </>
  )
}

export default App
