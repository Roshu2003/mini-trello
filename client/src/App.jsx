import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Login from "./pages/Auth/Login.jsx";
// import Signup from "./pages/Auth/Signup.jsx";
// import Boards from "./pages/Boards/BoardsList.jsx";
import BoardView from "./pages/BoardView/BoardView.jsx";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        <Route
          path='/login'
          element={!user ? <Login /> : <Navigate to='/boards' />}
        />
        <Route
          path='/'
          element={!user ? <Login /> : <Navigate to='/boards' />}
        />
        {/* <Route
          path='/signup'
          element={!user ? <Signup /> : <Navigate to='/boards' />}
        /> */}

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
