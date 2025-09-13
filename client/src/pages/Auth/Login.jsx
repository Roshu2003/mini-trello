import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", form);
      console.log(res.data);

      login(res.data.data.user, res.data.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100'>
      {/* Increased width and reduced padding */}
      <div className='bg-white rounded-2xl shadow-lg p-6 w-full max-w-lg'>
        <div className='text-center mb-8'>
          <div className='flex items-center justify-center mb-4'>
            <div className='w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-2xl'>T</span>
            </div>
          </div>
          <h2 className='text-3xl font-bold text-gray-800'>Welcome Back</h2>
          <p className='text-gray-600 mt-2'>Sign in to your Taskify account</p>
        </div>

        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6'>
            {error}
          </div>
        )}

        <form className='space-y-6' onSubmit={handleLogin}>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Email
            </label>
            <input
              type='email'
              placeholder='Enter your email'
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Password
            </label>
            <input
              type='password'
              placeholder='Enter your password'
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
              required
              disabled={loading}
            />
          </div>

          <button
            type='submit'
            disabled={loading}
            className='w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg shadow transition duration-200 flex items-center justify-center'
          >
            {loading ? (
              <div className='flex items-center'>
                <div className='animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2'></div>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>

          <div className='text-center'>
            <Link
              to='/forgot-password'
              className='text-sm text-blue-600 hover:underline'
            >
              Forgot your password?
            </Link>
          </div>

          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300' />
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className='px-2 bg-white text-gray-500'>
                New to Taskify?
              </span>
            </div>
          </div>

          <div className='text-center'>
            <Link
              to='/signup'
              className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors'
            >
              Create an Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
