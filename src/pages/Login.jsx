import { useState } from 'react';
import { supabase } from '../lib/supabase';
import quickPrepLogo from '../assets/quickprep-logo-header.png';

export default function Login() {
  const [mode, setMode] = useState("signin"); // "signin" or "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError(null);
    setMessage(null);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email.trim() || !password) {
      setError("Please enter your email and password");
      return;
    }

    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (err) {
        setError(err.message);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email.trim() || !password) {
      setError("Please enter your email and password");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const { data, error: err } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (err) {
        setError(err.message);
      } else if (!data.session) {
        setMessage("Account created. Check your email to confirm, then sign in.");
        setMode("signin");
      }
      // If a session comes back immediately, App.jsx's auth listener
      // will pick it up and move past the login screen.
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "var(--s2)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "14px 16px",
    color: "var(--cream)",
    fontSize: 15,
    fontFamily: "'Manrope', sans-serif",
    marginBottom: 16,
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.15s",
  };

  const focusHandlers = {
    onFocus: (e) => { e.target.style.borderColor = "var(--lime)"; },
    onBlur: (e) => { e.target.style.borderColor = "var(--border)"; },
  };

  const buttonStyle = (disabled) => ({
    width: "100%",
    background: "var(--lime)",
    color: "#000",
    border: "none",
    borderRadius: 12,
    padding: "14px 16px",
    fontSize: 15,
    fontWeight: 700,
    fontFamily: "'Manrope', sans-serif",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.6 : 1,
    transition: "opacity 0.15s",
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: "transparent",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    }}>
      <div className="app-bg" aria-hidden="true"></div>
      <div style={{
        maxWidth: "430px",
        width: "100%",
        textAlign: "center",
      }}>
        {/* Logo -- same designed "QuickPrep" wordmark used in the app
            header (see src/assets/quickprep-logo-header.png), just larger
            here since there's a whole screen of room instead of a header
            row to share with the account menu. */}
        <img
          src={quickPrepLogo}
          alt="QuickPrep"
          style={{ height: 56, width: "auto", display: "block", margin: "0 auto 16px" }}
        />

        {/* Tagline */}
        <div style={{
          fontSize: 15,
          color: "var(--muted)",
          marginBottom: 40,
          lineHeight: 1.6,
        }}>
          Real meals. Real ingredients. Actually easy.
        </div>

        {/* Sign In */}
        {mode === "signin" && (
          <form onSubmit={handleSignIn} style={{marginBottom: 24}}>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              style={inputStyle}
              {...focusHandlers}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              style={inputStyle}
              {...focusHandlers}
            />

            <button type="submit" disabled={loading} style={buttonStyle(loading)}>
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div style={{
              fontSize: 13,
              color: "var(--muted)",
              marginTop: 16,
            }}>
              Don't have an account?{" "}
              <span
                onClick={() => switchMode("signup")}
                style={{ color: "var(--lime)", cursor: "pointer", fontWeight: 600 }}
              >
                Sign up
              </span>
            </div>
          </form>
        )}

        {/* Sign Up */}
        {mode === "signup" && (
          <form onSubmit={handleSignUp} style={{marginBottom: 24}}>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              style={inputStyle}
              {...focusHandlers}
            />
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              style={inputStyle}
              {...focusHandlers}
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              style={inputStyle}
              {...focusHandlers}
            />

            <button type="submit" disabled={loading} style={buttonStyle(loading)}>
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <div style={{
              fontSize: 13,
              color: "var(--muted)",
              marginTop: 16,
            }}>
              Already have an account?{" "}
              <span
                onClick={() => switchMode("signin")}
                style={{ color: "var(--lime)", cursor: "pointer", fontWeight: 600 }}
              >
                Sign in
              </span>
            </div>
          </form>
        )}

        {/* Success Message */}
        {message && (
          <div style={{
            background: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            fontSize: 14,
            color: "var(--lime)",
            lineHeight: 1.5,
          }}>
            ✓ {message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            background: "rgba(255, 77, 77, 0.1)",
            border: "1px solid rgba(255, 77, 77, 0.3)",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            fontSize: 14,
            color: "var(--red)",
            lineHeight: 1.5,
          }}>
            ✕ {error}
          </div>
        )}
      </div>
    </div>
  );
}
