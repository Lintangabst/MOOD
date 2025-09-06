"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/validators/auth-schema";
import { FloatingInput } from "@/components/ui/FloatingInput";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import Select from "react-select";
import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
import { getCountryCallingCode, CountryCode } from "libphonenumber-js";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";


// ✅ Register English locale
countries.registerLocale(enLocale);

// ✅ Generate options with phone codes and flags
const countryOptions = Object.entries(
  countries.getNames("en", { select: "official" })
)
  .filter(([code]) => {
    // Only include valid ISO Alpha-2 codes
    try {
      getCountryCallingCode(code as CountryCode);
      return true;
    } catch {
      return false;
    }
  })
  .map(([code, name]) => ({
    label: `+${getCountryCallingCode(code as CountryCode)}`,
    value: `+${getCountryCallingCode(code as CountryCode)}`,
    code,
    name,
  }));

// ✅ Default selected country: Indonesia
const defaultCountry = countryOptions.find((c) => c.code === "ID")!;

export default function RegisterPage() {
  const [selectedCountry, setSelectedCountry] = useState(defaultCountry);
  const [countryCode, setCountryCode] = useState(defaultCountry.value);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: RegisterInput) => {
    const payload = {
      fullName: `${data.firstName} ${data.lastName}`,
      phoneNumber: `${countryCode} ${data.phoneNumber}`,
      country: selectedCountry?.name || "",
      email: data.email,
      password: data.password,
      about: data.about,
    };

    try {
      await axios.post("http://localhost:5000/api/auth/register", payload);
      toast.success("Registrasi berhasil! Silakan verifikasi email Anda.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Registrasi gagal");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-blue-100 px-4">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left illustration */}
        <div className="bg-[#C0F5A9] hidden md:flex items-center justify-center p-6">
          <Image
            src="/img/reg.png"
            alt="Register Illustration"
            width={500}
            height={500}
          />
        </div>

        {/* Right form */}
        <div className="p-8 flex flex-col justify-center">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="text-center mb-4">
              <h1 className="text-3xl font-bold text-black">Register</h1>
              <p className="text-gray-500 text-sm">
                Let's Sign up first for enter into MOOD.
              </p>
            </div>

            <div className="flex gap-2">
              <FloatingInput
                label="First Name"
                placeholder="First Name"
                className={errors.firstName ? "border-red-500" : ""}
                {...register("firstName")}
              />
              <FloatingInput
                label="Last Name"
                placeholder="Last Name"
                className={errors.lastName ? "border-red-500" : ""}
                {...register("lastName")}
              />
            </div>
            {errors.firstName && (
              <p className="text-red-500 text-sm">
                {errors.firstName.message}
              </p>
            )}
            {errors.lastName && (
              <p className="text-red-500 text-sm">
                {errors.lastName.message}
              </p>
            )}

            <div className="flex gap-2">
              {/* Country code */}
              <div className="w-1/2">
                <Select
                  options={countryOptions}
                  value={selectedCountry}
                  onChange={(val) => {
                    setSelectedCountry(val);
                    setCountryCode(val?.value ?? "+62");
                    setValue("country", val?.name ?? "Indonesia");
                  }}
                  placeholder="Code"
                  className="text-sm"
                  classNames={{
                    control: () =>
                      `!min-h-[3.3rem] !text-base ${
                        errors.country ? "border-red-500" : "border-gray-300"
                      }`,
                  }}
                  formatOptionLabel={(e: any) => (
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://flagcdn.com/w40/${e.code.toLowerCase()}.png`}
                        alt={e.name}
                        className="w-5 h-4 object-cover"
                      />
                      <span>{e.label}</span>
                    </div>
                  )}
                />
                {errors.country && (
                  <p className="text-red-500 text-sm">
                    {errors.country.message}
                  </p>
                )}
              </div>

              {/* Phone number */}
              <div className="w-full">
                <FloatingInput
                  label="Phone Number"
                  placeholder="812143xxxx"
                  className={errors.phoneNumber ? "border-red-500" : ""}
                  {...register("phoneNumber")}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </div>

            <FloatingInput
              label="Mail Address"
              placeholder="Email"
              className={errors.email ? "border-red-500" : ""}
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}

            <div className="flex gap-2">
              <div className="relative w-full">
                <FloatingInput
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={errors.password ? "border-red-500" : ""}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-blue-600"
                >
                  {showPassword ? "HIDE" : "SHOW"}
                </button>
              </div>

              <div className="relative w-full">
                <FloatingInput
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  className={errors.confirmPassword ? "border-red-500" : ""}
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-blue-600"
                >
                  {showConfirmPassword ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}

            <div>
              <label className="text-sm font-medium">
                Tell us about yourself
              </label>
              <Textarea
                placeholder="Hello my name..."
                {...register("about")}
                className={errors.about ? "border-red-500" : ""}
              />
            </div>

            <div className="flex justify-between gap-4">
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Register
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
