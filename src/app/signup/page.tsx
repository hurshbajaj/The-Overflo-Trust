import { signUpAction } from "@/lib/actions";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function SignupPage({ searchParams }: Props) {
  const params = await searchParams;
  const passwordInvalid = params.error === "password";
  const emailExists = params.error === "email";
  const genericInvalid = params.error === "invalid";
  return (
    <section className="fade-in-up mx-auto w-full max-w-lg">
      <form action={signUpAction} className="panel fade-in-up space-y-4 p-6" style={{ animationDelay: "70ms" }}>
        <h1 className="fade-in-up text-3xl" style={{ animationDelay: "120ms" }}>Sign Up</h1>
        <input required name="fullName" placeholder="Full name" className="fade-in-up w-full rounded-xl border border-amber-900/20 bg-white p-2" style={{ animationDelay: "160ms" }} />
        <input
          required
          name="email"
          type="email"
          placeholder={emailExists ? "Email already exists" : "Email"}
          className={`fade-in-up w-full rounded-xl border bg-white p-2 ${emailExists ? "border-red-400" : "border-amber-900/20"}`}
          style={{ animationDelay: "190ms" }}
        />
        <input
          required
          name="password"
          type="password"
          placeholder={passwordInvalid ? "Password must be at least 8 characters" : "Password"}
          className={`fade-in-up w-full rounded-xl border bg-white p-2 ${passwordInvalid ? "border-red-400" : "border-amber-900/20"}`}
          style={{ animationDelay: "220ms" }}
        />
        {genericInvalid && <p className="fade-in-up text-sm text-red-600" style={{ animationDelay: "250ms" }}>Please check your details and try again.</p>}
        <select name="role" className="fade-in-up w-full rounded-xl border border-amber-900/20 bg-white p-2" style={{ animationDelay: "250ms" }}>
          <option value="CONSUMER">Consumer</option>
          <option value="STEWARD">Steward</option>
        </select>
        <input name="brandName" placeholder="Brand name (for Stewards)" className="fade-in-up w-full rounded-xl border border-amber-900/20 bg-white p-2" style={{ animationDelay: "280ms" }} />
        <input name="city" placeholder="City" className="fade-in-up w-full rounded-xl border border-amber-900/20 bg-white p-2" style={{ animationDelay: "310ms" }} />
        <input name="category" placeholder="Category" className="fade-in-up w-full rounded-xl border border-amber-900/20 bg-white p-2" style={{ animationDelay: "340ms" }} />
        <button className="btn-primary fade-in-up w-full" style={{ animationDelay: "370ms" }}>Create account</button>
      </form>
    </section>
  );
}
