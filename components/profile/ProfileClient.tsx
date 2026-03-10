"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/app/hooks/useLanguage";
import { useRouter } from "next/navigation";
import {
  User,
  BookOpen,
  Wallet,
  Clock,
  CheckCircle2,
  LogOut,
  Settings,
  ChevronRight,
  AlertCircle,
  TrendingUp,
  Award,
  Loader2,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Course {
  id: string;
  title: string;
  description: string | null;
  language: string;
}

interface Enrollment {
  id: string;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
  progress: number;
  enrolledAt: string;
  completedAt: string | null;
  course: Course;
}

interface Transaction {
  id: string;
  type: "CREDIT" | "DEBIT";
  amount: number;
  description: string | null;
  createdAt: string;
}

interface ProfileData {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: string;
  emailVerified: boolean;
  createdAt: string;
  balance: { amount: number } | null;
  enrollments: Enrollment[];
  transactions: Transaction[];
}

// ─── Tab type ──────────────────────────────────────────────────────────────────
type Tab = "overview" | "courses" | "balance" | "settings";

// ══════════════════════════════════════════════════════════════════════════════
export function ProfileClient() {
  const { t, isRTL } = useLanguage();
  const router = useRouter();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        setProfile(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00b4d8] animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#f4f6f9] flex items-center justify-center">
        <p className="text-slate-400">
          {t("Failed to load profile", "فشل تحميل الملف الشخصي")}
        </p>
      </div>
    );
  }

  const completedCount = profile.enrollments.filter(
    (e) => e.status === "COMPLETED",
  ).length;
  const activeCount = profile.enrollments.filter(
    (e) => e.status === "ACTIVE",
  ).length;
  const balance = profile.balance?.amount ?? 0;

  const tabs: {
    key: Tab;
    labelEn: string;
    labelAr: string;
    Icon: React.ElementType;
  }[] = [
    { key: "overview", labelEn: "Overview", labelAr: "نظرة عامة", Icon: User },
    {
      key: "courses",
      labelEn: "My Courses",
      labelAr: "كورساتي",
      Icon: BookOpen,
    },
    { key: "balance", labelEn: "Balance", labelAr: "الرصيد", Icon: Wallet },
    {
      key: "settings",
      labelEn: "Settings",
      labelAr: "الإعدادات",
      Icon: Settings,
    },
  ];

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-[#f4f6f9]">
      {/* ── Header ── */}
      <div className="bg-[#0a2540] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_20%_50%,rgba(0,180,216,0.1),transparent)]" />
        <div className="max-w-5xl mx-auto px-6 py-8 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <span className="text-white/40 text-[13px]">Smart Academy</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-white/50 hover:text-white text-[13px] transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {t("Logout", "تسجيل الخروج")}
            </button>
          </div>

          {/* avatar + name */}
          <div
            className={`flex items-center gap-5 mb-8 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <div className="w-16 h-16 rounded-2xl bg-[#00b4d8]/20 border border-[#00b4d8]/30 flex items-center justify-center flex-shrink-0">
              <span className="text-[#00b4d8] font-serif font-bold text-[26px]">
                {profile.fullName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-white text-[20px] font-bold">
                {profile.fullName}
              </h1>
              <p className="text-white/40 text-[13px]">{profile.email}</p>
              {!profile.emailVerified && (
                <span className="inline-flex items-center gap-1 text-amber-400 text-[11px] mt-1">
                  <AlertCircle className="w-3 h-3" />
                  {t("Email not verified", "البريد غير مفعّل")}
                </span>
              )}
            </div>
          </div>

          {/* tabs */}
          <div className={`flex gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                <tab.Icon className="w-4 h-4" />
                <span className="hidden sm:block">
                  {t(tab.labelEn, tab.labelAr)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* ════ OVERVIEW ════ */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  Icon: BookOpen,
                  value: profile.enrollments.length,
                  labelEn: "Total Courses",
                  labelAr: "إجمالي الكورسات",
                  color: "#00b4d8",
                },
                {
                  Icon: TrendingUp,
                  value: activeCount,
                  labelEn: "In Progress",
                  labelAr: "جاري التعلم",
                  color: "#0096b4",
                },
                {
                  Icon: Award,
                  value: completedCount,
                  labelEn: "Completed",
                  labelAr: "مكتمل",
                  color: "#10b981",
                },
                {
                  Icon: Wallet,
                  value: `${balance} EGP`,
                  labelEn: "Balance",
                  labelAr: "الرصيد",
                  color: "#e9c46a",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm"
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${s.color}18` }}
                  >
                    <s.Icon className="w-4 h-4" style={{ color: s.color }} />
                  </div>
                  <div className="font-serif text-[#0a2540] font-bold text-[22px] leading-none mb-1">
                    {s.value}
                  </div>
                  <div className="text-slate-400 text-[12px]">
                    {t(s.labelEn, s.labelAr)}
                  </div>
                </div>
              ))}
            </div>

            {/* personal info */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-[#0a2540] font-bold text-[16px] mb-5">
                {t("Personal Information", "البيانات الشخصية")}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    labelEn: "Full Name",
                    labelAr: "الاسم الكامل",
                    value: profile.fullName,
                  },
                  {
                    labelEn: "Email",
                    labelAr: "البريد الإلكتروني",
                    value: profile.email,
                  },
                  {
                    labelEn: "Phone",
                    labelAr: "رقم الهاتف",
                    value: profile.phone ?? t("Not provided", "غير محدد"),
                  },
                  {
                    labelEn: "Member since",
                    labelAr: "عضو منذ",
                    value: new Date(profile.createdAt).toLocaleDateString(
                      isRTL ? "ar-EG" : "en-US",
                      { year: "numeric", month: "long" },
                    ),
                  },
                ].map((item, i) => (
                  <div key={i} className="bg-[#f8f9fc] rounded-xl p-4">
                    <div className="text-slate-400 text-[11px] uppercase tracking-wider mb-1">
                      {t(item.labelEn, item.labelAr)}
                    </div>
                    <div className="text-slate-700 text-[14px] font-medium">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* recent courses */}
            {profile.enrollments.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <div
                  className={`flex items-center justify-between mb-5 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <h2 className="text-[#0a2540] font-bold text-[16px]">
                    {t("Recent Courses", "آخر الكورسات")}
                  </h2>
                  <button
                    onClick={() => setActiveTab("courses")}
                    className="text-[#00b4d8] text-[13px] hover:underline"
                  >
                    {t("View all", "عرض الكل")}
                  </button>
                </div>
                <div className="space-y-3">
                  {profile.enrollments.slice(0, 3).map((e) => (
                    <CourseCard key={e.id} enrollment={e} isRTL={isRTL} t={t} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ════ COURSES ════ */}
        {activeTab === "courses" && (
          <div className="space-y-4">
            <h2 className="text-[#0a2540] font-bold text-[18px]">
              {t("My Courses", "كورساتي")} ({profile.enrollments.length})
            </h2>
            {profile.enrollments.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                titleEn="No courses yet"
                titleAr="لا توجد كورسات بعد"
                subtitleEn="Browse our courses and start learning"
                subtitleAr="تصفح الكورسات وابدأ التعلم"
                t={t}
              />
            ) : (
              profile.enrollments.map((e) => (
                <CourseCard
                  key={e.id}
                  enrollment={e}
                  isRTL={isRTL}
                  t={t}
                  expanded
                />
              ))
            )}
          </div>
        )}

        {/* ════ BALANCE ════ */}
        {activeTab === "balance" && (
          <div className="space-y-6">
            {/* balance card */}
            <div className="bg-[#0a2540] rounded-3xl p-7 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00b4d8]/[0.1] rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="text-white/40 text-[13px] mb-2">
                  {t("Available Balance", "الرصيد المتاح")}
                </div>
                <div className="font-serif text-[#00b4d8] font-bold text-[42px] leading-none mb-1">
                  {balance.toFixed(2)}
                </div>
                <div className="text-white/30 text-[13px]">EGP</div>
              </div>
            </div>

            {/* transactions */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h2 className="text-[#0a2540] font-bold text-[16px] mb-5">
                {t("Transaction History", "سجل المعاملات")}
              </h2>
              {profile.transactions.length === 0 ? (
                <EmptyState
                  icon={Wallet}
                  titleEn="No transactions yet"
                  titleAr="لا توجد معاملات بعد"
                  subtitleEn="Your transaction history will appear here"
                  subtitleAr="سيظهر هنا سجل معاملاتك"
                  t={t}
                />
              ) : (
                <div className="space-y-3">
                  {profile.transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className={`flex items-center justify-between p-4 rounded-xl bg-[#f8f9fc] ${isRTL ? "flex-row-reverse" : ""}`}
                    >
                      <div
                        className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center ${tx.type === "CREDIT" ? "bg-emerald-50" : "bg-red-50"}`}
                        >
                          <TrendingUp
                            className={`w-4 h-4 ${tx.type === "CREDIT" ? "text-emerald-500" : "text-red-400 rotate-180"}`}
                          />
                        </div>
                        <div className={isRTL ? "text-right" : ""}>
                          <div className="text-slate-700 text-[14px] font-medium">
                            {tx.description ??
                              (tx.type === "CREDIT"
                                ? t("Credit", "إيداع")
                                : t("Debit", "خصم"))}
                          </div>
                          <div className="text-slate-400 text-[12px]">
                            {new Date(tx.createdAt).toLocaleDateString(
                              isRTL ? "ar-EG" : "en-US",
                            )}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`font-serif font-bold text-[16px] ${tx.type === "CREDIT" ? "text-emerald-500" : "text-red-400"}`}
                      >
                        {tx.type === "CREDIT" ? "+" : "-"}
                        {tx.amount.toFixed(2)} EGP
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ════ SETTINGS ════ */}
        {activeTab === "settings" && (
          <SettingsTab
            profile={profile}
            t={t}
            isRTL={isRTL}
            onUpdated={(updated) =>
              setProfile((p) => (p ? { ...p, ...updated } : p))
            }
          />
        )}
      </div>
    </div>
  );
}

// ─── CourseCard ────────────────────────────────────────────────────────────────
function CourseCard({
  enrollment,
  isRTL,
  t,
  expanded = false,
}: {
  enrollment: Enrollment;
  isRTL: boolean;
  t: (en: string, ar: string) => string;
  expanded?: boolean;
}) {
  const statusColor = {
    ACTIVE: "bg-blue-50 text-blue-600 border-blue-100",
    COMPLETED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    CANCELLED: "bg-slate-100 text-slate-400 border-slate-200",
  }[enrollment.status];

  const statusLabel = {
    ACTIVE: t("In Progress", "جاري"),
    COMPLETED: t("Completed", "مكتمل"),
    CANCELLED: t("Cancelled", "ملغي"),
  }[enrollment.status];

  return (
    <div className="bg-[#f8f9fc] rounded-2xl border border-slate-100 p-5">
      <div
        className={`flex items-start justify-between gap-4 ${isRTL ? "flex-row-reverse" : ""}`}
      >
        <div className="flex-1 min-w-0">
          <div
            className={`flex items-center gap-2 mb-1 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <h3 className="text-slate-800 font-semibold text-[14px] truncate">
              {enrollment.course.title}
            </h3>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${statusColor}`}
            >
              {statusLabel}
            </span>
          </div>
          {expanded && enrollment.course.description && (
            <p className="text-slate-400 text-[13px] leading-relaxed mb-3">
              {enrollment.course.description}
            </p>
          )}
          {/* progress bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#00b4d8] rounded-full transition-all"
                style={{ width: `${enrollment.progress}%` }}
              />
            </div>
            <span className="text-slate-400 text-[12px] flex-shrink-0">
              {enrollment.progress}%
            </span>
          </div>
        </div>
        <div
          className={`text-slate-300 flex-shrink-0 ${isRTL ? "rotate-180" : ""}`}
        >
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

// ─── EmptyState ────────────────────────────────────────────────────────────────
function EmptyState({
  icon: Icon,
  titleEn,
  titleAr,
  subtitleEn,
  subtitleAr,
  t,
}: {
  icon: React.ElementType;
  titleEn: string;
  titleAr: string;
  subtitleEn: string;
  subtitleAr: string;
  t: (en: string, ar: string) => string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
        <Icon className="w-6 h-6 text-slate-300" />
      </div>
      <p className="text-slate-500 font-medium text-[15px]">
        {t(titleEn, titleAr)}
      </p>
      <p className="text-slate-400 text-[13px]">{t(subtitleEn, subtitleAr)}</p>
    </div>
  );
}

// ─── SettingsTab ───────────────────────────────────────────────────────────────
function SettingsTab({
  profile,
  t,
  isRTL,
  onUpdated,
}: {
  profile: ProfileData;
  t: (en: string, ar: string) => string;
  isRTL: boolean;
  onUpdated: (data: Partial<ProfileData>) => void;
}) {
  const [fullName, setFullName] = useState(profile.fullName);
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [currPass, setCurrPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confPass, setConfPass] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, phone }),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      setMsg({
        type: "success",
        text: t("Saved successfully", "تم الحفظ بنجاح"),
      });
      onUpdated(data.data);
    } else setMsg({ type: "error", text: data.error });
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPass !== confPass) {
      setPwMsg({
        type: "error",
        text: t("Passwords do not match", "كلمتا المرور غير متطابقتين"),
      });
      return;
    }
    setPwSaving(true);
    setPwMsg(null);
    const res = await fetch("/api/profile/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: currPass, newPassword: newPass }),
    });
    const data = await res.json();
    setPwSaving(false);
    if (res.ok) {
      setPwMsg({
        type: "success",
        text: t("Password changed", "تم تغيير كلمة المرور"),
      });
      setCurrPass("");
      setNewPass("");
      setConfPass("");
    } else setPwMsg({ type: "error", text: data.error });
  }

  const inputCls =
    "w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 placeholder:text-slate-300 outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all";

  return (
    <div className="space-y-6">
      {/* Edit profile */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <h2 className="text-[#0a2540] font-bold text-[16px] mb-5">
          {t("Edit Profile", "تعديل البيانات")}
        </h2>
        <form onSubmit={saveProfile} className="space-y-4">
          {msg && (
            <div
              className={`flex items-center gap-2 rounded-xl px-4 py-3 text-[13px] ${msg.type === "success" ? "bg-emerald-50 border border-emerald-100 text-emerald-600" : "bg-red-50 border border-red-100 text-red-600"}`}
            >
              {msg.type === "success" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              {msg.text}
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-700 text-[13px] font-medium">
              {t("Full Name", "الاسم الكامل")}{" "}
              <span className="text-[#00b4d8]">*</span>
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-700 text-[13px] font-medium">
              {t("Phone", "رقم الهاتف")}
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01xxxxxxxxx"
              className={inputCls}
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-[#0a2540] hover:bg-[#0d3060] disabled:opacity-60 text-white font-semibold rounded-xl px-6 py-3 text-[14px] transition-all"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("Saving...", "جاري الحفظ...")}
              </>
            ) : (
              t("Save Changes", "حفظ التغييرات")
            )}
          </button>
        </form>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <h2 className="text-[#0a2540] font-bold text-[16px] mb-5">
          {t("Change Password", "تغيير كلمة المرور")}
        </h2>
        <form onSubmit={changePassword} className="space-y-4">
          {pwMsg && (
            <div
              className={`flex items-center gap-2 rounded-xl px-4 py-3 text-[13px] ${pwMsg.type === "success" ? "bg-emerald-50 border border-emerald-100 text-emerald-600" : "bg-red-50 border border-red-100 text-red-600"}`}
            >
              {pwMsg.type === "success" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              {pwMsg.text}
            </div>
          )}
          {[
            {
              label: t("Current Password", "كلمة المرور الحالية"),
              val: currPass,
              set: setCurrPass,
            },
            {
              label: t("New Password", "كلمة المرور الجديدة"),
              val: newPass,
              set: setNewPass,
            },
            {
              label: t("Confirm New Password", "تأكيد كلمة المرور الجديدة"),
              val: confPass,
              set: setConfPass,
            },
          ].map((f, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <label className="text-slate-700 text-[13px] font-medium">
                {f.label}
              </label>
              <input
                type="password"
                value={f.val}
                onChange={(e) => f.set(e.target.value)}
                required
                className={inputCls}
              />
            </div>
          ))}
          <button
            type="submit"
            disabled={pwSaving}
            className="flex items-center justify-center gap-2 bg-[#0a2540] hover:bg-[#0d3060] disabled:opacity-60 text-white font-semibold rounded-xl px-6 py-3 text-[14px] transition-all"
          >
            {pwSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("Saving...", "جاري الحفظ...")}
              </>
            ) : (
              t("Change Password", "تغيير كلمة المرور")
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
