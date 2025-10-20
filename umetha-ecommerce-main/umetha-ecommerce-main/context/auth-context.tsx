"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { Session, User, Provider } from "@supabase/supabase-js";
import Cookies from "js-cookie";

// Define the possible user roles
export type UserRole = "USER" | "ADMIN" | "INFLUENCER" | "SELLER";

// Extended user type with role information
type ExtendedUser = User & {
  role?: UserRole;
};

type AuthContextType = {
  user: ExtendedUser | null;
  session: Session | null;
  isLoading: boolean;
  isConfigured: boolean;
  userRole: UserRole | null;
  signIn: (
    email: string,
    password: string
  ) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signInToDashboard: (
    email: string,
    password: string,
    targetRole: UserRole
  ) => Promise<{
    error: any | null;
    data: any | null;
    hasAccess: boolean;
  }>;
  signUp: (
    email: string,
    password: string,
    userData?: any
  ) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signInWithSocial: (provider: Provider) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  resetPassword: (email: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  updatePassword: (newPassword: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  updateUserProfile: (data: any) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  sendVerificationEmail: () => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
  getUserRole: () => Promise<UserRole | null>;
  getDashboardRoute: () => string;
  setTempRole: (role: UserRole) => void;
  clearTempRole: () => void;
  hasRoleAccess: (requiredRole: UserRole) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  isConfigured: false,
  userRole: null,
  signIn: async () => ({ error: null, data: null }),
  signInToDashboard: async () => ({
    error: null,
    data: null,
    hasAccess: false,
  }),
  signUp: async () => ({ error: null, data: null }),
  signInWithSocial: async () => ({ error: null, data: null }),
  resetPassword: async () => ({ error: null, data: null }),
  updatePassword: async () => ({ error: null, data: null }),
  updateUserProfile: async () => ({ error: null, data: null }),
  sendVerificationEmail: async () => ({ error: null, data: null }),
  signOut: async () => {},
  getUserRole: async () => null,
  getDashboardRoute: () => "/dashboard",
  setTempRole: () => {},
  clearTempRole: () => {},
  hasRoleAccess: async () => false,
});

// Test accounts for development
const TEST_ACCOUNTS = {
  "admin@umetha.com": { password: "admin123", role: "ADMIN" as UserRole },
  "seller@umetha.com": { password: "seller123", role: "SELLER" as UserRole },
  "influencer@umetha.com": {
    password: "influencer123",
    role: "INFLUENCER" as UserRole,
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigured, setIsConfigured] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  // Function to fetch and set the user's role
  const fetchUserRole = async (userId: string): Promise<UserRole | null> => {
    try {
      // First check for temp role
      const tempRole = Cookies.get("temp_role") as UserRole;
      if (tempRole) {
        setUserRole(tempRole);
        return tempRole;
      }

      // Try to get role from profiles table
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      // Get role from user metadata as backup
      const { data: userData } = await supabase.auth.getUser();
      const metadataRole =
        userData?.user?.user_metadata?.role?.toUpperCase() as UserRole;

      // Determine the effective role with fallbacks
      let effectiveRole: UserRole = "USER";

      if (data?.role) {
        // If role exists in profile, use it
        effectiveRole = data.role.toUpperCase() as UserRole;
      } else if (metadataRole) {
        // If role exists in metadata but not in profile, update profile
        effectiveRole = metadataRole;

        // Update the profiles table with the role from metadata
        await supabase.from("profiles").upsert({
          id: userId,
          role: effectiveRole,
          updated_at: new Date().toISOString(),
        });
      } else if (error) {
        // If there was an error fetching from profiles, check special cases
        if (Object.keys(TEST_ACCOUNTS).includes(userData?.user?.email || "")) {
          effectiveRole = TEST_ACCOUNTS[userData?.user?.email || ""].role;

          // Ensure profile exists
          await supabase.from("profiles").upsert({
            id: userId,
            role: effectiveRole,
            email: userData?.user?.email,
            updated_at: new Date().toISOString(),
          });
        } else {
          console.warn("Error fetching user role:", error);
        }
      }

      setUserRole(effectiveRole);
      return effectiveRole;
    } catch (error) {
      console.error("Error in fetchUserRole:", error);
      return "USER";
    }
  };

  // Check for temporary role (for admin impersonation)
  const checkTempRole = () => {
    const tempRole = Cookies.get("temp_role");
    const originalRole = Cookies.get("original_role");

    if (tempRole && originalRole && userRole === originalRole) {
      setUserRole(tempRole as UserRole);
      return tempRole as UserRole;
    }
    return null;
  };

  // Set temporary role (for admin impersonation)
  const setTempRole = (role: UserRole) => {
    if (!user || !userRole) return;

    // Store original role
    Cookies.set("original_role", userRole, { expires: 1, path: "/" });
    // Set temporary role
    Cookies.set("temp_role", role, { expires: 1, path: "/" });
    setUserRole(role);
  };

  // Clear temporary role
  const clearTempRole = () => {
    const originalRole = Cookies.get("original_role");
    if (originalRole) {
      setUserRole(originalRole as UserRole);
    }

    Cookies.remove("temp_role", { path: "/" });
    Cookies.remove("original_role", { path: "/" });
  };

  // Determine the dashboard route for the user based on their role
  const getDashboardRoute = (): string => {
    // If there's a temporary role, use that for routing
    const tempRole = Cookies.get("temp_role")?.toUpperCase() as UserRole;
    const effectiveRole = tempRole || userRole;

    // Normalize role to ensure consistent casing
    const normalizedRole = effectiveRole?.toUpperCase();

    switch (normalizedRole) {
      case "ADMIN":
        return "/dashboard/admin";
      case "INFLUENCER":
        return "/dashboard/influencer";
      case "SELLER":
        return "/dashboard/seller";
      case "USER":
        return "/"; // Regular users redirect to homepage
      default:
        // For safety, if we somehow have an authenticated user with no role,
        // send them to dashboard-signin to let the role-specific sign in handle it
        return user ? "/dashboard-signin" : "/signin";
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Check if Supabase configuration is valid
    const checkConfig = () => {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (
        url &&
        key &&
        !url.includes("example") &&
        !key.includes("your-anon-key")
      ) {
        setIsConfigured(true);
        return true;
      }

      console.warn(
        "Supabase is not properly configured. Authentication features will not work."
      );
      setIsConfigured(false);
      return false;
    };

    // Check for dev bypass cookie (for development access)
    const checkDevBypass = () => {
      const bypass = Cookies.get("dashboard-dev-bypass");
      if (bypass === "true") {
        const mockAdmin = {
          id: "dev-admin-id",
          email: "dev@umetha.com",
          role: "ADMIN" as UserRole,
        };
        setUser(mockAdmin as ExtendedUser);
        setUserRole("ADMIN");
        setIsLoading(false);
        return true;
      }
      return false;
    };

    // Initialize authentication
    const initializeAuth = async () => {
      setIsLoading(true);

      // Check for development bypass
      if (checkDevBypass()) {
        return;
      }

      // Only proceed if configuration looks valid
      if (!checkConfig()) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error loading session:", error);
        } else if (data.session) {
          setSession(data.session);
          setUser(data.session.user || null);

          // Fetch role if we have a user
          if (data.session.user) {
            const role = await fetchUserRole(data.session.user.id);
            // Check for temporary role impersonation
            checkTempRole();
          }
        }

        // Setup listener for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            setSession(session);
            setUser(session?.user || null);

            // Fetch role on auth state change
            if (session?.user) {
              await fetchUserRole(session.user.id);
              // Check for temporary role impersonation
              checkTempRole();
            } else {
              setUserRole(null);
              // Clear temp role cookies on signout
              Cookies.remove("temp_role", { path: "/" });
              Cookies.remove("original_role", { path: "/" });
            }
          }
        );

        return () => {
          authListener?.subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Failed to initialize auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!isConfigured) {
      return {
        error: { message: "Authentication is not configured properly" },
        data: null,
      };
    }

    try {
      // Special handling for test accounts
      const isTestAccount = Object.keys(TEST_ACCOUNTS).includes(email);

      if (isTestAccount && TEST_ACCOUNTS[email].password === password) {
        console.log(`Test account detected: ${email}`);

        // Try regular sign in first
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        // If successful regular sign-in
        if (!error && data?.user) {
          // Set role and update cookies
          const role = TEST_ACCOUNTS[email].role;
          setUserRole(role);

          // Update user metadata with role if needed
          await supabase.auth.updateUser({
            data: { role },
          });

          // Make sure profile has correct role
          await supabase.from("profiles").upsert({
            id: data.user.id,
            role,
            updated_at: new Date().toISOString(),
          });

          return { data, error: null };
        }

        // If regular sign-in failed, try to create the test account
        if (error) {
          // Create the test account
          const { data: signUpData, error: signUpError } =
            await supabase.auth.signUp({
              email,
              password,
              options: {
                data: { role: TEST_ACCOUNTS[email].role },
              },
            });

          if (!signUpError) {
            // Try signing in again after creation
            const { data: retryData, error: retryError } =
              await supabase.auth.signInWithPassword({
                email,
                password,
              });

            if (!retryError && retryData?.user) {
              setUserRole(TEST_ACCOUNTS[email].role);
              return { data: retryData, error: null };
            }
          }

          // As a last resort for development, use a mock user
          const mockUser = {
            id: `test-${email.split("@")[0]}-id`,
            email,
            role: TEST_ACCOUNTS[email].role,
          };

          setUser(mockUser as ExtendedUser);
          setUserRole(TEST_ACCOUNTS[email].role);

          return {
            data: {
              user: mockUser,
              session: { user: mockUser, access_token: "mock-token" },
            },
            error: null,
          };
        }
      }

      // Normal sign-in flow for non-test accounts
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (data?.user && !error) {
        await fetchUserRole(data.user.id);
      }

      return { data, error };
    } catch (error) {
      console.error("Sign in error:", error);
      return {
        error: { message: "An unexpected error occurred during sign in" },
        data: null,
      };
    }
  };

  const signInToDashboard = async (
    email: string,
    password: string,
    targetRole: UserRole
  ) => {
    const { data, error } = await signIn(email, password);
    if (error) {
      return { data, error, hasAccess: false };
    }

    const hasAccess = await hasRoleAccess(targetRole);
    return { data, error, hasAccess };
  };

  // Function to get user role (useful for components that need it on-demand)
  const getUserRole = async (): Promise<UserRole | null> => {
    // Check for temp role first
    const tempRole = Cookies.get("temp_role") as UserRole;
    if (tempRole) return tempRole;

    if (!user) return null;
    if (userRole) return userRole;
    return await fetchUserRole(user.id);
  };

  const hasRoleAccess = async (requiredRole: UserRole): Promise<boolean> => {
    const role = await getUserRole();
    return role === requiredRole;
  };

  const signUp = async (email: string, password: string, userData?: any) => {
    if (!isConfigured) {
      return {
        error: { message: "Authentication is not configured properly" },
        data: null,
      };
    }

    // Default to USER role if not specified
    const roleData = {
      ...userData,
      role: userData?.role || "USER",
    };

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: roleData,
        },
      });

      // Create profile entry
      if (data?.user && !error) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          email: email,
          role: roleData.role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...roleData,
        });
      }

      return { data, error };
    } catch (error) {
      console.error("Sign up error:", error);
      return {
        error: { message: "An unexpected error occurred during sign up" },
        data: null,
      };
    }
  };

  const signInWithSocial = async (provider: Provider) => {
    if (!isConfigured) {
      return {
        error: { message: "Authentication is not configured properly" },
        data: null,
      };
    }

    try {
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
        },
      });

      return { data, error };
    } catch (error) {
      console.error(`Sign in with ${provider} error:`, error);
      return {
        error: {
          message: `An unexpected error occurred during ${provider} sign in`,
        },
        data: null,
      };
    }
  };

  const resetPassword = async (email: string) => {
    if (!isConfigured) {
      return {
        error: { message: "Authentication is not configured properly" },
        data: null,
      };
    }

    try {
      const redirectTo = `${window.location.origin}/auth/reset-password`;
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      return { data, error };
    } catch (error) {
      console.error("Reset password error:", error);
      return {
        error: {
          message: "An unexpected error occurred during password reset",
        },
        data: null,
      };
    }
  };

  const updatePassword = async (newPassword: string) => {
    if (!isConfigured) {
      return {
        error: { message: "Authentication is not configured properly" },
        data: null,
      };
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      return { data, error };
    } catch (error) {
      console.error("Update password error:", error);
      return {
        error: {
          message: "An unexpected error occurred when updating password",
        },
        data: null,
      };
    }
  };

  const updateUserProfile = async (userData: any) => {
    if (!isConfigured || !user) {
      return {
        error: {
          message: "Authentication is not configured or user is not signed in",
        },
        data: null,
      };
    }

    try {
      // First update auth metadata
      const { data: authData, error: authError } =
        await supabase.auth.updateUser({
          data: userData,
        });

      if (authError) throw authError;

      // Then update the profiles table
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        ...userData,
        updated_at: new Date().toISOString(),
      });

      if (profileError) {
        console.warn("Failed to update profile:", profileError);
      }

      return { data: authData, error: null };
    } catch (error) {
      console.error("Update user profile error:", error);
      return {
        error: {
          message: "An unexpected error occurred when updating profile",
        },
        data: null,
      };
    }
  };

  const sendVerificationEmail = async () => {
    if (!isConfigured || !user?.email) {
      return {
        error: {
          message:
            "Authentication is not configured or user email is not available",
        },
        data: null,
      };
    }

    try {
      const { data, error } = await supabase.auth.resend({
        type: "signup",
        email: user.email,
      });

      return { data, error };
    } catch (error) {
      console.error("Send verification email error:", error);
      return {
        error: {
          message:
            "An unexpected error occurred when sending verification email",
        },
        data: null,
      };
    }
  };

  const signOut = async () => {
    if (!isConfigured) {
      return;
    }

    try {
      // Clear role impersonation cookies
      Cookies.remove("temp_role", { path: "/" });
      Cookies.remove("original_role", { path: "/" });

      // Also clear dev bypass cookie
      Cookies.remove("dashboard-dev-bypass", { path: "/" });

      // Sign out from Supabase
      await supabase.auth.signOut();
      setUserRole(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isConfigured,
        userRole,
        signIn,
        signInToDashboard,
        signUp,
        signInWithSocial,
        resetPassword,
        updatePassword,
        updateUserProfile,
        sendVerificationEmail,
        signOut,
        getUserRole,
        getDashboardRoute,
        setTempRole,
        clearTempRole,
        hasRoleAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
