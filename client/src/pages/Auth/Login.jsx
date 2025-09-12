import { useState, useContext } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/users/login", form);
      login(res.data.user, res.data.token);
    } catch (err) {
      alert(err.response.data.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='email'
        placeholder='Email'
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type='password'
        placeholder='Password'
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type='submit'>Login</button>
    </form>
  );
}

export default Login;
