"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-bold tracking-tight text-slate-950"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-indigo-600 text-lg text-white">
              T
            </span>
            Turnero
          </Link>
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-950">
            Ingresá a tu cuenta
          </h1>
          <p className="mt-2 text-slate-600">
            Administrá tus turnos y configurá tu negocio.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="Ej. juanperez@gmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-600">
          ¿No tenés cuenta?{" "}
          <Link
            href="/registro"
            className="font-semibold text-indigo-600 hover:text-indigo-700 underline-offset-4 hover:underline"
          >
            Registrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
