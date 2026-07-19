import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function Login() {
  const {
    login,
    completeNewPassword,
    newPasswordRequired,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [newPassword, setNewPassword] =
    useState("");
  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] =
    useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(
        email.trim(),
        password
      );
    } catch (err) {
      console.error(
        "Login failed:",
        err
      );

      setError(
        err.message ||
          "Unable to sign in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNewPassword = async (
    e
  ) => {
    e.preventDefault();

    setError("");

    if (!newPassword) {
      setError(
        "Please enter a new password."
      );

      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    setLoading(true);

    try {
      await completeNewPassword(
        newPassword
      );
    } catch (err) {
      console.error(
        "Password change failed:",
        err
      );

      setError(
        err.message ||
          "Unable to update password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Brand Panel */}
      <section className="login-brand-panel">
        <div className="login-brand-content">
          <div className="login-brand">
            <div className="login-brand-logo">
              LF
            </div>

            <span className="login-brand-name">
              LeaveFlow
            </span>
          </div>

          <div className="login-brand-message">
            <div className="login-brand-eyebrow">
              WORKFORCE MANAGEMENT
            </div>

            <h1 className="login-brand-title">
              Leave management,
              <br />
              made simple.
            </h1>

            <p className="login-brand-description">
              A streamlined workspace for
              employees, managers, and HR to
              manage leave requests, approvals,
              balances, and team availability.
            </p>
          </div>

          <div className="login-brand-footer">
            Secure access powered by AWS
          </div>
        </div>
      </section>

      {/* Authentication Panel */}
      <section className="login-auth-panel">
        <div className="login-auth-container">
          <div className="login-mobile-brand">
            <div className="login-brand-logo">
              LF
            </div>

            <span className="login-brand-name">
              LeaveFlow
            </span>
          </div>

          <div className="login-header">
            <h2 className="login-title">
              {newPasswordRequired
                ? "Create new password"
                : "Welcome back"}
            </h2>

            <p className="login-description">
              {newPasswordRequired
                ? "Set a secure password to complete your account setup."
                : "Sign in with your organization account to continue."}
            </p>
          </div>

          {error && (
            <div
              className="alert alert-error login-alert"
              role="alert"
            >
              <div className="login-alert-icon">
                !
              </div>

              <span>{error}</span>
            </div>
          )}

          {!newPasswordRequired ? (
            <form
              onSubmit={handleLogin}
              className="login-form"
            >
              <div className="form-group">
                <label
                  className="form-label"
                  htmlFor="login-email"
                >
                  Email address
                </label>

                <input
                  id="login-email"
                  className="form-input login-input"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  placeholder="name@company.com"
                  required
                  autoComplete="email"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label
                  className="form-label"
                  htmlFor="login-password"
                >
                  Password
                </label>

                <input
                  id="login-password"
                  className="form-input login-input"
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary login-submit"
              >
                {loading ? (
                  <>
                    <span className="login-button-spinner" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>
          ) : (
            <form
              onSubmit={
                handleNewPassword
              }
              className="login-form"
            >
              <div className="login-password-notice">
                Your account requires a new
                password before you can access
                LeaveFlow.
              </div>

              <div className="form-group">
                <label
                  className="form-label"
                  htmlFor="new-password"
                >
                  New password
                </label>

                <input
                  id="new-password"
                  className="form-input login-input"
                  type="password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value
                    )
                  }
                  placeholder="Enter new password"
                  required
                  autoComplete="new-password"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label
                  className="form-label"
                  htmlFor="confirm-password"
                >
                  Confirm password
                </label>

                <input
                  id="confirm-password"
                  className="form-input login-input"
                  type="password"
                  value={
                    confirmPassword
                  }
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  placeholder="Confirm new password"
                  required
                  autoComplete="new-password"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary login-submit"
              >
                {loading ? (
                  <>
                    <span className="login-button-spinner" />
                    Updating password...
                  </>
                ) : (
                  "Set Password"
                )}
              </button>
            </form>
          )}

          <div className="login-security-note">
            <span className="login-security-icon">
              ✓
            </span>

            <span>
              Protected authentication for
              authorized organization users.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;