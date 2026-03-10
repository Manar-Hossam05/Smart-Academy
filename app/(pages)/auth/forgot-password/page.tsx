"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { Field, SubmitButton, Alert } from "@/components/auth/FormFields";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);

    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: fd.get("email") }),
    });

    const data = await res.json();
    setPending(false);

    if (!res.ok) setError(data.error);
    else setSuccess(true);
  }

  if (success) {
    return (
      <AuthCard title="تم الإرسال" subtitle="راجع بريدك الإلكتروني">
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="w-16 h-16 rounded-full bg-[#00b4d8]/10 border border-[#00b4d8]/20 flex items-center justify-center">
            <Mail className="w-7 h-7 text-[#00b4d8]" />
          </div>
          <p className="text-slate-500 text-[14px] leading-relaxed">
            أرسلنا رابط إعادة تعيين كلمة المرور.
            <br />
            يرجى مراجعة بريدك الإلكتروني.
          </p>
          <p className="text-slate-400 text-[12px]">
            لم تستلم الرسالة؟ تحقق من مجلد الـ Spam
          </p>
          <Link
            href="/auth/login"
            className="text-[#00b4d8] font-medium text-[14px] hover:underline"
          >
            العودة لتسجيل الدخول
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="نسيت كلمة المرور؟"
      subtitle="أدخل بريدك وسنرسل لك رابط إعادة التعيين"
      footer={
        <Link
          href="/auth/login"
          className="text-[#00b4d8] font-medium hover:underline"
        >
          ← العودة لتسجيل الدخول
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" dir="rtl">
        {error && <Alert type="error" message={error} />}

        <Field
          label="البريد الإلكتروني"
          name="email"
          type="email"
          placeholder="example@email.com"
          required
          autoComplete="email"
        />

        <SubmitButton
          label="إرسال رابط إعادة التعيين"
          pendingLabel="جاري الإرسال..."
          pending={pending}
        />
      </form>
    </AuthCard>
  );
}
