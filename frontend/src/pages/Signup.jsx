import React, { useEffect, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../auth/msalConfig";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { api } from "../api";

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();
  const { instance } = useMsal();
  const membershipType = location.state?.membershipType || "";

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 ADD THIS BLOCK (same as Login page)
  useEffect(() => {
    const finishMicrosoftSignup = async () => {
      try {
        const existingMember = localStorage.getItem("member");
        if (existingMember) return;

        const redirectResult = await instance.handleRedirectPromise();

        let account = redirectResult?.account;

        // fallback if redirectResult is null
        if (!account) {
          const accounts = instance.getAllAccounts();
          if (accounts.length > 0) {
            account = accounts[0];
          }
        }

        if (!account) return;

        setLoading(true);
        setMessage("");

        const tokenResponse = await instance.acquireTokenSilent({
          ...loginRequest,
          account,
        });

        const accessToken = tokenResponse?.accessToken;

        if (!accessToken) {
          setMessage("Microsoft signup failed. No access token received.");
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
          setMessage(result?.message || "Microsoft signup failed.");
        }
      } catch (error) {
        console.error("Microsoft redirect error:", error);
        setMessage(error?.message || "Microsoft signup failed.");
      } finally {
        setLoading(false);
      }
    };

    finishMicrosoftSignup();
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

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        setMessage("");

        const result = await api.post("googleLogin.php", {
          access_token: tokenResponse.access_token,
        });

        if (result?.success && result?.user) {
          const memberData = {
            ...result.user,
            last_login: result.last_login,
          };

          setTimeout(() => {
            goNext(memberData);
          }, 1000);
        } else {
          setMessage(result?.message || "Google signup failed");
        }
      } catch (err) {
        console.error("Google signup error:", err);
        setMessage("Google signup error");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setMessage("Google sign-up failed.");
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

  const handleSignup = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirm_password) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const signupResult = await api.post("registerMember.php", {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        auth_provider: "manual",
      });

      if (signupResult?.success) {
        setMessage("Signup successful. Please check your email.");

        setTimeout(() => {
          navigate("/login", {
            state: { membershipType },
          });
        }, 2000);
        return;
      }

      setMessage(signupResult?.message || "Signup failed");
    } catch (error) {
      console.error("Signup error:", error);
      setMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const controlClass =
    "w-full h-[48px] px-4 rounded-lg border border-gray-300 text-sm flex items-center justify-center gap-3 hover:bg-gray-50 transition disabled:opacity-60";

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold text-center mb-2">Create Account</h1>

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
            Continue with Google
          </button>

          <button
            type="button"
            onClick={handleMicrosoftLogin}
            className={controlClass}
            disabled={loading}
          >
            Continue with Microsoft
          </button>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <input name="full_name" placeholder="Full Name" onChange={handleChange} required />
          <input name="email" placeholder="Email" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
          <input name="confirm_password" type="password" placeholder="Confirm Password" onChange={handleChange} required />

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        {message && <p>{message}</p>}

        <Link to="/login">Already have an account?</Link>
      </div>
    </section>
  );
}