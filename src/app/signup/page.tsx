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
    <section className="mx-auto w-full max-w-lg">
      <form action={signUpAction} className="panel space-y-4 p-6">
        <h1 className="text-3xl">Sign Up</h1>
        <input required name="fullName" placeholder="Full name" className="w-full rounded-xl border border-amber-900/20 bg-white p-2" />
        <input
          required
          name="email"
          type="email"
          placeholder={emailExists ? "Email already exists" : "Email"}
          className={`w-full rounded-xl border bg-white p-2 ${emailExists ? "border-red-400" : "border-amber-900/20"}`}
        />
        <input
          required
          name="password"
          type="password"
          placeholder={passwordInvalid ? "Password must be at least 8 characters" : "Password"}
          className={`w-full rounded-xl border bg-white p-2 ${passwordInvalid ? "border-red-400" : "border-amber-900/20"}`}
        />
        {genericInvalid && <p className="text-sm text-red-600">Please check your details and try again.</p>}
        <select name="role" className="w-full rounded-xl border border-amber-900/20 bg-white p-2">
          <option value="CONSUMER">Consumer</option>
          <option value="STEWARD">Steward</option>
        </select>
        <input name="brandName" placeholder="Brand name (for Stewards)" className="w-full rounded-xl border border-amber-900/20 bg-white p-2" />
        <input name="city" placeholder="City" className="w-full rounded-xl border border-amber-900/20 bg-white p-2" />
        <input name="category" placeholder="Category" className="w-full rounded-xl border border-amber-900/20 bg-white p-2" />
        <button className="btn-primary w-full">Create account</button>
      </form>
    </section>
  );
}
