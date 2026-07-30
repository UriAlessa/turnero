"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nombre,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear cuenta");
      }

      toast.success("¡Cuenta creada! Ahora podés iniciar sesión");
      router.push("/ingresar");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al crear cuenta";
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
            Creá tu cuenta
          </h1>
          <p className="mt-2 text-slate-600">
            Después vas a poder configurar tu negocio y recibir reservas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre completo</Label>
            <Input
              id="nombre"
              type="text"
              placeholder="Ej. Juan Pérez"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

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
            {isLoading ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </form>

        <p className="text-center text-sm text-slate-600">
          ¿Ya tenés cuenta?{" "}
          <Link
            href="/ingresar"
            className="font-semibold text-indigo-600 hover:text-indigo-700 underline-offset-4 hover:underline"
          >
            Ingresá
          </Link>
        </p>
      </div>
    </div>
  );
}
