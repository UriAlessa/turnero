"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth/auth-shell";

export default function Ingresar() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      // NextAuth devuelve un objeto con 'error' si falla, en lugar de lanzar una excepción
      if (result?.error) {
        // Traducimos los códigos de error de NextAuth a español
        if (result.error === "CredentialsSignin") {
          throw new Error("Email o contraseña incorrectos");
        }
        if (result.error === "Configuration") {
          throw new Error("Error de configuración.");
        }
        throw new Error(result.error);
      }

      toast.success("¡Bienvenido de nuevo!");
      router.push("/dashboard");
      router.refresh();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Credenciales incorrectas";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <AuthShell
      eyebrow="Bienvenido de nuevo"
      title="Ingresá a tu cuenta"
      description="Administrá tus turnos, servicios y horarios desde tu panel."
      footer={<p>¿No tenés cuenta? <Link href="/registro" className="font-semibold text-indigo-600 underline-offset-4 hover:text-indigo-700 hover:underline">Creá una gratis</Link></p>}
    >
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="Ej. juanperez@gmail.com"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-xl bg-slate-50 px-4 focus-visible:border-indigo-500 focus-visible:ring-indigo-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              className="h-12 rounded-xl bg-slate-50 px-4 focus-visible:border-indigo-500 focus-visible:ring-indigo-100"
            />
          </div>

          <Button type="submit" size="lg" className="w-full bg-indigo-600 shadow-lg shadow-indigo-100 hover:bg-indigo-700" disabled={isLoading}>
            {isLoading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>
    </AuthShell>
  );
}
