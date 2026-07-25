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

    await new Promise((resolve) => setTimeout(resolve, 1000));

    localStorage.setItem("turnero_user", JSON.stringify({ nombre, email }));

    toast.success("¡Cuenta creada correctamente!");
    setIsLoading(false);

    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-slate-200 p-4 w-full max-w-md space-y-8">
        {/* Encabezado */}
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
            Configurá tu negocio y empezá a recibir reservas.
          </p>
        </div>

        {/* Formulario */}
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

        {/* Pie de formulario */}
        <p className="text-center text-sm text-slate-600">
          ¿Ya tenés cuenta?{" "}
          <Link
            href="/ingresar"
            className="font-semibold text-indigo-600 hover:text-indigo-700 underline-offset-4 hover:underline"
          >
            Ingresá aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
