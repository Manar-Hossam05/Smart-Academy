"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { Field, SubmitButton, Alert } from "@/components/auth/FormFields";
import { CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const password = fd.get("password") as string;
    const confirm = fd.get("confirm_password") as string;

    if (password !== confirm) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }

    setError(null);
    setPending(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: fd.get("email"),
        password,
        fullName: fd.get("full_name"),
        phone: fd.get("phone"),
      }),
    });

    const data = await res.json();
    setPending(false);

    if (!res.ok) setError(data.error);
    else setSuccess(true);
  }

  // ── Success state ──────────────────────────────────────────────────────
  if (success) {
    return (
      <AuthCard title="تحقق من بريدك" subtitle="أرسلنا إليك رابط التأكيد">
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <p className="text-slate-500 text-[14px] leading-relaxed">
            تم إرسال رابط التأكيد إلى بريدك الإلكتروني.
            <br />
            افتح الرسالة واضغط على الرابط لتفعيل حسابك.
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

  // ── Form ───────────────────────────────────────────────────────────────
  return (
    <AuthCard
      title="إنشاء حساب جديد"
      subtitle="انضم إلى Smart Academy وابدأ رحلتك التعليمية"
      footer={
        <span>
          لديك حساب بالفعل؟{" "}
          <Link
            href="/auth/login"
            className="text-[#00b4d8] font-medium hover:underline"
          >
            تسجيل الدخول
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" dir="rtl">
        {error && <Alert type="error" message={error} />}

        <Field
          label="الاسم الكامل"
          name="full_name"
          placeholder="أدخل اسمك الكامل"
          required
          autoComplete="name"
        />
        <Field
          label="البريد الإلكتروني"
          name="email"
          type="email"
          placeholder="example@email.com"
          required
          autoComplete="email"
        />
        <Field
          label="رقم الهاتف (اختياري)"
          name="phone"
          type="tel"
          placeholder="01xxxxxxxxx"
          autoComplete="tel"
        />
        <Field
          label="كلمة المرور"
          name="password"
          type="password"
          placeholder="٨ أحرف على الأقل"
          required
          autoComplete="new-password"
        />
        <Field
          label="تأكيد كلمة المرور"
          name="confirm_password"
          type="password"
          placeholder="أعد إدخال كلمة المرور"
          required
          autoComplete="new-password"
        />

        <p className="text-slate-400 text-[12px] leading-relaxed -mt-1">
          بإنشاء الحساب أنت توافق على{" "}
          <Link href="/terms" className="text-[#00b4d8] hover:underline">
            شروط الاستخدام
          </Link>{" "}
          و{" "}
          <Link href="/privacy" className="text-[#00b4d8] hover:underline">
            سياسة الخصوصية
          </Link>
        </p>

        <SubmitButton
          label="إنشاء الحساب"
          pendingLabel="جاري الإنشاء..."
          pending={pending}
        />
      </form>
    </AuthCard>
  );
}
