import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useAuth } from "@/hooks/use-auth";
import { ArrowRight, Asterisk, Loader2, UserX } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

interface AuthProps {
  redirectAfterAuth?: string;
}

function resolveRedirectAfterAuth(
  returnTo: string | null,
  fallback = "/dashboard",
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
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top hairline bar */}
      <div className="border-b border-border">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-3">
            <Asterisk className="size-4" strokeWidth={1.5} />
            <span className="text-sm font-medium tracking-[0.18em]">MONO/LITH</span>
          </Link>
          <span className="font-label text-muted-foreground">Access</span>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="grid w-full max-w-4xl border border-border bg-card md:grid-cols-2">
          {/* Left panel — quiet statement */}
          <div className="hidden flex-col justify-between border-r border-border bg-mist/50 p-10 md:flex">
            <div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <span className="font-label">01</span>
                <span className="h-px w-8 bg-border" />
                <span className="font-label">Access</span>
              </div>
              <h1 className="mt-10 font-display text-4xl leading-[1.1] font-light tracking-tight">
                The studio<br />
                keeps its<br />
                <span className="italic">records quiet.</span>
              </h1>
            </div>
            <p className="text-[13px] leading-6 text-muted-foreground">
              One account for projects, scenes and drafts. Signed in with a
              code — nothing extra.
            </p>
          </div>

          {/* Right panel — the form */}
          <div className="p-8 sm:p-10">
            {step === "signIn" ? (
              <>
                <div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="font-label">02</span>
                    <span className="h-px w-8 bg-border" />
                    <span className="font-label">Sign in</span>
                  </div>
                  <h2 className="mt-6 font-display text-3xl font-light tracking-tight">
                    Enter your email
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    We&apos;ll send a six-digit code. No password, nothing extra.
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
                      className="h-11 rounded-none border-border bg-background focus-visible:ring-1 focus-visible:ring-foreground"
                      disabled={isLoading}
                      required
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="size-11 rounded-none border border-foreground bg-foreground text-primary-foreground hover:bg-foreground/85"
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
                    className="h-11 w-full rounded-none border-border bg-transparent hover:bg-muted hover:text-foreground"
                    onClick={handleGuestLogin}
                    disabled={isLoading}
                  >
                    <UserX className="mr-2 size-4" strokeWidth={1.5} />
                    Continue as guest
                  </Button>
                </form>
              </>
            ) : (
              <>
                <div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <span className="font-label">02</span>
                    <span className="h-px w-8 bg-border" />
                    <span className="font-label">Verify</span>
                  </div>
                  <h2 className="mt-6 font-display text-3xl font-light tracking-tight">
                    Check your email
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    A six-digit code is on its way to {step.email}.
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
                    <p className="mt-4 text-sm text-destructive text-center">{error}</p>
                  )}

                  <Button
                    type="submit"
                    className="mt-8 h-11 w-full rounded-none border border-foreground bg-foreground text-primary-foreground hover:bg-foreground/85"
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

            <div className="mt-10 border-t border-border pt-6 text-xs text-muted-foreground">
              By continuing you accept the studio&apos;s terms. Secured by{" "}
              <a
                href="https://freebuff.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-foreground"
              >
                freebuff.com
              </a>
            </div>
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
