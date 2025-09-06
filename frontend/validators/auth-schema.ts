import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty("Email wajib diisi")
    .email("Format email tidak valid"),

  password: z
    .string()
    .nonempty("Password wajib diisi")
    .min(6, "Password minimal 6 karakter")
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    firstName: z.string().nonempty("Nama depan wajib diisi"),
    lastName: z.string().nonempty("Nama belakang wajib diisi"),

    phoneNumber: z.string().nonempty("Nomor telepon tidak boleh kosong").min(8, "Nomor telepon tidak valid"),
    country: z.string().nonempty("Negara wajib dipilih"),

    email: z
      .string()
      .nonempty("Email wajib diisi")
      .email("Format email tidak valid"),

    password: z
      .string()
      .nonempty("Password wajib diisi")
      .min(6, "Password minimal 6 karakter")
      .max(32, "Password maksimal 32 karakter"),

    confirmPassword: z.string().nonempty("Konfirmasi password wajib diisi"),

    about: z.string().optional()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"]
  });

export type RegisterInput = z.infer<typeof registerSchema>;
