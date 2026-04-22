import { signInAction } from "@/lib/actions";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const invalid = params.error === "invalid" || params.error === "auth";
  return (
    <section className="mx-auto w-full max-w-md">
      <form action={signInAction} className="panel space-y-4 p-6">
        <h1 className="text-3xl">Log In</h1>
        <input
          required
          name="email"
          type="email"
          placeholder={invalid ? "Invalid email or password" : "Email"}
          className={`w-full rounded-xl border bg-white p-2 ${invalid ? "border-red-400" : "border-amber-900/20"}`}
        />
        <input
          required
          name="password"
          type="password"
          placeholder={invalid ? "Invalid email or password" : "Password"}
          className={`w-full rounded-xl border bg-white p-2 ${invalid ? "border-red-400" : "border-amber-900/20"}`}
        />
        <button className="btn-primary w-full">Continue</button>
      </form>
    </section>
  );
}
