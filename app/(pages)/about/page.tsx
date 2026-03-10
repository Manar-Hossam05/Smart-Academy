"use client";

import { useLanguage } from "@/app/hooks/useLanguage";
import { motion, Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] },
  }),
};

interface Stat {
  value: string;
  label: string;
}
interface Diploma {
  year: string;
  title: string;
  source: string;
}

export default function About() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  const arFont: React.CSSProperties = {
    fontFamily: '"Cairo", "Tajawal", system-ui, sans-serif',
  };
  const baseFont = isAr ? arFont : {};

  const stats: Stat[] = [
    { value: "2019", label: t("Professor since", "أستاذة منذ") },
    { value: "6", label: t("Book volumes", "أجزاء السلسلة") },
    { value: t("Editor", "محررة"), label: t("& Reviewer", "ومحكِّمة") },
    {
      value: t("Holistic", "شمولية"),
      label: t("Patient care", "رعاية المريض"),
    },
  ];

  const roles: string[] = [
    t(
      "Professor of Audio-Vestibular Medicine, Zagazig University — since 2019",
      "أستاذة طب السمع والاتزان، جامعة الزقازيق — منذ 2019",
    ),
    t(
      "Coordinator, Egyptian Board of Audio-Vestibular Medicine Training Program",
      "منسّقة برنامج تدريب البورد المصري لطب السمع والاتزان",
    ),
    t("IBCT-Certified Trainer", "مدربة معتمدة IBCT"),
    t("DHPE Fellow", "زمالة DHPE"),
    t(
      "Editor — Egyptian Journal of Otorhinolaryngology",
      "محررة — المجلة المصرية لطب الأنف والأذن والحنجرة",
    ),
    t(
      "Reviewer for national & international journals",
      "محكِّمة علمية لدوريات محلية ودولية",
    ),
  ];

  const diplomas: Diploma[] = [
    {
      year: "2015",
      title: t("Childhood Psychiatry", "طب نفسية الأطفال"),
      source: "British Phoenix Academy",
    },
    {
      year: "2016",
      title: t("Therapeutic Nutrition", "التغذية العلاجية"),
      source: "British Phoenix Academy",
    },
  ];

  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className="min-h-screen flex flex-col bg-[#f8f9fc] dark:bg-[#06101f]"
      style={baseFont}
    >
      <main className="flex-1 w-full max-w-3xl mx-auto px-8 py-28 space-y-24">
        {/* ══ INTRO ══════════════════════════════════════════════ */}
        <section className="space-y-6">
          {/* label — يبدأ من بداية السطر دايمًا (start = يمين عربي / يسار إنجليزي) */}
          <motion.span
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="block text-xs font-bold tracking-[0.2em] uppercase text-[#00b4d8] text-start"
          >
            Smart Academy
          </motion.span>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-5xl md:text-6xl font-bold text-[#0a2540] dark:text-white text-start"
            style={{
              fontFamily: isAr
                ? '"Cairo","Tajawal",system-ui,sans-serif'
                : '"Playfair Display",Georgia,serif',
              lineHeight: isAr ? 1.6 : 1.15,
            }}
          >
            {t("About", "عن")}{" "}
            <span className="text-[#00b4d8]">
              {t("Prof. Dr. Ebtessam Nada", "أ.د. ابتسام ندى")}
            </span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-[#64748b] dark:text-[#94a3b8] text-xl text-start"
            style={{ ...baseFont, lineHeight: isAr ? 2.1 : 1.75 }}
          >
            {t(
              "Professor of Audio-Vestibular Medicine at Zagazig University, Egypt. Founder of Audiology Step by Step — a leading educational platform supporting clinicians and trainees across the region.",
              'أستاذة طب السمع والاتزان بجامعة الزقازيق، مصر. مؤسِّسة منصة "Audiology Step by Step" التعليمية الرائدة لدعم الأطباء والمتدربين في المنطقة.',
            )}
          </motion.p>
        </section>

        {/* ══ STATS ══════════════════════════════════════════════ */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 rounded-2xl overflow-hidden
                     border border-[#e2e8f0] dark:border-white/10"
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={fadeUp}
              className="bg-white dark:bg-[#0d1f35] py-8 px-4
                         flex flex-col items-center gap-2 text-center
                         border-e border-b md:border-b-0
                         border-[#e2e8f0] dark:border-white/10
                         last:border-e-0"
            >
              <span className="text-2xl font-bold text-[#0a2540] dark:text-white">
                {s.value}
              </span>
              <span
                className="text-sm text-[#94a3b8] leading-snug"
                style={baseFont}
              >
                {s.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <hr className="border-[#e2e8f0] dark:border-white/10" />

        {/* ══ ROLES ══════════════════════════════════════════════ */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-8"
        >
          <motion.span
            custom={0}
            variants={fadeUp}
            className="block text-xs font-bold tracking-[0.2em] uppercase text-[#00b4d8] text-start"
          >
            {t("Positions & Roles", "المناصب والأدوار")}
          </motion.span>

          <ul className="space-y-5">
            {roles.map((role, i) => (
              <motion.li
                key={i}
                custom={i}
                variants={fadeUp}
                className="flex items-start gap-4"
              >
                {/* النقطة بتكون أول حاجة — وبسبب dir="rtl" هتظهر على اليمين تلقائيًا */}
                <span className="mt-[11px] w-1.5 h-1.5 rounded-full bg-[#00b4d8] flex-shrink-0" />
                <span
                  className="text-[#334155] dark:text-white/80 text-lg text-start"
                  style={{ ...baseFont, lineHeight: isAr ? 2 : 1.75 }}
                >
                  {role}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <hr className="border-[#e2e8f0] dark:border-white/10" />

        {/* ══ PUBLICATIONS ═══════════════════════════════════════ */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-8"
        >
          <motion.span
            custom={0}
            variants={fadeUp}
            className="block text-xs font-bold tracking-[0.2em] uppercase text-[#00b4d8] text-start"
          >
            {t("Publications", "الإصدارات")}
          </motion.span>

          <motion.div
            custom={1}
            variants={fadeUp}
            className="flex items-center gap-8
                       bg-white dark:bg-[#0d1f35]
                       border border-[#e2e8f0] dark:border-white/10
                       rounded-2xl px-8 py-7"
          >
            {/* الرقم 6 على الجانب الخارجي دائمًا */}
            <span
              className="text-[72px] font-black leading-none select-none
                             text-[#e2e8f0] dark:text-white/10 tabular-nums flex-shrink-0"
            >
              6
            </span>
            <div className="space-y-2 text-start">
              <p className="font-bold text-[#0a2540] dark:text-white text-xl">
                Audiology Step by Step
              </p>
              <p
                className="text-[#64748b] dark:text-[#94a3b8] text-base"
                style={{ ...baseFont, lineHeight: isAr ? 2 : 1.75 }}
              >
                {t(
                  "Six volumes covering clinical audiology, vestibular assessment, hearing aids, cochlear implants, and more.",
                  "ستة أجزاء تغطي السمعيات الإكلينيكية، تقييم الاتزان، السماعات الطبية، زراعة القوقعة وغيرها.",
                )}
              </p>
            </div>
          </motion.div>
        </motion.div>

        <hr className="border-[#e2e8f0] dark:border-white/10" />

        {/* ══ BEYOND AUDIOLOGY ═══════════════════════════════════ */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-8"
        >
          <motion.span
            custom={0}
            variants={fadeUp}
            className="block text-xs font-bold tracking-[0.2em] uppercase text-[#00b4d8] text-start"
          >
            {t("Beyond Audiology", "ما وراء السمعيات")}
          </motion.span>

          <motion.p
            custom={1}
            variants={fadeUp}
            className="text-[#64748b] dark:text-[#94a3b8] text-lg text-start"
            style={{ ...baseFont, lineHeight: isAr ? 2 : 1.75 }}
          >
            {t(
              "Believing in a holistic view of patient health — the interplay between neurological, psychological, nutritional, and sensory systems.",
              "تتبنى رؤية شمولية لصحة المريض تُراعي تداخل العوامل العصبية والنفسية والتغذوية والحسية.",
            )}
          </motion.p>

          <div className="grid sm:grid-cols-2 gap-4">
            {diplomas.map((d, i) => (
              <motion.div
                key={i}
                custom={i + 2}
                variants={fadeUp}
                className="bg-white dark:bg-[#0d1f35]
                           border border-[#e2e8f0] dark:border-white/10
                           rounded-2xl px-7 py-6 space-y-2 text-start"
              >
                <span className="block text-[#00b4d8] font-bold text-base tabular-nums">
                  {d.year}
                </span>
                <p
                  className="text-[#0a2540] dark:text-white font-semibold text-lg"
                  style={baseFont}
                >
                  {d.title}
                </p>
                <p className="text-[#94a3b8] text-sm">{d.source}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
