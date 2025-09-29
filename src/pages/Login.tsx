import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sprout,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  Leaf,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";
import heroImage from "@/assets/agri.webp";
import { signInWithPopup } from "firebase/auth";
// TODO: Update the path below if your firebase utils are in a different location
// import { auth, provider } from "@/lib/firebase";
import { auth, provider } from "../../utils/firebase.js";

const BACKEND_URL = "https://authentication-auth-backend.vercel.app/api/auth";
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const passwordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const getPasswordStrengthLabel = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return { label: "Very Weak", color: "bg-red-500" };
      case 2:
        return { label: "Weak", color: "bg-orange-500" };
      case 3:
        return { label: "Good", color: "bg-yellow-500" };
      case 4:
        return { label: "Strong", color: "bg-green-500" };
      case 5:
        return { label: "Very Strong", color: "bg-green-600" };
      default:
        return { label: "", color: "" };
    }
  };

  const socialLogins = [
    {
      icon: () => (
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      ),
      name: "Google",
      color: "hover:bg-red-50",
    },
    {
      icon: () => (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="#181717">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
      name: "GitHub",
      color: "hover:bg-gray-50",
    },
  ];

  const features = [
    { icon: Leaf, text: "Advanced crop monitoring" },
    { icon: Shield, text: "Secure data protection" },
    { icon: Zap, text: "Real-time AI insights" },
    { icon: CheckCircle, text: "24/7 support included" },
  ];

  const ishandleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
    navigate("/dashboard");
  };

  // Removed duplicate handleLogin and handleSignup definitions above. Only the API-based versions below are kept.
  const [errorMessage, setErrorMessage] = useState("");

  // Google login
  const googleLogin = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await signInWithPopup(auth, provider);
      const user = response.user;

      const userdata = {
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
        phoneNumber: user.phoneNumber,
      };

      const apiResponse = await fetch(`${BACKEND_URL}/googleLogin`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userdata),
      });

      if (!apiResponse.ok) {
        const text = await apiResponse.text();
        throw new Error(text || "Failed to login with Google");
      }

      const data = await apiResponse.json();
      console.log("Google Auth Response:", data);

      window.location.replace("/"); // redirect after success
    } catch (error) {
      console.error("Google login failed:", error);
      setErrorMessage("Google authentication failed.");
      setIsLoading(false);
    }
  };

  // Normal login
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
        credentials: "include",
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || "Failed to login");

      console.log("Login success:", data);
      window.location.assign("/"); // redirect
    } catch (err) {
      setErrorMessage(err.message || "Something went wrong. Try again.");
      setIsLoading(false);
    }
  };

  // Normal signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    if (signupForm.password !== signupForm.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupForm.name,
          email: signupForm.email,
          password: signupForm.password,
        }),
        credentials: "include",
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.message || "Failed to signup");

      console.log("Signup success:", data);
      window.location.assign("/");
    } catch (err) {
      setErrorMessage(err.message || "Something went wrong. Try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-emerald-900/60" />
      </div>

      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-r from-green-400/20 to-emerald-400/20 rounded-full blur-3xl"
        animate={{
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-24 h-24 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-2xl"
        animate={{
          y: [0, 20, 0],
          scale: [1, 0.8, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center px-12">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="max-w-lg"
        >
          {/* Logo and Title */}
          <motion.div
            className="mb-8"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Link to="/" className="inline-flex items-center space-x-3 group">
              <div className="p-3 rounded-2xl bg-white/100 backdrop-blur-sm border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                <img
                  src={logo}
                  alt="FarmFIT Logo"
                  className="h-12 w-auto object-contain"
                />
              </div>
              <div>
                <p className="text-green-300 text-sm">
                  Precision Agriculture Platform
                </p>
              </div>
            </Link>
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
          >
            Transform Your
            <span className="block text-gradient bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-emerald-200">
              Agricultural Future
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-white/90 mb-8 leading-relaxed"
          >
            Join thousands of farmers using AI-powered insights to optimize
            yields, reduce costs, and build sustainable operations.
          </motion.p>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-4 mb-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <div className="p-2 rounded-lg bg-green-500/20 backdrop-blur-sm">
                  <feature.icon className="h-5 w-5 text-green-300" />
                </div>
                <span className="text-white/80">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="grid grid-cols-2 gap-6"
          >
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-green-300">25%</div>
              <div className="text-sm text-white/70">Yield Increase</div>
            </div>
            <div className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-2xl font-bold text-blue-300">30%</div>
              <div className="text-sm text-white/70">Water Saved</div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Login/Signup Form */}
      <div className="w-full lg:w-1/2 relative z-10 flex items-center justify-center p-4 lg:p-8">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-full max-w-sm"
        >
          <Card className="bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-2xl overflow-hidden">
            <CardHeader className="space-y-1 text-center pb-3">
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                {activeTab === "login" ? "Welcome Back" : "Get Started"}
              </CardTitle>
              <CardDescription className="text-gray-600 text-sm">
                {activeTab === "login"
                  ? "Sign in to access your dashboard"
                  : "Create your account and start farming smart"}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-5 pt-0">
              {errorMessage && (
                <div className="text-red-600 text-sm text-center mb-3">
                  {errorMessage}
                </div>
              )}

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-5 bg-gray-100 p-1 rounded-xl">
                  <TabsTrigger
                    value="login"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium text-sm"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger
                    value="signup"
                    className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-medium text-sm"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                {/* LOGIN */}
                <TabsContent value="login" className="space-y-4 mt-0">
                  <button
                    onClick={googleLogin}
                    className="flex items-center justify-center gap-2 w-full p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                    disabled={isLoading}
                  >
                    <img
                      src="https://www.svgrepo.com/show/355037/google.svg"
                      alt="Google"
                      className="h-5 w-5"
                    />
                    Continue with Google
                  </button>

                  <div className="relative text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <span className="relative bg-white px-4 text-sm text-gray-500">
                      or continue with email
                    </span>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        value={loginForm.email}
                        onChange={(e) =>
                          setLoginForm({ ...loginForm, email: e.target.value })
                        }
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Password</Label>
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={loginForm.password}
                        onChange={(e) =>
                          setLoginForm({
                            ...loginForm,
                            password: e.target.value,
                          })
                        }
                        placeholder="Enter your password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-3 top-9"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </Button>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-10 bg-green-600 text-white rounded-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>

                {/* SIGNUP */}
                <TabsContent value="signup" className="space-y-4 mt-0">
                  <button
                    onClick={googleLogin}
                    className="flex items-center justify-center gap-2 w-full p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                    disabled={isLoading}
                  >
                    <img
                      src="https://www.svgrepo.com/show/355037/google.svg"
                      alt="Google"
                      className="h-5 w-5"
                    />
                    Sign up with Google
                  </button>

                  <div className="relative text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <span className="relative bg-white px-4 text-sm text-gray-500">
                      or create account with email
                    </span>
                  </div>

                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        type="text"
                        value={signupForm.name}
                        onChange={(e) =>
                          setSignupForm({ ...signupForm, name: e.target.value })
                        }
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        value={signupForm.email}
                        onChange={(e) =>
                          setSignupForm({
                            ...signupForm,
                            email: e.target.value,
                          })
                        }
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div className="space-y-2 relative">
                      <Label>Password</Label>
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={signupForm.password}
                        onChange={(e) =>
                          setSignupForm({
                            ...signupForm,
                            password: e.target.value,
                          })
                        }
                        placeholder="Create a secure password"
                        required
                      />
                    </div>

                    <div className="space-y-2 relative">
                      <Label>Confirm Password</Label>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        value={signupForm.confirmPassword}
                        onChange={(e) =>
                          setSignupForm({
                            ...signupForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="Confirm your password"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-10 bg-green-600 text-white rounded-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
