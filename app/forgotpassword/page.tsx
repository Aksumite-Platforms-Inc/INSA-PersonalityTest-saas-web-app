"use client";

import React, { useState } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";
import Link from "next/link";
import Illustration from "../../public/undraw_forgot_password_re_hxwm.svg"; // Use a relevant illustration
import Logo from "../../public/INSAlogo.png";
import { performResetPassword } from "@/services/auth.service";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(false); // Reset submitted state
    setError(null); // Reset error state

    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      await performResetPassword(email); // Call the API
      setSubmitted(true); // Show success message
    } catch (err) {
      setError("Failed to send reset link. Please try again."); // Handle error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-gray-800">
      <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl flex flex-col md:flex-row w-full">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 z-0">
          {/* <img src={Logo.src} alt="Watermark Logo" className="max-w-sm" /> */}
        </div>

        {/* Left Section - Illustration */}
        <div className="relative z-10 flex items-center justify-center w-full md:w-1/2 p-8 bg-gray-100">
          {/* <img src={Illustration.src} alt="Illustration" className="max-w-xs" /> */}
        </div>

        {/* Right Section - Form */}
        <div className="relative z-10 w-full md:w-1/2 p-8">
          <div className="text-center mb-8">
            <Typography
              component="h1"
              variant="h5"
              sx={{ fontWeight: "bold", color: "#1F2937", mb: 1 }}
            >
              Forgot Password?
            </Typography>
            <Typography variant="body2" sx={{ color: "gray", mb: 2 }}>
              Enter your email to receive a password reset link.
            </Typography>
          </div>

          {submitted ? (
            <>
              <Typography
                variant="body1"
                sx={{
                  textAlign: "center",
                  mt: 2,
                  color: "gray",
                  fontStyle: "italic",
                }}
              >
                If an account with that email exists, you will receive a
                password reset email shortly.
              </Typography>
              <Link
                href="/login"
                className="text-gray-800 hover:underline text-center"
              >
                Back to Login
              </Link>
            </>
          ) : (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-white"
                InputLabelProps={{
                  style: { color: "#1F2937" }, // Change this color to your desired color
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "#999999",
                    },
                    "&:hover fieldset": {
                      borderColor: "#555555",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1F2937",
                    },
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="bg-gray-800 hover:bg-gray-900 text-white font-semibold"
                sx={{
                  py: 1.5,
                  backgroundColor: "#1F2937",
                  "&:hover": {
                    backgroundColor: "#111111",
                  },
                }}
              >
                Send Reset Link
              </Button>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="mt-6 flex justify-between items-center text-sm">
                <Link href="/login" className="text-gray-800 hover:underline">
                  Back to Login
                </Link>
                <Link href="/help" className="text-gray-800 hover:underline">
                  Need Help?
                </Link>
              </div>
            </Box>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
