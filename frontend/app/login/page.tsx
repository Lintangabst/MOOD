"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { FloatingInput } from "@/components/ui/FloatingInput";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [rememberMe, setRememberMe] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema)
  });

  const router = useRouter();

  const onSubmit = async (data: LoginInput) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", data);
  
      const { token, user } = res.data;
  
      Cookies.set("token", token, { path: "/", expires: 1 }); // 1 hari
      Cookies.set("role", user.role, { path: "/" });      
  
      toast.success("Login berhasil!");
  
      // ✅ Redirect berdasarkan role
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Login gagal");
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-blue-100 px-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="bg-[#C0F5A9] hidden md:flex items-center justify-center p-6">
          <Image
            src="/img/log.png"
            alt="Login Illustration"
            width={300}
            height={300}
          />
        </div>

        <div className="p-8 flex flex-col justify-center">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="text-center">
                <h1 className="text-3xl font-bold text-black">Welcome Back</h1>
                <h2 className="text-xl font-semibold text-gray-700">Sign in</h2>
                <p className="text-gray-500 text-sm mt-1">
                    Just sign in if you have an account in here. Enjoy our Website
                </p>
          </div>


            <FloatingInput
              label="Your Email / Username"
              placeholder="Enter email"
              className={`border ${errors.email ? "border-red-500" : "border-green-500"}`}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}

            <FloatingInput
              type="password"
              label="Enter Password"
              placeholder="Password"
              className={`border ${errors.password ? "border-red-500" : "border-green-500"}`}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="accent-green-600"
                />
                Remember Me
              </label>
              <Link href="#" className="text-green-600 hover:underline">
                Forgot Password
              </Link>
            </div>

            <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">
              Login
            </Button>

            <p className="text-center text-sm">
              Don’t have an account?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
