import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { UserCircle, Mail, ShieldCheck, Edit3, Lock, ShoppingBag, LogOut } from 'lucide-react'; // Added more icons

const AccountPage = () => {
  const { user, isLoggedIn, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    // This case should ideally be handled by the redirect, but as a fallback:
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-20">
        <p className="text-xl text-gray-700">User not found. Please log in to view your account.</p>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home page after logout
  };

  const accountSections = [
    { name: "Edit Profile", icon: Edit3, description: "Update your personal details.", action: () => navigate('/account/edit-profile') /* Placeholder */ },
    { name: "Change Password", icon: Lock, description: "Secure your account with a new password.", action: () => navigate('/account/change-password') /* Placeholder */ },
    { name: "Order History", icon: ShoppingBag, description: "View your past property interactions.", action: () => navigate('/account/orders') /* Placeholder */ },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        {/* User Greeting Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white shadow-xl rounded-lg overflow-hidden mb-8"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <UserCircle className="h-20 w-20 sm:h-24 sm:w-24 text-white flex-shrink-0" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Welcome, {user.name}!</h1>
                <p className="text-blue-200 text-sm flex items-center mt-1">
                  <Mail className="w-4 h-4 mr-2" />
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Account Options Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Account Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accountSections.map((section, index) => (
              <motion.div
                key={section.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col items-start"
                onClick={section.action} // Make the card clickable
              >
                <section.icon className="h-10 w-10 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{section.name}</h3>
                <p className="text-sm text-gray-600 flex-grow">{section.description}</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); section.action(); }} // Prevent card click if button is separate
                  className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium self-end"
                >
                  Go &rarr;
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Security Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 bg-white p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Security</h2>
          <div className="space-y-3">
            <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <ShieldCheck className="h-8 w-8 text-green-600 mr-4 flex-shrink-0" />
              <div>
                <p className="text-green-700 font-medium">Your account is secure.</p>
                <p className="text-sm text-green-600">
                  Password protection is active. For password changes, please use the "Change Password" option above or "Forgot Password" on the login page if you're logged out.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 flex justify-center"
        >
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default AccountPage;