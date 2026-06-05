import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [step, setStep] = useState("email"); // "email" or "code"
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

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
        setMessage("Code sent to your email");
        setStep("code");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!code.trim() || code.length !== 6) {
      setError("Please enter a 6-digit code");
      return;
    }

    setVerifying(true);
    try {
      const { error: err } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: code.trim(),
        type: 'email',
      });

      if (err) {
        setError(err.message);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setVerifying(false);
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

        {/* Step 1: Email */}
        {step === "email" && (
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
        )}

        {/* Step 2: Code Verification */}
        {step === "code" && (
          <form onSubmit={handleVerifyCode} style={{marginBottom: 24}}>
            <div style={{
              fontSize: 13,
              color: "var(--muted)",
              marginBottom: 12,
              fontWeight: 600,
            }}>
              Enter the code from your email
            </div>
            <input
              type="text"
              placeholder="000000"
              maxLength="6"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              disabled={verifying}
              style={{
                width: "100%",
                background: "var(--s2)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "14px 16px",
                color: "var(--cream)",
                fontSize: 15,
                fontFamily: "'Courier New', monospace",
                marginBottom: 16,
                boxSizing: "border-box",
                outline: "none",
                transition: "border-color 0.15s",
                textAlign: "center",
                letterSpacing: "2px",
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
              disabled={verifying}
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
                cursor: verifying ? "not-allowed" : "pointer",
                opacity: verifying ? 0.6 : 1,
                transition: "opacity 0.15s",
              }}
            >
              {verifying ? "Verifying..." : "Verify Code"}
            </button>

            <div style={{
              fontSize: 12,
              color: "var(--muted)",
              marginTop: 16,
              lineHeight: 1.6,
            }}>
              Or click the link in the email
            </div>
          </form>
        )}

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
