import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Dev password login
  const [devEmail, setDevEmail] = useState("");
  const [devPassword, setDevPassword] = useState("");
  const [devLoading, setDevLoading] = useState(false);
  const isLocalhost = window.location.hostname === 'localhost';

  const handleSendMagicLink = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (err) {
        setError(err.message);
      } else {
        setMessage("Check your email — your link is on the way.");
        setEmail("");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDevPasswordLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!devEmail.trim() || !devPassword.trim()) {
      setError("Please enter email and password");
      return;
    }

    setDevLoading(true);
    try {
      const { error: err } = await supabase.auth.signInWithPassword({
        email: devEmail.trim(),
        password: devPassword.trim(),
      });

      if (err) {
        setError(err.message);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setDevLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
    }}>
      <div style={{
        maxWidth: "430px",
        width: "100%",
        textAlign: "center",
      }}>
        {/* Logo */}
        <div style={{
          fontFamily: "'Clash Display', sans-serif",
          fontSize: 36,
          fontWeight: 700,
          marginBottom: 16,
          letterSpacing: "-0.5px",
        }}>
          <span style={{color: "var(--lime)"}}>EZ</span>
          <span style={{color: "var(--cream)"}}>Macros</span>
        </div>

        {/* Tagline */}
        <div style={{
          fontSize: 15,
          color: "var(--muted)",
          marginBottom: 40,
          lineHeight: 1.6,
        }}>
          Real meals. Real macros. Actually easy.
        </div>

        {/* Form */}
        <form onSubmit={handleSendMagicLink} style={{marginBottom: 24}}>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            style={{
              width: "100%",
              background: "var(--s2)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "14px 16px",
              color: "var(--cream)",
              fontSize: 15,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              marginBottom: 16,
              boxSizing: "border-box",
              outline: "none",
              transition: "border-color 0.15s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--lime)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--border)";
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: "var(--lime)",
              color: "#000",
              border: "none",
              borderRadius: 12,
              padding: "14px 16px",
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "'Clash Display', sans-serif",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              transition: "opacity 0.15s",
            }}
          >
            {loading ? "Sending..." : "Send Magic Link"}
          </button>
        </form>

        {/* Success Message */}
        {message && (
          <div style={{
            background: "rgba(201, 241, 58, 0.1)",
            border: "1px solid rgba(201, 241, 58, 0.3)",
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

        {/* Dev Password Form (localhost only) */}
        {isLocalhost && (
          <>
            {/* Or Divider */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "32px 0 24px",
            }}>
              <div style={{flex: 1, height: "1px", background: "var(--border)"}}></div>
              <div style={{fontSize: 12, color: "var(--muted)", fontWeight: 600}}>or</div>
              <div style={{flex: 1, height: "1px", background: "var(--border)"}}></div>
            </div>

            <form onSubmit={handleDevPasswordLogin} style={{marginBottom: 24}}>
              <input
                type="email"
                placeholder="dev email"
                value={devEmail}
                onChange={(e) => setDevEmail(e.target.value)}
                disabled={devLoading}
                style={{
                  width: "100%",
                  background: "var(--s2)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "12px 14px",
                  color: "var(--cream)",
                  fontSize: 13,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  marginBottom: 10,
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--lime)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border)";
                }}
              />

              <input
                type="password"
                placeholder="dev password"
                value={devPassword}
                onChange={(e) => setDevPassword(e.target.value)}
                disabled={devLoading}
                style={{
                  width: "100%",
                  background: "var(--s2)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "12px 14px",
                  color: "var(--cream)",
                  fontSize: 13,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  marginBottom: 12,
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "border-color 0.15s",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--lime)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border)";
                }}
              />

              <button
                type="submit"
                disabled={devLoading}
                style={{
                  width: "100%",
                  background: "var(--s2)",
                  color: "var(--muted)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "12px 14px",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  cursor: devLoading ? "not-allowed" : "pointer",
                  opacity: devLoading ? 0.6 : 1,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!devLoading) {
                    e.target.style.borderColor = "var(--lime)";
                    e.target.style.color = "var(--lime)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "var(--border)";
                  e.target.style.color = "var(--muted)";
                }}
              >
                {devLoading ? "Signing in..." : "Dev Login (localhost only)"}
              </button>
            </form>
          </>
        )}

        {/* Footer */}
        <div style={{
          fontSize: 12,
          color: "var(--muted)",
          marginTop: 40,
          lineHeight: 1.6,
        }}>
          We'll send you a magic link. No password needed.
        </div>
      </div>
    </div>
  );
}
