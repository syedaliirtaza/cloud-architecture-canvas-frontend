import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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
import { authAPI, type LoginData, type RegisterData } from "@/api/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

const AuthForm = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [registerForm, setRegisterForm] = useState<RegisterData>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const [loginForm, setLoginForm] = useState<LoginData>({
    email: "",
    password: "",
  });

  const registerMutation = useMutation({
    mutationFn: authAPI.register,
    onSuccess: (data) => {
      setAuth(data.token, {
        id: data.id,
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
      });

      navigate("/");
      toast("Account created successfully");
      setRegisterForm({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
      });
    },
    onError: (error: any) => {
      toast("Registration failed");
    },
  });

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      setAuth(data.token, {
        id: data.id,
        email: data.email,
        firstname: data.firstname,
        lastname: data.lastname,
      });
      toast("Login successful");
      navigate("/");
    },
    onError: (error: any) => {
      toast("Login failed");
    },
  });

  const handleRegisterChange = (field: keyof RegisterData, value: string) => {
    setRegisterForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLoginChange = (field: keyof LoginData, value: string) => {
    setLoginForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(registerForm);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginForm);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
      <Card className="w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
          <CardDescription>
            Login to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                    value={loginForm.email}
                    onChange={(e) => handleLoginChange("email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) =>
                      handleLoginChange("password", e.target.value)
                    }
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-firstname">First Name</Label>
                    <Input
                      id="register-firstname"
                      type="text"
                      placeholder="First name"
                      value={registerForm.firstname}
                      onChange={(e) =>
                        handleRegisterChange("firstname", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-lastname">Last Name</Label>
                    <Input
                      id="register-lastname"
                      type="text"
                      placeholder="Last name"
                      value={registerForm.lastname}
                      onChange={(e) =>
                        handleRegisterChange("lastname", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="Enter your email"
                    value={registerForm.email}
                    onChange={(e) =>
                      handleRegisterChange("email", e.target.value)
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="Create a password"
                    value={registerForm.password}
                    onChange={(e) =>
                      handleRegisterChange("password", e.target.value)
                    }
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending
                    ? "Creating Account..."
                    : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
