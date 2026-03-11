"use client";

import { useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/app/hooks/useLanguage";
import { useRouter } from "next/navigation";
import {
  Users,
  BookOpen,
  Wallet,
  TrendingUp,
  LogOut,
  Search,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
  ShieldOff,
  Eye,
  X,
  Youtube,
  BarChart2,
  DollarSign,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────────

interface StatsData {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  recentUsers: RecentUser[];
  recentTransactions: RecentTx[];
}

interface RecentUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: string;
}

interface RecentTx {
  id: string;
  type: string;
  amount: number;
  description: string | null;
  createdAt: string;
  user: { fullName: string };
}

interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  balance: { amount: number } | null;
  _count: { enrollments: number };
}

interface Course {
  id: string;
  title: string;
  titleAr: string | null;
  description: string | null;
  descriptionAr: string | null;
  language: string;
  published: boolean;
  price: number;
  videoUrls: string[];
  createdAt: string;
  _count: { enrollments: number };
}

type Tab = "overview" | "users" | "courses";

// ── helpers ─────────────────────────────────────────────────────────────────────
function Toast({
  msg,
  onClose,
}: {
  msg: { type: "success" | "error"; text: string } | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [msg, onClose]);

  if (!msg) return null;
  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-[14px] font-medium transition-all ${msg.type === "success" ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-red-50 border border-red-200 text-red-700"}`}
    >
      {msg.type === "success" ? (
        <CheckCircle2 className="w-4 h-4" />
      ) : (
        <AlertCircle className="w-4 h-4" />
      )}
      {msg.text}
      <button onClick={onClose} className="ms-2 opacity-50 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

const inputCls =
  "w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 placeholder:text-slate-300 outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all";

// ══════════════════════════════════════════════════════════════════════════════
export function AdminDashboard({ currentUserId }: { currentUserId: string }) {
  const { t, isRTL } = useLanguage();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [toast, setToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showToast = (type: "success" | "error", text: string) =>
    setToast({ type, text });

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
  }

  const tabs: {
    key: Tab;
    labelEn: string;
    labelAr: string;
    Icon: React.ElementType;
  }[] = [
    {
      key: "overview",
      labelEn: "Overview",
      labelAr: "الرئيسية",
      Icon: BarChart2,
    },
    { key: "users", labelEn: "Users", labelAr: "المستخدمون", Icon: Users },
    { key: "courses", labelEn: "Courses", labelAr: "الكورسات", Icon: BookOpen },
  ];

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-[#f4f6f9]">
      <Toast msg={toast} onClose={() => setToast(null)} />

      {/* ── Header ── */}
      <div className="bg-[#0a2540] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_20%_50%,rgba(0,180,216,0.08),transparent)]" />
        <div className="max-w-7xl mx-auto px-6 py-6 relative z-10">
          <div
            className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <div className="w-9 h-9 rounded-xl bg-[#00b4d8]/20 border border-[#00b4d8]/30 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-[#00b4d8]" />
              </div>
              <div className={isRTL ? "text-right" : ""}>
                <div className="text-white font-bold text-[15px]">
                  Smart Academy
                </div>
                <div className="text-white/30 text-[11px]">
                  {t("Admin Dashboard", "لوحة التحكم")}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className={`flex items-center gap-2 text-white/40 hover:text-white text-[13px] transition-colors ${isRTL ? "flex-row-reverse" : ""}`}
            >
              <LogOut className="w-4 h-4" />
              {t("Logout", "خروج")}
            </button>
          </div>

          {/* tabs */}
          <div className={`flex gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all ${isRTL ? "flex-row-reverse" : ""} ${
                  activeTab === tab.key
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                <tab.Icon className="w-4 h-4" />
                {t(tab.labelEn, tab.labelAr)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === "overview" && <OverviewTab t={t} isRTL={isRTL} />}
        {activeTab === "users" && (
          <UsersTab
            t={t}
            isRTL={isRTL}
            currentUserId={currentUserId}
            showToast={showToast}
          />
        )}
        {activeTab === "courses" && (
          <CoursesTab t={t} isRTL={isRTL} showToast={showToast} />
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// OVERVIEW TAB
// ══════════════════════════════════════════════════════════════════════════════
function OverviewTab({
  t,
  isRTL,
}: {
  t: (en: string, ar: string) => string;
  isRTL: boolean;
}) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => {
        setStats(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (!stats)
    return (
      <p className="text-slate-400 text-center py-20">
        {t("Failed to load", "فشل التحميل")}
      </p>
    );

  const cards = [
    {
      Icon: Users,
      value: stats.totalUsers,
      labelEn: "Total Users",
      labelAr: "إجمالي المستخدمين",
      color: "#00b4d8",
    },
    {
      Icon: BookOpen,
      value: stats.totalCourses,
      labelEn: "Total Courses",
      labelAr: "إجمالي الكورسات",
      color: "#0096b4",
    },
    {
      Icon: TrendingUp,
      value: stats.totalEnrollments,
      labelEn: "Total Enrollments",
      labelAr: "إجمالي التسجيلات",
      color: "#10b981",
    },
    {
      Icon: DollarSign,
      value: `${stats.totalRevenue.toFixed(0)} EGP`,
      labelEn: "Total Revenue",
      labelAr: "إجمالي الإيرادات",
      color: "#e9c46a",
    },
  ];

  return (
    <div className="space-y-6">
      {/* stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ backgroundColor: `${c.color}18` }}
            >
              <c.Icon className="w-5 h-5" style={{ color: c.color }} />
            </div>
            <div className="font-serif text-[#0a2540] font-bold text-[26px] leading-none mb-1">
              {c.value}
            </div>
            <div className="text-slate-400 text-[12px]">
              {t(c.labelEn, c.labelAr)}
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* recent users */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h2 className="text-[#0a2540] font-bold text-[15px] mb-4">
            {t("Recent Users", "أحدث المستخدمين")}
          </h2>
          <div className="space-y-3">
            {stats.recentUsers.map((u) => (
              <div
                key={u.id}
                className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <div className="w-8 h-8 rounded-xl bg-[#00b4d8]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#00b4d8] font-bold text-[12px]">
                    {u.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className={`flex-1 min-w-0 ${isRTL ? "text-right" : ""}`}>
                  <div className="text-slate-700 text-[13px] font-medium truncate">
                    {u.fullName}
                  </div>
                  <div className="text-slate-400 text-[11px] truncate">
                    {u.email}
                  </div>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${u.role === "ADMIN" ? "bg-purple-50 text-purple-600 border border-purple-100" : "bg-slate-100 text-slate-500"}`}
                >
                  {u.role === "ADMIN"
                    ? t("Admin", "أدمن")
                    : t("Student", "طالب")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* recent transactions */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h2 className="text-[#0a2540] font-bold text-[15px] mb-4">
            {t("Recent Transactions", "أحدث المعاملات")}
          </h2>
          <div className="space-y-3">
            {stats.recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className={`flex items-center justify-between gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`flex items-center gap-3 min-w-0 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${tx.type === "CREDIT" ? "bg-emerald-50" : "bg-red-50"}`}
                  >
                    <TrendingUp
                      className={`w-4 h-4 ${tx.type === "CREDIT" ? "text-emerald-500" : "text-red-400 rotate-180"}`}
                    />
                  </div>
                  <div className={`min-w-0 ${isRTL ? "text-right" : ""}`}>
                    <div className="text-slate-700 text-[13px] font-medium truncate">
                      {tx.user.fullName}
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      {new Date(tx.createdAt).toLocaleDateString(
                        isRTL ? "ar-EG" : "en-US",
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className={`font-bold text-[14px] flex-shrink-0 ${tx.type === "CREDIT" ? "text-emerald-500" : "text-red-400"}`}
                >
                  {tx.type === "CREDIT" ? "+" : "-"}
                  {tx.amount} EGP
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// USERS TAB
// ══════════════════════════════════════════════════════════════════════════════
function UsersTab({
  t,
  isRTL,
  currentUserId,
  showToast,
}: {
  t: (en: string, ar: string) => string;
  isRTL: boolean;
  currentUserId: string;
  showToast: (type: "success" | "error", text: string) => void;
}) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [modalType, setModalType] = useState<
    "balance" | "deduct" | "role" | "password" | "delete" | null
  >(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const res = await fetch(
      `/api/admin/users?search=${encodeURIComponent(search)}&page=${page}`,
    );
    const data = await res.json();
    setUsers(data.data.users);
    setPages(data.data.pages);
    setTotal(data.data.total);
    setLoading(false);
  }, [search, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // debounce search
  useEffect(() => {
    setPage(1);
  }, [search]);

  function openModal(user: AdminUser, type: typeof modalType) {
    setSelectedUser(user);
    setModalType(type);
  }
  function closeModal() {
    setSelectedUser(null);
    setModalType(null);
  }

  async function toggleActive(user: AdminUser) {
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle_active" }),
    });
    if (res.ok) {
      showToast(
        "success",
        user.isActive
          ? t("User deactivated", "تم إيقاف المستخدم")
          : t("User activated", "تم تفعيل المستخدم"),
      );
      fetchUsers();
    } else showToast("error", t("Failed", "فشلت العملية"));
  }

  return (
    <div className="space-y-5">
      {/* search + count */}
      <div
        className={`flex items-center justify-between gap-4 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}
      >
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search
            className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 ${isRTL ? "right-3" : "left-3"}`}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t(
              "Search by name or email...",
              "ابحث بالاسم أو الإيميل...",
            )}
            className={`w-full bg-white border border-slate-200 rounded-xl py-2.5 text-[13px] text-slate-700 placeholder:text-slate-300 outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all ${isRTL ? "pr-9 pl-4" : "pl-9 pr-4"}`}
          />
        </div>
        <span className="text-slate-400 text-[13px]">
          {total} {t("users", "مستخدم")}
        </span>
      </div>

      {/* table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <Spinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-slate-100 bg-[#f8f9fc]">
                  {[
                    t("User", "المستخدم"),
                    t("Role", "الدور"),
                    t("Balance", "الرصيد"),
                    t("Courses", "الكورسات"),
                    t("Status", "الحالة"),
                    t("Actions", "الإجراءات"),
                  ].map((h, i) => (
                    <th
                      key={i}
                      className={`px-4 py-3 font-semibold text-slate-500 text-[11px] uppercase tracking-wider ${isRTL ? "text-right" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-[#f8f9fc] transition-colors"
                  >
                    {/* name + email + id */}
                    <td className="px-4 py-3">
                      <div
                        className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <div className="w-8 h-8 rounded-xl bg-[#00b4d8]/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-[#00b4d8] font-bold text-[12px]">
                            {user.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className={isRTL ? "text-right" : ""}>
                          <div className="text-slate-800 font-medium">
                            {user.fullName}
                          </div>
                          <div className="text-slate-400 text-[11px]">
                            {user.email}
                          </div>
                          <div className="font-mono text-slate-300 text-[10px] select-all">
                            {user.id.slice(0, 8).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* role */}
                    <td className="px-4 py-3">
                      <span
                        className={`text-[11px] px-2 py-1 rounded-full font-medium border ${user.role === "ADMIN" ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-slate-100 text-slate-500 border-slate-200"}`}
                      >
                        {user.role === "ADMIN"
                          ? t("Admin", "أدمن")
                          : t("Student", "طالب")}
                      </span>
                    </td>

                    {/* balance */}
                    <td className="px-4 py-3">
                      <span className="font-mono text-slate-700">
                        {(user.balance?.amount ?? 0).toFixed(0)} EGP
                      </span>
                    </td>

                    {/* courses */}
                    <td className="px-4 py-3">
                      <span className="text-slate-500">
                        {user._count.enrollments}
                      </span>
                    </td>

                    {/* status */}
                    <td className="px-4 py-3">
                      <span
                        className={`text-[11px] px-2 py-1 rounded-full font-medium border ${user.isActive ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-500 border-red-100"}`}
                      >
                        {user.isActive
                          ? t("Active", "نشط")
                          : t("Suspended", "موقوف")}
                      </span>
                    </td>

                    {/* actions */}
                    <td className="px-4 py-3">
                      <div
                        className={`flex items-center gap-1 flex-wrap ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        {/* add balance */}
                        <ActionBtn
                          Icon={Plus}
                          color="emerald"
                          title={t("Add Balance", "إضافة رصيد")}
                          onClick={() => openModal(user, "balance")}
                        />

                        {/* deduct balance */}
                        <ActionBtn
                          Icon={DollarSign}
                          color="amber"
                          title={t("Deduct Balance", "خصم رصيد")}
                          onClick={() => openModal(user, "deduct")}
                        />

                        {/* toggle active */}
                        {user.id !== currentUserId && (
                          <ActionBtn
                            Icon={user.isActive ? ToggleRight : ToggleLeft}
                            color={user.isActive ? "red" : "green"}
                            title={
                              user.isActive
                                ? t("Deactivate", "إيقاف")
                                : t("Activate", "تفعيل")
                            }
                            onClick={() => toggleActive(user)}
                          />
                        )}

                        {/* change role */}
                        {user.id !== currentUserId && (
                          <ActionBtn
                            Icon={
                              user.role === "ADMIN" ? ShieldOff : ShieldCheck
                            }
                            color="purple"
                            title={
                              user.role === "ADMIN"
                                ? t("Remove Admin", "إزالة صلاحيات")
                                : t("Make Admin", "ترقية لأدمن")
                            }
                            onClick={() => openModal(user, "role")}
                          />
                        )}

                        {/* reset password */}
                        <ActionBtn
                          Icon={Edit2}
                          color="blue"
                          title={t("Reset Password", "تغيير كلمة المرور")}
                          onClick={() => openModal(user, "password")}
                        />

                        {/* delete */}
                        {user.id !== currentUserId && (
                          <ActionBtn
                            Icon={Trash2}
                            color="red"
                            title={t("Delete", "حذف")}
                            onClick={() => openModal(user, "delete")}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* pagination */}
      {pages > 1 && (
        <div
          className={`flex items-center gap-2 justify-center ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center disabled:opacity-40 hover:border-[#00b4d8] transition-colors"
          >
            {isRTL ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
          <span className="text-slate-500 text-[13px]">
            {page} / {pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="w-8 h-8 rounded-xl border border-slate-200 bg-white flex items-center justify-center disabled:opacity-40 hover:border-[#00b4d8] transition-colors"
          >
            {isRTL ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      )}

      {/* modals */}
      {selectedUser && modalType === "balance" && (
        <BalanceModal
          user={selectedUser}
          action="add_balance"
          isRTL={isRTL}
          t={t}
          onClose={closeModal}
          onSuccess={() => {
            showToast("success", t("Balance added", "تم إضافة الرصيد"));
            fetchUsers();
            closeModal();
          }}
          onError={(e) => showToast("error", e)}
        />
      )}
      {selectedUser && modalType === "deduct" && (
        <BalanceModal
          user={selectedUser}
          action="deduct_balance"
          isRTL={isRTL}
          t={t}
          onClose={closeModal}
          onSuccess={() => {
            showToast("success", t("Balance deducted", "تم خصم الرصيد"));
            fetchUsers();
            closeModal();
          }}
          onError={(e) => showToast("error", e)}
        />
      )}
      {selectedUser && modalType === "role" && (
        <ConfirmModal
          isRTL={isRTL}
          title={
            selectedUser.role === "ADMIN"
              ? t("Remove Admin Role", "إزالة صلاحيات الأدمن")
              : t("Make Admin", "ترقية لأدمن")
          }
          message={
            selectedUser.role === "ADMIN"
              ? t(
                  `Remove admin privileges from ${selectedUser.fullName}?`,
                  `هل تريد إزالة صلاحيات الأدمن من ${selectedUser.fullName}؟`,
                )
              : t(
                  `Grant admin privileges to ${selectedUser.fullName}?`,
                  `هل تريد ترقية ${selectedUser.fullName} لأدمن؟`,
                )
          }
          confirmLabel={t("Confirm", "تأكيد")}
          confirmColor="purple"
          onClose={closeModal}
          onConfirm={async () => {
            const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "change_role",
                role: selectedUser.role === "ADMIN" ? "STUDENT" : "ADMIN",
              }),
            });
            const data = await res.json();
            if (res.ok) {
              showToast("success", t("Role updated", "تم تحديث الدور"));
              fetchUsers();
              closeModal();
            } else showToast("error", data.error);
          }}
        />
      )}
      {selectedUser && modalType === "password" && (
        <PasswordModal
          user={selectedUser}
          isRTL={isRTL}
          t={t}
          onClose={closeModal}
          onSuccess={() => {
            showToast("success", t("Password reset", "تم تغيير كلمة المرور"));
            closeModal();
          }}
          onError={(e) => showToast("error", e)}
        />
      )}
      {selectedUser && modalType === "delete" && (
        <ConfirmModal
          isRTL={isRTL}
          title={t("Delete User", "حذف المستخدم")}
          message={t(
            `Are you sure you want to delete ${selectedUser.fullName}? This action cannot be undone.`,
            `هل أنت متأكد من حذف ${selectedUser.fullName}؟ لا يمكن التراجع عن هذا الإجراء.`,
          )}
          confirmLabel={t("Delete", "حذف")}
          confirmColor="red"
          onClose={closeModal}
          onConfirm={async () => {
            const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
              method: "DELETE",
            });
            const data = await res.json();
            if (res.ok) {
              showToast("success", t("User deleted", "تم حذف المستخدم"));
              fetchUsers();
              closeModal();
            } else showToast("error", data.error);
          }}
        />
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// COURSES TAB
// ══════════════════════════════════════════════════════════════════════════════
function CoursesTab({
  t,
  isRTL,
  showToast,
}: {
  t: (en: string, ar: string) => string;
  isRTL: boolean;
  showToast: (type: "success" | "error", text: string) => void;
}) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editCourse, setEditCourse] = useState<Course | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/courses");
    const data = await res.json();
    setCourses(data.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  async function togglePublish(course: Course) {
    const res = await fetch(`/api/admin/courses/${course.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !course.published }),
    });
    if (res.ok) {
      showToast(
        "success",
        course.published
          ? t("Course unpublished", "تم إلغاء نشر الكورس")
          : t("Course published", "تم نشر الكورس"),
      );
      fetchCourses();
    } else showToast("error", t("Failed", "فشلت العملية"));
  }

  async function deleteCourse(id: string) {
    if (!confirm(t("Delete this course?", "هل تريد حذف هذا الكورس؟"))) return;
    const res = await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("success", t("Course deleted", "تم حذف الكورس"));
      fetchCourses();
    } else showToast("error", t("Failed", "فشلت العملية"));
  }

  return (
    <div className="space-y-5">
      <div
        className={`flex items-center justify-between ${isRTL ? "flex-row-reverse" : ""}`}
      >
        <h2 className="text-[#0a2540] font-bold text-[18px]">
          {t("Courses", "الكورسات")} ({courses.length})
        </h2>
        <button
          onClick={() => setShowAdd(true)}
          className={`flex items-center gap-2 bg-[#0a2540] hover:bg-[#0d3060] text-white font-semibold px-4 py-2.5 rounded-xl text-[13px] transition-all ${isRTL ? "flex-row-reverse" : ""}`}
        >
          <Plus className="w-4 h-4" />
          {t("Add Course", "إضافة كورس")}
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
              {/* color band */}
              <div
                className={`h-1 ${course.published ? "bg-gradient-to-r from-[#00b4d8] to-[#00b4d8]/40" : "bg-slate-200"}`}
              />
              <div className="p-5">
                <div
                  className={`flex items-start justify-between gap-2 mb-3 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#0a2540] font-bold text-[14px] truncate">
                      {isRTL && course.titleAr ? course.titleAr : course.title}
                    </h3>
                    {course.titleAr && !isRTL && (
                      <p className="text-slate-400 text-[12px] truncate">
                        {course.titleAr}
                      </p>
                    )}
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium border flex-shrink-0 ${course.published ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-100 text-slate-400 border-slate-200"}`}
                  >
                    {course.published
                      ? t("Published", "منشور")
                      : t("Draft", "مسودة")}
                  </span>
                </div>

                <div
                  className={`flex items-center gap-3 text-slate-400 text-[12px] mb-4 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <span
                    className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <Youtube className="w-3.5 h-3.5 text-red-400" />
                    {course.videoUrls.length} {t("videos", "فيديو")}
                  </span>
                  <span>•</span>
                  <span>
                    {course._count.enrollments} {t("enrolled", "مسجّل")}
                  </span>
                  <span>•</span>
                  <span>
                    {course.price === 0
                      ? t("Free", "مجاني")
                      : `${course.price} EGP`}
                  </span>
                </div>

                <div
                  className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <button
                    onClick={() => togglePublish(course)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-medium transition-all border ${course.published ? "bg-slate-50 text-slate-500 border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-100" : "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100"} ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    {course.published
                      ? t("Unpublish", "إلغاء النشر")
                      : t("Publish", "نشر")}
                  </button>
                  <button
                    onClick={() => setEditCourse(course)}
                    className="w-9 h-9 rounded-xl bg-[#f4f6f9] hover:bg-[#00b4d8]/10 text-slate-400 hover:text-[#00b4d8] flex items-center justify-center transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteCourse(course.id)}
                    className="w-9 h-9 rounded-xl bg-[#f4f6f9] hover:bg-red-50 text-slate-400 hover:text-red-500 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <CourseFormModal
          isRTL={isRTL}
          t={t}
          onClose={() => setShowAdd(false)}
          onSuccess={() => {
            showToast("success", t("Course added", "تم إضافة الكورس"));
            fetchCourses();
            setShowAdd(false);
          }}
          onError={(e) => showToast("error", e)}
        />
      )}

      {editCourse && (
        <CourseFormModal
          isRTL={isRTL}
          t={t}
          course={editCourse}
          onClose={() => setEditCourse(null)}
          onSuccess={() => {
            showToast("success", t("Course updated", "تم تحديث الكورس"));
            fetchCourses();
            setEditCourse(null);
          }}
          onError={(e) => showToast("error", e)}
        />
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MODALS
// ══════════════════════════════════════════════════════════════════════════════

function ModalWrapper({
  children,
  isRTL,
}: {
  children: React.ReactNode;
  isRTL: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <div className="h-1 bg-gradient-to-r from-[#00b4d8] via-[#00b4d8]/60 to-transparent" />
        <div className="p-7">{children}</div>
      </div>
    </div>
  );
}

// ── Balance Modal ──────────────────────────────────────────────────────────────
function BalanceModal({
  user,
  action,
  isRTL,
  t,
  onClose,
  onSuccess,
  onError,
}: {
  user: AdminUser;
  action: "add_balance" | "deduct_balance";
  isRTL: boolean;
  t: (en: string, ar: string) => string;
  onClose: () => void;
  onSuccess: () => void;
  onError: (e: string) => void;
}) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const isAdd = action === "add_balance";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, amount: parseFloat(amount), description }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) onSuccess();
    else onError(data.error);
  }

  return (
    <ModalWrapper isRTL={isRTL}>
      <div
        className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`}
      >
        <h3 className="text-[#0a2540] font-bold text-[18px]">
          {isAdd
            ? t("Add Balance", "إضافة رصيد")
            : t("Deduct Balance", "خصم رصيد")}
        </h3>
        <CloseBtn onClick={onClose} />
      </div>
      <div className="bg-[#f4f6f9] rounded-xl p-3 mb-5 text-[13px] text-slate-500">
        {t("User", "المستخدم")}:{" "}
        <strong className="text-slate-700">{user.fullName}</strong>
        {" · "}
        {t("Balance", "الرصيد")}:{" "}
        <strong className="text-[#00b4d8]">
          {(user.balance?.amount ?? 0).toFixed(2)} EGP
        </strong>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-700 text-[13px] font-medium">
            {t("Amount (EGP)", "المبلغ (جنيه)")}{" "}
            <span className="text-[#00b4d8]">*</span>
          </label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
            className={inputCls}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-700 text-[13px] font-medium">
            {t("Note (optional)", "ملاحظة (اختياري)")}
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={
              isAdd
                ? t("e.g. Payment received", "مثال: تم استلام الدفع")
                : t("e.g. Course deduction", "مثال: خصم كورس")
            }
            className={inputCls}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 font-semibold rounded-xl py-3.5 text-[15px] text-white transition-all disabled:opacity-60 ${isAdd ? "bg-emerald-500 hover:bg-emerald-600" : "bg-amber-500 hover:bg-amber-600"}`}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {isAdd
            ? t("Add Balance", "إضافة الرصيد")
            : t("Deduct Balance", "خصم الرصيد")}
        </button>
      </form>
    </ModalWrapper>
  );
}

// ── Password Modal ─────────────────────────────────────────────────────────────
function PasswordModal({
  user,
  isRTL,
  t,
  onClose,
  onSuccess,
  onError,
}: {
  user: AdminUser;
  isRTL: boolean;
  t: (en: string, ar: string) => string;
  onClose: () => void;
  onSuccess: () => void;
  onError: (e: string) => void;
}) {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reset_password", newPassword }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) onSuccess();
    else onError(data.error);
  }

  return (
    <ModalWrapper isRTL={isRTL}>
      <div
        className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`}
      >
        <h3 className="text-[#0a2540] font-bold text-[18px]">
          {t("Reset Password", "تغيير كلمة المرور")}
        </h3>
        <CloseBtn onClick={onClose} />
      </div>
      <div className="bg-[#f4f6f9] rounded-xl p-3 mb-5 text-[13px] text-slate-500">
        {t("User", "المستخدم")}:{" "}
        <strong className="text-slate-700">{user.fullName}</strong>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-700 text-[13px] font-medium">
            {t("New Password", "كلمة المرور الجديدة")}{" "}
            <span className="text-[#00b4d8]">*</span>
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t("At least 8 characters", "٨ أحرف على الأقل")}
            required
            minLength={8}
            className={inputCls}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-[#0a2540] hover:bg-[#0d3060] disabled:opacity-60 text-white font-semibold rounded-xl py-3.5 text-[15px] transition-all"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {t("Reset Password", "تعيين كلمة المرور")}
        </button>
      </form>
    </ModalWrapper>
  );
}

// ── Confirm Modal ──────────────────────────────────────────────────────────────
function ConfirmModal({
  isRTL,
  title,
  message,
  confirmLabel,
  confirmColor,
  onClose,
  onConfirm,
}: {
  isRTL: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmColor: "red" | "purple" | "emerald";
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const colorMap = {
    red: "bg-red-500 hover:bg-red-600",
    purple: "bg-purple-500 hover:bg-purple-600",
    emerald: "bg-emerald-500 hover:bg-emerald-600",
  };

  return (
    <ModalWrapper isRTL={isRTL}>
      <div
        className={`flex items-center justify-between mb-4 ${isRTL ? "flex-row-reverse" : ""}`}
      >
        <h3 className="text-[#0a2540] font-bold text-[18px]">{title}</h3>
        <CloseBtn onClick={onClose} />
      </div>
      <p className="text-slate-500 text-[14px] leading-relaxed mb-6">
        {message}
      </p>
      <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
        <button
          onClick={onClose}
          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl py-3 text-[14px] transition-all"
        >
          Cancel / إلغاء
        </button>
        <button
          onClick={async () => {
            setLoading(true);
            await onConfirm();
            setLoading(false);
          }}
          disabled={loading}
          className={`flex-1 flex items-center justify-center gap-2 ${colorMap[confirmColor]} disabled:opacity-60 text-white font-semibold rounded-xl py-3 text-[14px] transition-all`}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {confirmLabel}
        </button>
      </div>
    </ModalWrapper>
  );
}

// ── Course Form Modal ──────────────────────────────────────────────────────────
function CourseFormModal({
  isRTL,
  t,
  course,
  onClose,
  onSuccess,
  onError,
}: {
  isRTL: boolean;
  t: (en: string, ar: string) => string;
  course?: Course;
  onClose: () => void;
  onSuccess: () => void;
  onError: (e: string) => void;
}) {
  const isEdit = !!course;

  const [title, setTitle] = useState(course?.title ?? "");
  const [titleAr, setTitleAr] = useState(course?.titleAr ?? "");
  const [description, setDescription] = useState(course?.description ?? "");
  const [descriptionAr, setDescriptionAr] = useState(
    course?.descriptionAr ?? "",
  );
  const [price, setPrice] = useState(String(course?.price ?? 0));
  const [language, setLanguage] = useState(course?.language ?? "AR");
  const [videoUrls, setVideoUrls] = useState<string[]>(
    course?.videoUrls ?? [""],
  );
  const [loading, setLoading] = useState(false);

  function addVideo() {
    setVideoUrls((v) => [...v, ""]);
  }
  function removeVideo(i: number) {
    setVideoUrls((v) => v.filter((_, idx) => idx !== i));
  }
  function updateVideo(i: number, val: string) {
    setVideoUrls((v) => v.map((u, idx) => (idx === i ? val : u)));
  }

  // convert YouTube watch URL to embed URL
  function toEmbedUrl(url: string): string {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtu.be"))
        return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    } catch {}
    return url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const filtered = videoUrls.map(toEmbedUrl).filter((u) => u.trim() !== "");
    if (filtered.length === 0) {
      onError(t("Add at least one video", "أضف فيديو واحد على الأقل"));
      return;
    }

    setLoading(true);
    const body = {
      title,
      titleAr,
      description,
      descriptionAr,
      language,
      videoUrls: filtered,
      price: parseFloat(price) || 0,
    };

    const res = isEdit
      ? await fetch(`/api/admin/courses/${course!.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      : await fetch("/api/admin/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

    const data = await res.json();
    setLoading(false);
    if (res.ok) onSuccess();
    else onError(data.error);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        <div className="h-1 bg-gradient-to-r from-[#00b4d8] via-[#00b4d8]/60 to-transparent" />
        <div className="p-7">
          <div
            className={`flex items-center justify-between mb-6 ${isRTL ? "flex-row-reverse" : ""}`}
          >
            <h3 className="text-[#0a2540] font-bold text-[18px]">
              {isEdit
                ? t("Edit Course", "تعديل الكورس")
                : t("Add New Course", "إضافة كورس جديد")}
            </h3>
            <CloseBtn onClick={onClose} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* titles */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 text-[12px] font-medium">
                  {t("Title (EN)", "العنوان (EN)")}{" "}
                  <span className="text-[#00b4d8]">*</span>
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Course Title"
                  className={inputCls}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 text-[12px] font-medium">
                  {t("Title (AR)", "العنوان (AR)")}
                </label>
                <input
                  value={titleAr}
                  onChange={(e) => setTitleAr(e.target.value)}
                  placeholder="عنوان الكورس"
                  className={inputCls}
                  dir="rtl"
                />
              </div>
            </div>

            {/* descriptions */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 text-[12px] font-medium">
                  {t("Description (EN)", "الوصف (EN)")}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Course description..."
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 text-[12px] font-medium">
                  {t("Description (AR)", "الوصف (AR)")}
                </label>
                <textarea
                  value={descriptionAr}
                  onChange={(e) => setDescriptionAr(e.target.value)}
                  placeholder="وصف الكورس..."
                  rows={3}
                  className={`${inputCls} resize-none`}
                  dir="rtl"
                />
              </div>
            </div>

            {/* price + language */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 text-[12px] font-medium">
                  {t("Price (EGP)", "السعر (جنيه)")}
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  className={inputCls}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-700 text-[12px] font-medium">
                  {t("Language", "اللغة")}
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={inputCls}
                >
                  <option value="AR">{t("Arabic", "عربي")}</option>
                  <option value="EN">{t("English", "إنجليزي")}</option>
                  <option value="BOTH">{t("Both", "كلاهما")}</option>
                </select>
              </div>
            </div>

            {/* YouTube videos */}
            <div>
              <div
                className={`flex items-center justify-between mb-2 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <label className="text-slate-700 text-[13px] font-medium">
                  <span
                    className={`flex items-center gap-1.5 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <Youtube className="w-4 h-4 text-red-500" />
                    {t("YouTube Video Links", "روابط فيديوهات يوتيوب")}
                    <span className="text-[#00b4d8]">*</span>
                  </span>
                </label>
                <button
                  type="button"
                  onClick={addVideo}
                  className={`flex items-center gap-1 text-[#00b4d8] text-[12px] hover:underline ${isRTL ? "flex-row-reverse" : ""}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  {t("Add video", "إضافة فيديو")}
                </button>
              </div>
              <div className="space-y-2">
                {videoUrls.map((url, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <input
                      value={url}
                      onChange={(e) => updateVideo(i, e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className={`${inputCls} flex-1`}
                    />
                    {videoUrls.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVideo(i)}
                        className="w-9 h-9 flex-shrink-0 rounded-xl bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-slate-400 text-[11px] mt-2">
                {t(
                  "Supports: youtube.com/watch?v=... or youtu.be/... — videos will be embedded privately",
                  "يدعم: youtube.com/watch?v=... أو youtu.be/... — سيتم تضمين الفيديوهات بشكل خفي",
                )}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#0a2540] hover:bg-[#0d3060] disabled:opacity-60 text-white font-semibold rounded-xl py-3.5 text-[15px] transition-all"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isEdit
                ? t("Save Changes", "حفظ التغييرات")
                : t("Add Course", "إضافة الكورس")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ── Shared small components ────────────────────────────────────────────────────
function ActionBtn({
  Icon,
  color,
  title,
  onClick,
}: {
  Icon: React.ElementType;
  color: "emerald" | "amber" | "red" | "purple" | "blue" | "green";
  title: string;
  onClick: () => void;
}) {
  const map: Record<string, string> = {
    emerald: "hover:bg-emerald-50 hover:text-emerald-500",
    amber: "hover:bg-amber-50 hover:text-amber-500",
    red: "hover:bg-red-50 hover:text-red-500",
    purple: "hover:bg-purple-50 hover:text-purple-500",
    blue: "hover:bg-blue-50 hover:text-blue-500",
    green: "hover:bg-emerald-50 hover:text-emerald-500",
  };
  return (
    <button
      title={title}
      onClick={onClick}
      className={`w-7 h-7 rounded-lg bg-[#f4f6f9] text-slate-400 flex items-center justify-center transition-colors ${map[color]}`}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}

function CloseBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-300 hover:text-slate-500 transition-colors"
    >
      <X className="w-4 h-4" />
    </button>
  );
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-7 h-7 text-[#00b4d8] animate-spin" />
    </div>
  );
}
