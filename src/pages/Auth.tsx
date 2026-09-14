import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Loader2, Sparkles, UserX } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

interface AuthProps {
  redirectAfterAuth?: string;
}

function resolveRedirectAfterAuth(
  returnTo: string | null,
  fallback = "/account",
) {
  if (returnTo?.startsWith("/") && !returnTo.startsWith("//")) {
    return returnTo;
  }
  return fallback;
}

function Auth({ redirectAfterAuth }: AuthProps = {}) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = resolveRedirectAfterAuth(
    searchParams.get("returnTo"),
    redirectAfterAuth,
  );
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate(redirect);
    }
  }, [authLoading, isAuthenticated, navigate, redirect]);

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      setStep({ email: formData.get("email") as string });
      setIsLoading(false);
    } catch (error) {
      console.error("Email sign-in error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to send verification code. Please try again.",
      );
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData(event.currentTarget);
      await signIn("email-otp", formData);
      navigate(redirect);
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("The verification code you entered is incorrect.");
      setIsLoading(false);
      setOtp("");
    }
  };

  const handleGuestLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("anonymous");
      navigate(redirect);
    } catch (error) {
      console.error("Guest login error:", error);
      setError(
        `Failed to sign in as guest: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      {/* Aurora field */}
      <div className="bg-nova-aurora pointer-events-none absolute inset-0" />
      <div className="grain pointer-events-none absolute inset-0" />

      {/* Top bar */}
      <div className="relative border-b border-white/5">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <svg viewBox="0 0 32 32" className="size-5" fill="none" aria-hidden="true">
              <path d="M16 1.5 30.5 27H1.5L16 1.5Z" stroke="url(#au-g)" strokeWidth="1.75" strokeLinejoin="round" />
              <path d="M16 11.5 23 24H9l7-12.5Z" fill="url(#au-g)" fillOpacity="0.9" />
              <defs>
                <linearGradient id="au-g" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7C8CFF" />
                  <stop offset="0.55" stopColor="#9F6BFF" />
                  <stop offset="1" stopColor="#F0509B" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-sm font-semibold tracking-[0.34em]">NOVA</span>
          </Link>
          <span className="font-label text-muted-foreground">Membership</span>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-6 py-16">
        <div className="grid w-full max-w-4xl overflow-hidden rounded-lg border border-white/10 bg-card card-sheen md:grid-cols-2">
          {/* Left panel — brand statement */}
          <div className="bg-nova-gradient relative hidden flex-col justify-between p-10 md:flex">
            <div className="grain absolute inset-0" />
            <div className="relative">
              <div className="flex items-center gap-3 text-white/60">
                <Sparkles className="size-4 text-electric" />
                <span className="font-label">FW26 — Orbit</span>
              </div>
              <h1 className="mt-10 text-4xl leading-[1.08] font-semibold tracking-tight text-white">
                Designed for the<br />
                <span className="text-nova-gradient">next generation.</span>
              </h1>
              <ul className="mt-10 space-y-3 text-sm text-white/70">
                {[
                  "First access to every release",
                  "Free returns, always",
                  "First refusal on limited runs",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="size-1 bg-electric" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="relative font-label text-[10px] text-white/40">
              Light, geometry, intent.
            </p>
          </div>

          {/* Right panel — the form */}
          <div className="relative p-8 sm:p-10">
            {step === "signIn" ? (
              <>
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight">
                    {searchParams.get("mode") === "signup" ? "Create your account" : "Welcome back"}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Enter your email and we'll send a six-digit code to sign
                    you in — no password required.
                  </p>
                </div>
                <form onSubmit={handleEmailSubmit} className="mt-10">
                  <label className="font-label text-muted-foreground" htmlFor="email">
                    Email
                  </label>
                  <div className="mt-2 flex items-center gap-2">
                    <Input
                      id="email"
                      name="email"
                      placeholder="name@example.com"
                      type="email"
                      className="h-11 rounded-md border-border bg-background focus-visible:ring-electric/50"
                      disabled={isLoading}
                      required
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="size-11 shrink-0 rounded-md bg-electric text-[#0B0B10] hover:bg-electric/90"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <ArrowRight className="size-4" />
                      )}
                    </Button>
                  </div>
                  {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

                  <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-card px-3 font-label text-muted-foreground">or</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-full rounded-md border-border bg-transparent hover:bg-foreground/5 hover:text-foreground"
                    onClick={handleGuestLogin}
                    disabled={isLoading}
                  >
                    <UserX className="mr-2 size-4" strokeWidth={1.5} />
                    Continue as guest
                  </Button>
                </form>
                <p className="mt-8 border-t border-border pt-6 text-xs leading-5 text-muted-foreground">
                  By continuing you agree to the NOVA terms of sale and privacy
                  policy. One account covers the shop, orders and your
                  wishlist.
                </p>
              </>
            ) : (
              <>
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight">Check your email</h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    A six-digit code is on its way to {step.email}. It expires
                    in ten minutes.
                  </p>
                </div>
                <form onSubmit={handleOtpSubmit} className="mt-10">
                  <input type="hidden" name="email" value={step.email} />
                  <input type="hidden" name="code" value={otp} />

                  <label className="font-label text-muted-foreground">Code</label>
                  <div className="mt-3 flex justify-center">
                    <InputOTP
                      value={otp}
                      onChange={setOtp}
                      maxLength={6}
                      disabled={isLoading}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && otp.length === 6 && !isLoading) {
                          const form = (e.target as HTMLElement).closest("form");
                          if (form) form.requestSubmit();
                        }
                      }}
                    >
                      <InputOTPGroup>
                        {Array.from({ length: 6 }).map((_, index) => (
                          <InputOTPSlot key={index} index={index} />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  {error && (
                    <p className="mt-4 text-center text-sm text-destructive">{error}</p>
                  )}

                  <Button
                    type="submit"
                    className="mt-8 h-11 w-full rounded-md bg-electric text-[#0B0B10] hover:bg-electric/90"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Verifying…
                      </>
                    ) : (
                      <>
                        Verify code
                        <ArrowRight className="ml-2 size-4" />
                      </>
                    )}
                  </Button>
                  <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => setStep("signIn")}
                    >
                      Use a different email
                    </Button>
                    <Button
                      type="button"
                      variant="link"
                      className="h-auto p-0 text-muted-foreground hover:text-foreground"
                      onClick={() => setStep("signIn")}
                    >
                      Resend
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage(props: AuthProps) {
  return (
    <Suspense>
      <Auth {...props} />
    </Suspense>
  );
}
