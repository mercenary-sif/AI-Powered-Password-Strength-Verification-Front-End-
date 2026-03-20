<script setup>
import { ref, computed, watch, nextTick } from "vue"
import { gsap } from "gsap"
import {
  ShieldCheckIcon,
  ShieldExclamationIcon,
  XCircleIcon,
  CheckCircleIcon,
  LightBulbIcon,
  ChartBarIcon,
  KeyIcon,
} from "@heroicons/vue/24/outline"

const props = defineProps({
  result: { type: Object, default: null },
})

const emit = defineEmits(["reset"])

const strengthConfig = computed(() => {
  const s = props.result?.strength
  return {
    weak:   { label: "WEAK",   color: "#ef4444", glow: "shadow-red-500/30",    ring: "border-red-500/40",    bg: "bg-red-500/5",    text: "text-red-400",    icon: XCircleIcon,           message: "This password is highly vulnerable. Attackers can crack it instantly." },
    medium: { label: "MEDIUM", color: "#f59e0b", glow: "shadow-yellow-500/30", ring: "border-yellow-500/40", bg: "bg-yellow-500/5", text: "text-yellow-400", icon: ShieldExclamationIcon,  message: "Moderate protection — you're close to Strong. A few tweaks and you're there." },
    strong: { label: "STRONG", color: "#48EDF9", glow: "shadow-cyan-500/30",   ring: "border-cyan-500/40",   bg: "bg-cyan-500/5",   text: "text-[#48EDF9]",  icon: ShieldCheckIcon,        message: "Excellent password. High entropy and no known attack patterns detected." },
  }[s] ?? { label: "—", color: "#64748b", glow: "", ring: "", bg: "", text: "text-slate-400", icon: ShieldCheckIcon, message: "" }
})

const charBars = computed(() => {
  const c     = props.result?.character_counts ?? {}
  const total = props.result?.password_length  ?? 1
  return [
    { label: "Uppercase", value: c.uppercase     ?? 0, color: "#48EDF9", pct: Math.round((c.uppercase     ?? 0) / total * 100) },
    { label: "Lowercase", value: c.lowercase     ?? 0, color: "#818cf8", pct: Math.round((c.lowercase     ?? 0) / total * 100) },
    { label: "Digits",    value: c.digits        ?? 0, color: "#34d399", pct: Math.round((c.digits        ?? 0) / total * 100) },
    { label: "Symbols",   value: c.special_chars ?? 0, color: "#f59e0b", pct: Math.round((c.special_chars ?? 0) / total * 100) },
  ]
})

const confidenceBars = computed(() => {
  const s = props.result?.confidence_scores ?? {}
  return [
    { label: "Weak",   value: s.weak   ?? 0, color: "#ef4444" },
    { label: "Medium", value: s.medium ?? 0, color: "#f59e0b" },
    { label: "Strong", value: s.strong ?? 0, color: "#48EDF9" },
  ]
})

// ── Circular gauge ─────────────────────────────────────────────
function arcPath(pct, r = 52) {
  // clamp to avoid NaN at exactly 0 or 100
  const clamped = Math.min(Math.max(pct, 0.01), 99.99)
  const angle   = (clamped / 100) * 2 * Math.PI - Math.PI / 2
  const x       = 60 + r * Math.cos(angle)
  const y       = 60 + r * Math.sin(angle)
  const large   = clamped > 50 ? 1 : 0
  return `M 60 8 A ${r} ${r} 0 ${large} 1 ${x.toFixed(2)} ${y.toFixed(2)}`
}

// ── Animated counters ──────────────────────────────────────────
const animatedConf = ref(0)
const animatedLen  = ref(0)
const animatedEnt  = ref(0)

function animateNumbers() {
  gsap.to(animatedConf, {
    duration: 2.2, ease: "power2.out",
    value: props.result?.confidence ?? 0,
    onUpdate() { animatedConf.value = parseFloat(this.targets()[0].value.toFixed(1)) },
  })
  gsap.to(animatedLen, {
    duration: 1.8, ease: "power2.out",
    value: props.result?.password_length ?? 0,
    onUpdate() { animatedLen.value = Math.round(this.targets()[0].value) },
  })
  gsap.to(animatedEnt, {
    duration: 2.0, ease: "power2.out",
    value: props.result?.entropy ?? 0,
    onUpdate() { animatedEnt.value = parseFloat(this.targets()[0].value.toFixed(2)) },
  })
}

// ── Main animation ─────────────────────────────────────────────
function animateIn() {
  nextTick(() => {
    gsap.fromTo(".res-hero",
      { opacity: 0, y: 45, scale: 0.97 },
      { opacity: 1, y: 0,  scale: 1, duration: 1.8, ease: "power2.out" }
    )
    gsap.fromTo(".res-gauge",
      { opacity: 0, scale: 0.82 },
      { opacity: 1, scale: 1,    duration: 1.6, ease: "back.out(1.3)", delay: 0.25 }
    )
    gsap.fromTo(".res-stat",
      { opacity: 0, y: 38 },
      { opacity: 1, y: 0,  duration: 1.4, ease: "power2.out",
        stagger: { amount: 0.5, ease: "sine.inOut" }, delay: 0.35 }
    )
    gsap.fromTo(".res-bar",
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0,  duration: 1.3, ease: "power2.out",
        stagger: { amount: 0.45, ease: "sine.inOut" }, delay: 0.45 }
    )
    gsap.fromTo(".res-rule",
      { opacity: 0, x: -22 },
      { opacity: 1, x: 0,   duration: 1.2, ease: "power2.out",
        stagger: { amount: 0.6, ease: "sine.inOut" }, delay: 0.55 }
    )
    gsap.fromTo(".res-tip",
      { opacity: 0, y: 22 },
      { opacity: 1, y: 0,  duration: 1.2, ease: "sine.out",
        stagger: { amount: 0.4, ease: "sine.inOut" }, delay: 0.65 }
    )

    animateNumbers()

    // ── Bar fill — GSAP owns width, Vue never touches it ──────
    // Single nextTick is enough: elements are in DOM after first tick
    nextTick(() => {
      document.querySelectorAll(".bar-fill").forEach(el => {
        gsap.fromTo(el,
          { width: "0%" },
          { width: el.dataset.pct + "%", duration: 1.8, ease: "power3.out", delay: 0.55 }
        )
      })
    })
  })
}

watch(() => props.result, (val) => {
  if (val) animateIn()
}, { immediate: true })
</script>

<template>
  <section v-if="result" id="AR" class="py-20 relative overflow-hidden">

    <!-- Ambient blobs -->
    <div class="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none"
         :style="{ backgroundColor: strengthConfig.color + '08' }"></div>
    <div class="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>

    <div class="max-w-6xl mx-auto px-6 relative z-10 space-y-8">
      <div class="flex justify-start">
        <button
          @click="emit('reset')"
          class="flex items-center gap-2.5 text-[16px] font-font-2 font-medium text-slate-400 hover:text-[#48EDF9] transition-colors duration-300 group"
        >
          <span class="w-8 h-8 rounded-xl bg-slate-700/80 border border-slate-900 group-hover:border-[#48EDF9]/40 flex items-center justify-center transition-all duration-300">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
          </span>
          Return to Checker
        </button>
      </div>
      <!-- ── HERO CARD ── -->
      <div class="res-hero rounded-2xl border p-8 flex flex-col md:flex-row items-center gap-8"
           :class="[strengthConfig.ring, strengthConfig.bg, `shadow-2xl ${strengthConfig.glow}`]">

        <!-- Icon + label -->
        <div class="flex flex-col items-center gap-3 flex-shrink-0">
          <div class="w-20 h-20 rounded-2xl flex items-center justify-center border"
               :class="[strengthConfig.ring, strengthConfig.bg]">
            <component :is="strengthConfig.icon" class="w-16 h-16" :style="{ color: strengthConfig.color }"/>
          </div>
          <span class="text-[14px] font-bold font-font-2 tracking-[0.25em] border rounded-full px-3 py-0.5"
                :class="[strengthConfig.text, strengthConfig.ring, strengthConfig.bg]">
            {{ strengthConfig.label }}
          </span>
        </div>

        <!-- Message -->
        <div class="flex-1 text-center md:text-left">
          <h2 class="text-[24px] md:text-[32px] font-font-1 font-bold text-white mb-2">
            Your password is
            <span :style="{ color: strengthConfig.color }">{{ strengthConfig.label }}</span>
          </h2>
          <p class="text-[16px] font-font-2 text-slate-400 leading-relaxed max-w-xl">
            {{ strengthConfig.message }}
          </p>
        </div>

        <!-- CONFIDENCE -->
        <div class="res-gauge flex flex-col items-center gap-2 flex-shrink-0">
          <svg width="150" height="150" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#1e293b" stroke-width="15"/>
            <path
              :d="arcPath(animatedConf)"
              fill="none"
              :stroke="strengthConfig.color"
              stroke-width="10"
              stroke-linecap="round"
              :style="{ filter: `drop-shadow(0 0 6px ${strengthConfig.color}80)` }"
            />
            <text x="60" y="55" text-anchor="middle" fill="white"
                  font-size="20" font-weight="bold" class='font-font-1' >{{ animatedConf }}%</text>
            <text x="60" y="72" text-anchor="middle" class='font-font-2' fill="#94a3b8" font-size="14">CONFIDENCE</text>
          </svg>
        </div>

      </div>

      <!--  STATS ROW  -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div class="res-stat bg-slate-900/60 border border-slate-700 rounded-2xl p-5 text-center">
          <p class="text-[14px] font-font-2 text-slate-400 uppercase tracking-widest mb-2">Length</p>
          <p class="text-[32px] font-font-1 font-bold text-white">{{ animatedLen }}</p>
          <p class="text-[14px] font-font-2 text-slate-500 mt-1">characters</p>
        </div>

        <div class="res-stat bg-slate-900/60 border border-slate-700 rounded-2xl p-5 text-center">
          <p class="text-[14px] font-font-2 text-slate-500 uppercase tracking-widest mb-2">Entropy</p>
          <p class="text-[32px] font-font-1 font-bold text-[#48EDF9]">{{ animatedEnt }}</p>
          <p class="text-[14px] font-font-2 text-slate-500 mt-1">bits</p>
        </div>

        <div class="res-stat bg-slate-900/60 border border-slate-700 rounded-2xl p-5 text-center">
          <p class="text-[14px] font-font-2 text-slate-400 uppercase tracking-widest mb-2">Rules Passed</p>
          <p class="text-[32px] font-font-1 font-bold text-emerald-400">{{ result.rules.passed.length }}</p>
          <p class="text-[14px] font-font-2 text-slate-500 mt-1">/ {{ result.rules.passed.length + result.rules.failed.length }}</p>
        </div>

        <div class="res-stat bg-slate-900/60 border border-slate-700 rounded-2xl p-5 text-center">
          <p class="text-[14px] font-font-2 text-slate-400 uppercase tracking-widest mb-2">Rules Failed</p>
          <p class="text-[32px] font-font-1 font-bold text-red-400">{{ result.rules.failed.length }}</p>
          <p class="text-[14px] font-font-2 text-slate-500 mt-1">to fix</p>
        </div>

      </div>

      <!-- CHARACTER BREAKDOWN + CONFIDENCE BARS  -->
      <div class="grid md:grid-cols-2 gap-6">

        <!-- Character composition -->
        <div class="bg-slate-900/60 border border-slate-700 rounded-2xl p-7">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-9 h-9 rounded-lg bg-cyan-400/10 border border-[#48EDF9]/20 flex items-center justify-center">
              <KeyIcon class="w-6 h-6 text-[#48EDF9]"/>
            </div>
            <div>
              <h3 class="text-[16px] font-font-1 font-semibold text-white">Character Composition</h3>
              <p class="text-[14px] font-font-2 text-slate-400">Breakdown of {{ result.password_length }} characters</p>
            </div>
          </div>

          <div class="space-y-5">
            <div v-for="bar in charBars" :key="bar.label" class="res-bar space-y-1.5">
              <div class="flex justify-between items-center">
                <span class="text-[14px] font-font-2 text-slate-300">{{ bar.label }}</span>
                <span class="text-[14px] font-font-1 font-bold" :style="{ color: bar.color }">
                  {{ bar.value }}
                  <span class="text-[12px] text-slate-500 font-normal">({{ bar.pct }}%)</span>
                </span>
              </div>
              <div class="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <!-- w-0 via Tailwind — GSAP owns width exclusively, no Vue reactive width -->
                <div
                  class="bar-fill w-0 h-full rounded-full"
                  :data-pct="bar.pct"
                  :style="{ backgroundColor: bar.color, boxShadow: `0 0 8px ${bar.color}60` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Model confidence per class -->
        <div class="bg-slate-900/60 border border-slate-700 rounded-2xl p-7">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-9 h-9 rounded-lg bg-cyan-400/10 border border-[#48EDF9]/20 flex items-center justify-center">
              <ChartBarIcon class="w-6 h-6 text-[#48EDF9]"/>
            </div>
            <div>
              <h3 class="text-[16px] font-font-1 font-semibold text-white">Model Confidence per Class</h3>
              <p class="text-[14px] font-font-2 text-slate-400">Softmax output probabilities</p>
            </div>
          </div>

          <div class="space-y-5">
            <div v-for="bar in confidenceBars" :key="bar.label" class="res-bar space-y-1.5">
              <div class="flex justify-between items-center">
                <span class="text-[14px] font-font-2 text-slate-300">{{ bar.label }}</span>
                <span class="text-[14px] font-font-1 font-bold" :style="{ color: bar.color }">
                  {{ bar.value.toFixed(2) }}%
                </span>
              </div>
              <div class="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
               
                <div
                  class="bar-fill w-0 h-full rounded-full"
                  :data-pct="bar.value.toFixed(1)"
                  :style="{ backgroundColor: bar.color, boxShadow: `0 0 8px ${bar.color}60` }"
                ></div>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-5 border-t border-slate-800 flex items-start gap-2">
            <svg class="w-5 h-5 text-[#48EDF9] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z"/>
            </svg>
            <p class="text-[14px] font-font-2 text-slate-400 leading-relaxed">
              Shannon entropy of <span class="text-slate-200">{{ result.entropy }}</span> bits ,
              higher values mean more unpredictable character distribution.
              Strong passwords typically exceed <span class="text-slate-400">3.5 bits</span>.
            </p>
          </div>
        </div>

      </div>

      <!-- RULES PASSED / FAILED  -->
      <div class="grid md:grid-cols-2 gap-6">

        <!-- Passed -->
        <div class="bg-slate-900/60 border border-slate-700 rounded-2xl p-7">
          <div class="flex items-center gap-2 mb-5">
            <div class="w-6 h-6 rounded-full bg-emerald-400/15 border border-emerald-400/40 flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <span class="text-[16px] font-semibold tracking-[0.15em] uppercase text-emerald-400 font-font-2">
              Passed ({{ result.rules.passed.length }})
            </span>
          </div>
          <ul class="space-y-3">
            <li v-for="rule in result.rules.passed" :key="rule.key"
                class="res-rule flex items-center gap-3">
              <CheckCircleIcon class="w-5 h-5 text-emerald-400 flex-shrink-0"/>
              <span class="text-[15px] font-font-2 text-slate-300">{{ rule.label }}</span>
            </li>
          </ul>
        </div>

        <!-- Failed -->
        <div class="bg-slate-900/60 border border-slate-700 rounded-2xl p-7">
          <div class="flex items-center gap-2 mb-5">
            <div class="w-6 h-6 rounded-full bg-red-400/15 border border-red-400/40 flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </div>
            <span class="text-[16px] font-semibold tracking-[0.15em] uppercase text-red-400 font-font-2">
              Failed ({{ result.rules.failed.length }})
            </span>
          </div>
          <ul v-if="result.rules.failed.length" class="space-y-3">
            <li v-for="rule in result.rules.failed" :key="rule.key"
                class="res-rule flex items-center gap-3">
              <XCircleIcon class="w-5 h-5 text-red-400 flex-shrink-0"/>
              <span class="text-[15px] font-font-2 text-slate-300">{{ rule.label }}</span>
            </li>
          </ul>
          <div v-else class="flex items-center gap-3 py-4">
            <ShieldCheckIcon class="w-5 h-5 text-[#48EDF9]"/>
            <span class="text-[14px] font-font-2 text-slate-400">All rules passed — excellent password!</span>
          </div>
        </div>

      </div>

      <!--  SUGGESTIONS  -->
      <div v-if="result.suggestions?.length" class="bg-slate-900/60 border border-slate-700 rounded-2xl p-7">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-9 h-9 rounded-lg bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center">
            <LightBulbIcon class="w-6 h-6 text-yellow-400"/>
          </div>
          <div>
            <h3 class="text-[16px] font-font-1 font-semibold text-white">Suggestions to Strengthen</h3>
            <p class="text-[14px] font-font-2 text-slate-400">Apply these to reach STRONG</p>
          </div>
        </div>
        <ul class="space-y-3">
          <li v-for="(tip, i) in result.suggestions" :key="i"
              class="res-tip flex items-start gap-4 bg-slate-800/40 border border-slate-700/50 rounded-xl px-4 py-3.5">
            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-400/10 border border-yellow-400/30 flex items-center justify-center text-[11px] font-bold font-font-1 text-yellow-400 mt-0.5">
              {{ i + 1 }}
            </span>
            <p class="text-[16px] font-font-2 text-slate-300 leading-relaxed">{{ tip }}</p>
          </li>
        </ul>
      </div>

    </div>
  </section>
</template>