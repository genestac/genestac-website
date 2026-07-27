"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import AuthModal from "@/components/AuthModal";

interface BlogContentGateProps {
  children: React.ReactNode;
}

export default function BlogContentGate({ children }: BlogContentGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [halfHeight, setHalfHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Measure content height when not authenticated
  useEffect(() => {
    if (isAuthenticated === false && contentRef.current) {
      // Small timeout to ensure content (like images) has started rendering/layout out
      setTimeout(() => {
        if (contentRef.current) {
          const fullHeight = contentRef.current.scrollHeight;
          // Set to half height, with a sensible minimum in case content is very short
          setHalfHeight(Math.max(fullHeight / 2, 600));
        }
      }, 100);
    }
  }, [isAuthenticated]);
  
  if (isAuthenticated === true) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <div 
        className={`relative ${isAuthenticated === null ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}
      >
        <div 
          ref={contentRef}
          className="overflow-hidden transition-all duration-300"
          style={{ maxHeight: halfHeight ? `${halfHeight}px` : '1500px' }}
        >
          {children}
        </div>
        
        {/* Blur overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-[400px] bg-gradient-to-t from-white via-white/90 to-transparent flex flex-col items-center justify-end pb-12">
          <div className="max-w-md w-full px-6 text-center">
            <h3 className="text-2xl font-bold text-navy-900 mb-3">
              Read the Full Article
            </h3>
            <p className="text-slate-600 mb-6">
              Create a free account or sign in to continue reading this article and access exclusive insights.
            </p>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full py-4 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-bold rounded-xl shadow-glow transition-all hover:-translate-y-1"
            >
              Sign In to Continue Reading
            </button>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          // The onAuthStateChange listener will automatically handle ungating
        }}
      />
    </div>
  );
}
