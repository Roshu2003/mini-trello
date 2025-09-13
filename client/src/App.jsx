import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import "./App.css";
import Login from "./pages/Auth/Login.jsx";
import Signup from "./pages/Auth/Signup.jsx"; // ✅ Add this import
import Dashboard from "./pages/Dashboard/Dashboard.jsx"; // ✅ Add this import (your Taskify dashboard)
// import Boards from "./pages/Boards/BoardsList.jsx";
import BoardView from "./pages/BoardView/BoardView.jsx";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route
          path='/login'
          element={!user ? <Login /> : <Navigate to='/dashboard' />}
        />
        <Route
          path='/'
          element={!user ? <Login /> : <Navigate to='/dashboard' />}
        />
        <Route
          path='/signup'
          element={!user ? <Signup /> : <Navigate to='/dashboard' />}
        />
        <Route
          path='/dashboard'
          element={user ? <Dashboard /> : <Navigate to='/login' />}
        />

        {/* Protected Routes */}
        {/* <Route
          path='/boards'
          element={user ? <Boards /> : <Navigate to='/login' />}
        /> */}
        <Route
          path='/board/:id'
          element={user ? <BoardView /> : <Navigate to='/login' />}
        />
      </Routes>
    </Router>
  );
}

export default App;
