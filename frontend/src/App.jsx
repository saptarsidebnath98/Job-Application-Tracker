import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Jobs from "./pages/Jobs"


function App() {

  return (
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
        element={<Jobs />}
      />
    </Routes>
  )
}

export default App
