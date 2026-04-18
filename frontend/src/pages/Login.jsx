import React, { useEffect, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../auth/msalConfig";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { api } from "../api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { instance } = useMsal();

  const membershipType = location.state?.membershipType || "";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const finishMicrosoftLogin = async () => {
      try {
        // Avoid re-processing if already logged in
        const existingMember = localStorage.getItem("member");
        if (existingMember) {
          return;
        }

        const redirectResult = await instance.handleRedirectPromise();

        let account = redirectResult?.account;

        // Fallback: sometimes redirectResult is null but account exists in MSAL cache
        if (!account) {
          const accounts = instance.getAllAccounts();
          if (accounts.length > 0) {
            account = accounts[0];
          }
        }

        if (!account) {
          return;
        }

        setLoading(true);
        setMessage("");

        const tokenResponse = await instance.acquireTokenSilent({
          ...loginRequest,
          account,
        });

        const accessToken = tokenResponse?.accessToken;

        if (!accessToken) {
          setMessage("Microsoft login failed. No access token received.");
          return;
        }

        const result = await api.post("microsoftLogin.php", {
          access_token: accessToken,
        });

        if (result?.success && result?.user) {
          const memberData = {
            ...result.user,
            last_login: result.last_login,
          };

          localStorage.setItem("member", JSON.stringify(memberData));
          window.dispatchEvent(new Event("authChanged"));
          navigate("/membershipdashboard");
        } else {
          setMessage(result?.message || "Microsoft login failed.");
        }
      } catch (error) {
        console.error("Microsoft redirect handling error:", error);
        setMessage(error?.message || "Microsoft sign-in failed.");
      } finally {
        setLoading(false);
      }
    };

    finishMicrosoftLogin();
  }, [instance, navigate]);

  const goNext = (user) => {
    localStorage.setItem("member", JSON.stringify(user));
    window.dispatchEvent(new Event("authChanged"));
    navigate("/membershipdashboard");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleManualLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await api.post("loginMember.php", formData);

      if (result?.success && result?.user) {
        setMessage("Login successful! Redirecting to dashboard...");

        const memberData = {
          ...result.user,
          last_login: result.last_login,
        };

        setTimeout(() => {
          goNext(memberData);
        }, 1000);
      } else {
        setMessage(result?.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage(error.message || "Something went wrong during login.");
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        setMessage("");

        const result = await api.post("googleLogin.php", {
          access_token: tokenResponse.access_token,
        });

        if (result?.success && result?.user) {
          setMessage("Login successful! Redirecting to dashboard...");

          const memberData = {
            ...result.user,
            last_login: result.last_login,
          };

          setTimeout(() => {
            goNext(memberData);
          }, 1000);
        } else {
          setMessage(result?.message || "Google login failed.");
        }
      } catch (error) {
        console.error("Google login error:", error);
        setMessage("Google login failed.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setMessage("Google sign-in failed.");
    },
  });

  const handleMicrosoftLogin = async () => {
    try {
      setLoading(true);
      setMessage("");
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error("Microsoft login error:", error);
      setMessage(error?.message || "Microsoft sign-in failed.");
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!formData.email) {
      setMessage("Please enter your email first.");
      return;
    }

    try {
      setLoading(true);
      const result = await api.post("resendVerification.php", {
        email: formData.email,
      });

      setMessage(result?.message || "Unable to resend verification email.");
    } catch (error) {
      console.error("Resend verification error:", error);
      setMessage("Something went wrong while resending verification email.");
    } finally {
      setLoading(false);
    }
  };

  const controlClass =
    "w-full h-[48px] px-4 rounded-lg border border-gray-300 text-sm flex items-center justify-center gap-3 hover:bg-gray-50 transition disabled:opacity-60";

  return (
    <section className="min-h-screen bg-brand-cream flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-brand">Sign In</h1>
          <p className="text-gray-600 mt-2">
            Access your member account to continue.
          </p>
        </div>

        {membershipType && (
          <p className="text-center text-sm text-gray-600 mb-4">
            Selected membership: <strong>{membershipType}</strong>
          </p>
        )}

        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={() => googleLogin()}
            className={controlClass}
            disabled={loading}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span className="text-gray-700">Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={handleMicrosoftLogin}
            className={controlClass}
            disabled={loading}
          >
            <div className="grid grid-cols-2 gap-[2px] w-5 h-5 overflow-hidden rounded-sm">
              <div className="bg-[#F25022]" />
              <div className="bg-[#7FBA00]" />
              <div className="bg-[#00A4EF]" />
              <div className="bg-[#FFB900]" />
            </div>
            <span className="text-gray-700">Continue with Microsoft</span>
          </button>
        </div>

        <div className="relative my-6">
          <div className="border-t" />
          <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-3 text-sm text-gray-500">
            Or sign in with email
          </span>
        </div>

        <form onSubmit={handleManualLogin} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full h-[48px] px-4 border rounded-lg"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full h-[48px] px-4 border rounded-lg"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[48px] bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <button
            type="button"
            onClick={handleResendVerification}
            disabled={loading}
            className="w-full mt-2 text-sm text-brand font-medium hover:underline disabled:opacity-60"
          >
            Resend Verification Email
          </button>
        </form>

        {message && (
          <p
            className={`text-sm text-center mt-4 ${
              message.toLowerCase().includes("successful") ||
              message.toLowerCase().includes("redirecting")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}

        <Link
          to="/forgot-password"
          className="block text-center text-sm text-brand font-medium mt-3 hover:underline"
        >
          Forgot Password?
        </Link>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            state={{ membershipType }}
            className="text-brand font-semibold"
          >
            Join now
          </Link>
        </p>
      </div>
    </section>
  );
}