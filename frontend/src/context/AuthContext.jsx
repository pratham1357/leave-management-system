import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  login,
  logout,
  completeNewPassword,
  getAuthenticatedUser,
} from "../services/authService";


const AuthContext = createContext(null);


export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [
    newPasswordRequired,
    setNewPasswordRequired,
  ] = useState(false);


  const loadUser = async () => {
    try {
      const authenticatedUser =
        await getAuthenticatedUser();

      setUser(
        authenticatedUser
      );
    } catch (error) {
      console.error(
        "Failed to load user:",
        error
      );

      setUser(null);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadUser();
  }, []);


  const handleLogin = async (
    email,
    password
  ) => {
    const result = await login(
      email,
      password
    );

    if (
      result.nextStep?.signInStep ===
      "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
    ) {
      setNewPasswordRequired(
        true
      );

      return {
        newPasswordRequired: true,
      };
    }

    if (result.isSignedIn) {
      await loadUser();

      return {
        success: true,
      };
    }

    return {
      success: false,
      nextStep: result.nextStep,
    };
  };


  const handleNewPassword = async (
    newPassword
  ) => {
    const result =
      await completeNewPassword(
        newPassword
      );

    if (result.isSignedIn) {
      setNewPasswordRequired(
        false
      );

      await loadUser();

      return {
        success: true,
      };
    }

    return {
      success: false,
      nextStep: result.nextStep,
    };
  };


  const handleLogout = async () => {
    await logout();

    setUser(null);

    setNewPasswordRequired(
      false
    );
  };


  const value = {
    user,
    loading,
    newPasswordRequired,
    login: handleLogin,
    completeNewPassword:
      handleNewPassword,
    logout: handleLogout,
    refreshUser: loadUser,
  };


  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}