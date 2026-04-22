import { signInAction } from "@/lib/actions";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const invalid = params.error === "invalid" || params.error === "auth";
  return (
    <section className="fade-in-up mx-auto w-full max-w-md">
      <form action={signInAction} className="panel fade-in-up space-y-4 p-6" style={{ animationDelay: "70ms" }}>
        <h1 className="fade-in-up text-3xl" style={{ animationDelay: "120ms" }}>Log In</h1>
        <input
          required
          name="email"
          type="email"
          placeholder={invalid ? "Invalid email or password" : "Email"}
          className={`fade-in-up w-full rounded-xl border bg-white p-2 ${invalid ? "border-red-400" : "border-amber-900/20"}`}
          style={{ animationDelay: "170ms" }}
        />
        <input
          required
          name="password"
          type="password"
          placeholder={invalid ? "Invalid email or password" : "Password"}
          className={`fade-in-up w-full rounded-xl border bg-white p-2 ${invalid ? "border-red-400" : "border-amber-900/20"}`}
          style={{ animationDelay: "210ms" }}
        />
        <button className="btn-primary fade-in-up w-full" style={{ animationDelay: "250ms" }}>Continue</button>
      </form>
    </section>
  );
}
