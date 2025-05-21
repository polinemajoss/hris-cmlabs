import React from 'react';

export default function GoogleLoginButton() {
  const handleLogin = () => {
    window.location.href = 'http://localhost:8000/api/auth/google/redirect';
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
    >
      Sign in with Google
    </button>
  );
}
