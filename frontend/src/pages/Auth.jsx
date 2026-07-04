import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Check,
  User,
  AlertCircle,
} from "lucide-react";
import { Input } from "../components/input";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  const location = useLocation();
  const initialMode = location.state?.mode || "login";
  const [mode, setMode] = useState(initialMode);
  const { updateUser } = useAuth();

  const navigate = useNavigate();

  const titles = {
    login: { heading: "Welcome back", sub: "Log in to your Pendekin account." },
    register: {
      heading: "Create your account",
      sub: "Start shortening links for free.",
    },
    forgot: {
      heading: "Reset your password",
      sub: "We'll email you a recovery link.",
    },
  };

  const { heading, sub } = titles[mode];
  return (
    <div className="font-sans">
      <nav className="mx-auto border-b border-black/10 sticky">
        <button
          className="text-secondary font-bold text-xl max-w-6xl px-6 h-14 flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          PENDEKIN
        </button>
      </nav>
      <main className="text-sm px-4 py-12 justify-center items-center min-h-screen flex flex-col">
        <div className="text-center">
          <h2 className="font-display text-2xl">{heading}</h2>
          <p>{sub}</p>
        </div>
        {mode === "register" && (
          <>
            <div className="bg-card border border-border rounded-2xl p-7 shadow-sm min-w-md my-8">
              <RegisterForm
                onSuccess={(userData) => {
                  const { id, name, email } = userData.data;
                  updateUser({ id, name, email });
                  navigate("/dashboard");
                }}
              />
            </div>
            <div>
              <p>
                Already have an account?{" "}
                <button
                  className="cursor-pointer text-primary font-bold"
                  onClick={() => setMode("login")}
                >
                  Login
                </button>
                .
              </p>
            </div>
          </>
        )}
        {mode === "forgot" && (
          <>
            <div className="bg-card border border-border rounded-2xl p-7 shadow-sm min-w-md my-8">
              <ForgotForm onBack={() => setMode("login")} />
            </div>
          </>
        )}
        {mode === "login" && (
          <>
            <div className="bg-card border border-border rounded-2xl p-7 shadow-sm min-w-md my-8">
              <LoginForm
                onSuccess={() => navigate("/dashboard")}
                onForgot={() => setMode("forgot")}
              />
            </div>
            <div>
              <p>
                Don't have an account?{" "}
                <button
                  className="cursor-pointer text-primary font-bold"
                  onClick={() => setMode("register")}
                >
                  Register
                </button>
                .
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// ── Shared field wrapper ─────────────────────────────────────────────────────

function Field({
  label,
  id,
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  suffix,
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`pl-10 h-11 ${suffix ? "pr-11" : ""} ${error ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {suffix}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1.5">
          <AlertCircle className="size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// ── Password field with show/hide ────────────────────────────────────────────

function PasswordField({
  label,
  id,
  placeholder,
  value,
  onChange,
  error,
  showStrength,
}) {
  const [visible, setVisible] = useState(false);

  const strength = (() => {
    if (!value) return 0;
    let s = 0;
    if (value.length >= 8) s++;
    if (/[A-Z]/.test(value)) s++;
    if (/[0-9]/.test(value)) s++;
    if (/[^A-Za-z0-9]/.test(value)) s++;
    return s;
  })();

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = [
    "",
    "bg-destructive",
    "bg-yellow-400",
    "bg-primary/70",
    "bg-green-500",
  ][strength];

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`pl-10 pr-11 h-11 ${error ? "border-destructive focus-visible:ring-destructive/30" : ""}`}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {showStrength && value && (
        <div className="flex items-center gap-2 mt-0.5">
          <div className="flex gap-1 flex-1">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : "bg-muted"}`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground w-10 text-right">
            {strengthLabel}
          </span>
        </div>
      )}
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1.5">
          <AlertCircle className="size-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// ── Login form ───────────────────────────────────────────────────────────────

function LoginForm({ onSuccess, onForgot }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!email) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email))
      e.email = "Enter a valid email address.";
    if (!password) e.password = "Password is required.";
    return e;
  };

  const { login } = useAuth();

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await login({ email, password });
      onSuccess();
    } catch (err) {
      const e = {};
      if (
        err.errors &&
        typeof err.errors === "object" &&
        Object.keys(err.errors).length
      ) {
        Object.assign(e, err.errors);
      } else {
        e.form = err.message || "Login failed";
      }
      setErrors(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {errors.form && (
        <div className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive flex items-start gap-2">
          <AlertCircle className="size-4 mt-0.5 shrink-0" />
          <span>{errors.form}</span>
        </div>
      )}
      <Field
        label="Email address"
        id="login-email"
        icon={Mail}
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={setEmail}
        error={errors.email}
      />

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="login-password"
            className="text-sm font-medium text-foreground"
          >
            Password
          </label>
          <button
            type="button"
            onClick={onForgot}
            className="text-xs text-secondary hover:text-secondary/80 underline underline-offset-2 transition-colors cursor-pointer"
          >
            Forgot password?
          </button>
        </div>
        <PasswordField
          label=""
          id="login-password"
          placeholder="Enter your password"
          value={password}
          onChange={setPassword}
          error={errors.password}
        />
      </div>

      {/* Remember me */}
      <label className="flex items-center gap-3 cursor-pointer select-none group">
        <button
          type="button"
          role="checkbox"
          aria-checked={remember}
          onClick={() => setRemember((r) => !r)}
          className={`size-5 rounded border-2 flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
            remember
              ? "bg-primary border-primary"
              : "border-border bg-card group-hover:border-primary/50"
          }`}
        >
          {remember && <Check className="size-3 text-white" strokeWidth={3} />}
        </button>
        <span className="text-sm text-muted-foreground">
          Remember me for{" "}
          <span className="text-foreground font-medium">14 days</span>
        </span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="mt-1 h-11 w-full rounded-xl bg-secondary hover:bg-secondary/90 disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
      >
        {loading ? (
          <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            Log in <ArrowRight className="size-4" />
          </>
        )}
      </button>
    </form>
  );
}

// ── Register form ────────────────────────────────────────────────────────────

function RegisterForm({ onSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Name is required.";
    if (!email) e.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email))
      e.email = "Enter a valid email address.";
    if (!password) e.password = "Password is required.";
    else if (password.length < 8)
      e.password = "Password must be at least 8 characters.";
    return e;
  };

  const { register } = useAuth();

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const user = await register({ name, email, password });
      setDone(true);
      setTimeout(() => {
        onSuccess(user);
      }, 2500);
    } catch (err) {
      const e = {};
      if (
        err.errors &&
        typeof err.errors === "object" &&
        Object.keys(err.errors).length
      ) {
        Object.assign(e, err.errors);
      } else {
        e.form = err.message || "Registration failed";
      }
      setErrors(e);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <div className="size-14 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
          <Check className="size-6 text-green-600" strokeWidth={2.5} />
        </div>
        <div>
          <p className="font-semibold text-foreground">Account created!</p>
          <p className="text-sm text-muted-foreground mt-1">
            Taking you to the dashboard…
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {errors.form && (
        <div className="mt-4 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive flex items-start gap-2">
          <AlertCircle className="size-4 mt-0.5 shrink-0" />
          <span>{errors.form}</span>
        </div>
      )}
      <Field
        label="Full name"
        id="reg-name"
        icon={User}
        placeholder="John Doe"
        value={name}
        onChange={setName}
        error={errors.name}
      />
      <Field
        label="Email address"
        id="reg-email"
        icon={Mail}
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={setEmail}
        error={errors.email}
      />
      <PasswordField
        label="Password"
        id="reg-password"
        placeholder="Min. 8 characters"
        value={password}
        onChange={setPassword}
        error={errors.password}
        showStrength
      />

      <p className="text-xs text-muted-foreground leading-relaxed -mt-1">
        By creating an account you agree to our{" "}
        <span className="text-secondary underline underline-offset-2 cursor-pointer">
          Terms of Service
        </span>{" "}
        and{" "}
        <span className="text-secondary underline underline-offset-2 cursor-pointer">
          Privacy Policy
        </span>
        .
      </p>

      <button
        type="submit"
        disabled={loading}
        className="h-11 w-full rounded-xl bg-secondary hover:bg-secondary/90 disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
      >
        {loading ? (
          <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            Create account <ArrowRight className="size-4" />
          </>
        )}
      </button>
    </form>
  );
}

// ── Forgot password form ─────────────────────────────────────────────────────

function ForgotForm({ onBack }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!email) {
      setError("Email is required.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 900);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="size-14 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
          <Mail className="size-6 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-foreground">Check your inbox</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-60">
            We sent a reset link to{" "}
            <span className="font-medium text-foreground">{email}</span>.
          </p>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-secondary hover:text-secondary/80 underline underline-offset-2 transition-colors mt-1 cursor-pointer"
        >
          Back to login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <p className="text-sm text-muted-foreground leading-relaxed -mt-1">
        Enter the email you signed up with and we'll send you a reset link.
      </p>
      <Field
        label="Email address"
        id="forgot-email"
        icon={Mail}
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={setEmail}
        error={error}
      />
      <button
        type="submit"
        disabled={loading}
        className="h-11 w-full rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
      >
        {loading ? (
          <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            Send reset link <ArrowRight className="size-4" />
          </>
        )}
      </button>
      <button
        type="button"
        onClick={onBack}
        className="text-sm text-muted-foreground hover:text-foreground transition-colors text-center cursor-pointer"
      >
        ← Back to login
      </button>
    </form>
  );
}
