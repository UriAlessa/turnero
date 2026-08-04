"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth/auth-shell";

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
    <AuthShell
      eyebrow="Empezá hoy"
      title="Creá tu cuenta"
      description="Configurá tu negocio y empezá a recibir reservas en pocos minutos."
      footer={<p>¿Ya tenés cuenta? <Link href="/ingresar" className="font-semibold text-indigo-600 underline-offset-4 hover:text-indigo-700 hover:underline">Ingresá a tu panel</Link></p>}
    >
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre completo</Label>
            <Input
              id="nombre"
              type="text"
              placeholder="Ej. Juan Pérez"
              required
              minLength={2}
              maxLength={100}
              autoComplete="name"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="h-12 rounded-xl bg-slate-50 px-4 focus-visible:border-indigo-500 focus-visible:ring-indigo-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="Ej. juanperez@gmail.com"
              required
              maxLength={254}
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
              minLength={8}
              maxLength={72}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              className="h-12 rounded-xl bg-slate-50 px-4 focus-visible:border-indigo-500 focus-visible:ring-indigo-100"
            />
            <p className="text-xs text-slate-500">Usá entre 8 y 72 caracteres.</p>
          </div>

          <Button type="submit" size="lg" className="w-full bg-indigo-600 shadow-lg shadow-indigo-100 hover:bg-indigo-700" disabled={isLoading}>
            {isLoading ? "Creando cuenta..." : "Crear cuenta"}
          </Button>
        </form>
    </AuthShell>
  );
}
