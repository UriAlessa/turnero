"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import Link from "next/link";
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

    await new Promise((resolve) => setTimeout(resolve, 1000));

    localStorage.setItem("turnero_user", JSON.stringify({ email }));

    toast.success("¡Ingresaste a tu cuenta!");
    setIsLoading(false);

    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-slate-200 p-4 w-full max-w-md space-y-8">
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
            Continuá gestionando tus turnos.
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
            {isLoading ? "Ingresando a tu cuenta..." : "Ingresar"}
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
