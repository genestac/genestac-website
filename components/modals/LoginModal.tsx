"use client";

import React, { useState } from "react";
import { useModals } from "@/context/ModalContext";
import { X, Lock, Mail, ArrowRight } from "lucide-react";

export const LoginModal: React.FC = () => {
  const { isLoginOpen, setLoginOpen } = useModals();
  const [formData, setFormData] = useState({ email: "", password: "" });

  if (!isLoginOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Logged in as: ${formData.email} (Demo Mode)`);
    setLoginOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-brand-950/60 backdrop-blur-md z-[120] flex items-center justify-center px-3 py-4 sm:px-4 sm:py-8 transition-opacity">
      <div className="login-box relative animate-fade-in w-full overflow-y-auto" style={{maxHeight: '92vh'}}>
        <button
          onClick={() => setLoginOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-brand-900 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-serif font-bold text-brand-950 mb-1">Welcome Back</h2>
        <p className="sub text-slate-500 mb-6">Log in to manage your medical prescriptions & consults</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="input-group">
            <input
              type="email"
              required
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              required
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button type="submit" className="login-btn w-full font-bold btn-shine">
            Log In securely
          </button>
        </form>

        <div className="divider my-6 text-center text-xs text-slate-400 font-bold uppercase tracking-wider">
          or continue with
        </div>

        <button className="social-btn w-full font-semibold mb-2">Google Account</button>
        <button className="social-btn w-full font-semibold">Passkey / Medical ID</button>

        <p className="extra text-center text-slate-500 text-xs mt-6">
          New patient?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setLoginOpen(false);
            }}
            className="text-brand-600 hover:underline font-bold"
          >
            Create an Account
          </a>
        </p>
      </div>
    </div>
  );
};
