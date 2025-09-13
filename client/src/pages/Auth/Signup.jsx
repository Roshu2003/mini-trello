import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
function Signup() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      login(res.data.data);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (error) setError("");
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 overflow-x-hidden'>
      {/* Card with wider width & less padding */}
      <div className='bg-white rounded-xl shadow-lg p-6 w-full max-w-xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-6'>
          <div className='flex items-center justify-center mb-3'>
            <div className='w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-xl'>T</span>
            </div>
          </div>
          <h2 className='text-2xl font-bold text-gray-800'>Create Account</h2>
          <p className='text-gray-600 text-sm mt-1'>
            Join Taskify and start organizing
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-4 text-sm'>
            {error}
          </div>
        )}

        {/* Form */}
        <form className='space-y-4' onSubmit={handleSignup}>
          {/* Full Name */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Full Name
            </label>
            <input
              type='text'
              placeholder='Enter your full name'
              value={form.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm'
              required
              disabled={loading}
              minLength={2}
            />
          </div>

          {/* Email */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email
            </label>
            <input
              type='email'
              placeholder='Enter your email'
              value={form.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm'
              required
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Password
            </label>
            <input
              type='password'
              placeholder='Create a password'
              value={form.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm'
              required
              disabled={loading}
              minLength={6}
            />
            <p className='text-xs text-gray-500 mt-1'>
              Must be at least 6 characters long
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Confirm Password
            </label>
            <input
              type='password'
              placeholder='Confirm your password'
              value={form.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-sm ${
                form.confirmPassword && form.password !== form.confirmPassword
                  ? "border-red-300 focus:ring-red-500"
                  : "border-gray-300 focus:ring-purple-500"
              }`}
              required
              disabled={loading}
            />
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <p className='text-xs text-red-500 mt-1'>Passwords don't match</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type='submit'
            disabled={
              loading ||
              (form.password && form.password !== form.confirmPassword) ||
              !form.name ||
              !form.email ||
              !form.password ||
              !form.confirmPassword
            }
            className='w-full py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-semibold rounded-lg shadow transition duration-200 flex items-center justify-center text-sm'
          >
            {loading ? (
              <div className='flex items-center'>
                <div className='animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2'></div>
                Creating...
              </div>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Divider */}
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300' />
            </div>
            <div className='relative flex justify-center text-xs'>
              <span className='px-2 bg-white text-gray-500'>
                Already have an account?
              </span>
            </div>
          </div>

          {/* Sign in link */}
          <div className='text-center'>
            <Link
              to='/login'
              className='inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors'
            >
              Sign In Instead
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
