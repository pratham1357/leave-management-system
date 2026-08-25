import {
  useEffect,
  useState,
} from "react";

import {
  login,
  logout,
  completeNewPassword,
  getAuthenticatedUser,
} from "../services/authService";

import { AuthContext } from "./auth-context.js";


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


  /*
    setUser/setLoading are called from inside the .then()/
    .catch()/.finally() callbacks (rather than directly in this
    function's synchronous body) so that no state setter is ever
    invoked synchronously while the mount effect below is
    running - that would otherwise trigger cascading renders.
    The chain is returned so callers that `await loadUser()`
    (handleLogin, handleNewPassword) still wait for it to finish.
  */
  const loadUser = () => {
    return getAuthenticatedUser()
      .then((authenticatedUser) => {
        setUser(
          authenticatedUser
        );
      })
      .catch((error) => {
        console.error(
          "Failed to load user:",
          error
        );

        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
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