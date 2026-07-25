"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function Registro() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log({
      nombre,
      email,
      passwordLength: password.length,
    });
    toast.success("Cuenta creada correctamente");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-indigo-600"
        >
          ← Volver al inicio
        </Link>
        <div className="mb-8">
          <p className="text-sm font-semibold text-indigo-600">TURNERO</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
            Creá tu cuenta
          </h1>
          <p className="mt-2 text-slate-600">
            Después vas a poder configurar tu negocio y recibir reservas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-700"
              htmlFor="nombre"
            >
              Nombre completo
            </label>

            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              id="nombre"
              name="nombre"
              type="text"
              placeholder="Ej. Juan Pérez"
              required={true}
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-700"
              htmlFor="email"
            >
              Correo electrónico
            </label>

            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              id="email"
              name="email"
              type="email"
              placeholder="Ej. juanperez@gmail.com"
              required={true}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-medium text-slate-700"
              htmlFor="password"
            >
              Contraseña
            </label>

            <input
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              id="password"
              name="password"
              type="password"
              required={true}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            Crear cuenta
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          ¿Ya tenés cuenta?{" "}
          <a
            className="font-semibold text-indigo-600 hover:text-indigo-700"
            href="#"
          >
            Ingresá
          </a>
        </p>
      </section>
    </main>
  );
}
