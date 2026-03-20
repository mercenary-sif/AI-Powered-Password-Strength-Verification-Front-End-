<script setup>
import { ref, computed, onMounted } from "vue"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { EyeIcon, EyeSlashIcon, BoltIcon, ShieldCheckIcon } from "@heroicons/vue/24/outline"

import { analyzePassword } from "../services/api.js"


gsap.registerPlugin(ScrollTrigger)

const password = ref("")
const showPassword = ref(false)

const doTips = [
  { text: "Use 12–20 characters minimum",           detail: "Length is the single strongest defense" },
  { text: "Combine upper, lower, digits & symbols", detail: "e.g. Tr0ub4dor&3" },
  { text: "Use a random passphrase",                detail: "e.g. correct-horse-battery-staple" },
  { text: "One unique password per account",        detail: "Reuse = one breach exposes everything" },
]

const dontTips = [
  { text: "Your name or family names",    detail: "Mohamed2024, ahmed123 are in the dataset" },
  { text: "Birthdays or important dates", detail: "First thing attackers try" },
  { text: "Leet speak substitutions",     detail: "p@ssw0rd, s3cur1ty — model knows these" },
  { text: "Keyboard walks",               detail: "qwerty, asdfgh, zxcvbn are all flagged" },
  { text: "Common words + numbers",       detail: "dragon99, football1 are directly in RockYou" },
  { text: "Repeated characters",          detail: "aaa111, 000000 scored as instant-crack" },
]

const passwordLength = computed(() => password.value.length)

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const emit = defineEmits(["loading", "result", "error"])

const submitPassword = async () => {
  if (!password.value) return

  emit("loading", true)

  try {
   const response = await analyzePassword(password.value)
   
    emit("loading", false)
    emit("result", response.data)

  } catch (err) {
   emit("loading", false)

  const data = err?.response?.data

  // 422 → detail is an array: [{ msg, loc, type, input }]
  // 500 → detail is a string or object: { error, message, code }
  let message = "Unexpected server error. Please try again."
  let code    = err?.response?.status ? `HTTP_${err.response.status}` : "UNKNOWN"

  if (Array.isArray(data?.detail)) {
    // Pydantic 422 — extract first error's msg
    const raw = data.detail[0]?.msg ?? message
    message = raw.replace("Value error, ", "")

  } else if (typeof data?.detail === "string") {
    // FastAPI HTTPException with string detail
    message = data.detail

  } else if (data?.detail?.message) {
    // Our custom HTTPException: { error, message, code }
    message = data.detail.message
    code    = data.detail.code ?? code

  } else if (data?.message) {
    // Direct { message, code } shape
    message = data.message
    code    = data.code ?? code
  }

  emit("error", { message, code })
  }
}

onMounted(() => {
  gsap.fromTo(".ctp-badge",
    { opacity: 0, scale: 0.88 },
    {
      opacity: 1, scale: 1, duration: 1.8, ease: "back.out(1.2)",
      scrollTrigger: { trigger: ".ctp-badge", start: "top 92%", toggleActions: "play none none reverse" }
    }
  )
  gsap.fromTo(".ctp-heading",
    { opacity: 0, y: 55 },
    {
      opacity: 1, y: 0, duration: 2.6, ease: "power1.out",
      scrollTrigger: { trigger: ".ctp-heading", start: "top 92%", toggleActions: "play none none reverse" }
    }
  )
  gsap.fromTo(".ctp-subtitle",
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0, duration: 2.4, ease: "sine.out",
      scrollTrigger: { trigger: ".ctp-subtitle", start: "top 92%", toggleActions: "play none none reverse" }
    }
  )
  gsap.fromTo(".ctp-card",
    { opacity: 0, y: 60, scale: 0.97 },
    {
      opacity: 1, y: 0, scale: 1, duration: 2.6, ease: "power1.out",
      scrollTrigger: { trigger: ".ctp-card", start: "top 90%", toggleActions: "play none none reverse" }
    }
  )
  gsap.fromTo(".edu-card",
    { opacity: 0, y: 60, scale: 0.97 },
    {
      opacity: 1, y: 0, scale: 1, duration: 2.6, ease: "power1.out",
      scrollTrigger: { trigger: ".edu-card", start: "top 90%", toggleActions: "play none none reverse" }
    }
  )
})
</script>

<template>
  <section id="CTP" class="py-28 text-white relative overflow-hidden">
   
   <div class="absolute top-0 left-1/3 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none"></div>
   
    <div class="flex flex-col justify-center items-center z-10 mx-[1rem]">

      <div class="text-center mb-14">
        <span class="ctp-badge inline-flex items-center gap-2 text-[14px]  md:text-[16px] font-font-2 font-semibold tracking-[0.2em] text-[#48EDF9] uppercase mb-5 border border-[#48EDF9] rounded-full px-4 py-1.5 bg-cyan-500/5">
          <BoltIcon class="w-5 h-5"/>
          AI-Powered Analysis
        </span>
        <h2 class="ctp-heading text-[28px] md:text-[42px] font-font-1 font-bold mb-4 leading-tight">
          Is Your Password Safe Against
          <span class="text-[#48EDF9]">Real Attacks?</span>
        </h2>
        <p class="ctp-subtitle font-font-2 text-slate-400 text-[16px] md:text-[18px] leading-relaxed max-w-4xl mx-auto">
          Our BiLSTM model reads your password
          <span class="text-white font-semibold">character by character</span>
          , trained on
          <span class="text-white font-semibold">850K passwords</span>
          including RockYou leaks, leet speak variants, keyboard patterns,
          and name–year combos attackers actually use.
        </p>
      </div>

      <div class="flex flex-col md:flex-row gap-8 items-stretch">

        <div class="ctp-card flex-1 bg-slate-900/70 backdrop-blur-xl border border-slate-600 rounded-2xl p-7 md:p-9 shadow-2xl flex flex-col justify-between">

          <div>

          
            <div class="flex items-center gap-2 mb-6">
              <div class="w-1.5 h-5 rounded-full bg-[#48EDF9]"></div>
              <span class="text-[14px] font-semibold tracking-[0.18em] uppercase text-slate-300 font-font-2">Password Input</span>
            </div>

            <div class="relative mb-3">
              <div class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <ShieldCheckIcon class="w-6 h-6"/>
              </div>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password..."
                class="w-full pl-11 pr-14 py-4 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-[#48EDF9] focus:ring-2 focus:ring-cyan-200/20 outline-none text-white placeholder-slate-500 font-font-2 text-[16px] tracking-wider transition-all duration-300"
              />
              <button
                @click="togglePassword"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#48EDF9] transition-colors duration-200 p-1"
              >
                <EyeSlashIcon v-if="showPassword" class="w-6 h-6"/>
                <EyeIcon v-else class="w-6 h-6"/>
              </button>
            </div>

           
            <div class="flex justify-end mb-7 text-[14px] font-font-2 text-slate-400">
              <span>{{ passwordLength }} characters</span>
            </div>

           
            <div class="bg-slate-800/40 border border-slate-500/50 rounded-xl p-5 mb-8 space-y-4">

              <p class="text-[15px] text-slate-100 uppercase tracking-widest font-font-2">
                What makes this different from other checkers
              </p>

              <div class="space-y-3">

                <div class="flex items-start gap-3">
                  <span class="mt-0.5 w-6 h-6 rounded-full bg-cyan-400/10 border border-[#48EDF9] flex items-center justify-center flex-shrink-0">
                    <svg class="w-3.5 h-3.5 text-[#48EDF9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                  </span>
                  <div>
                    <p class="text-[14px] text-slate-200 font-font-2 leading-snug">Not rule-based — it learned from real passwords</p>
                    <p class="text-[13px] text-slate-400 font-font-2 mt-0.5">Trained on actual breached data, not just length checks</p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <span class="mt-0.5 w-6 h-6 rounded-full bg-cyan-400/10 border border-[#48EDF9] flex items-center justify-center flex-shrink-0">
                    <svg class="w-3.5 h-3.5 text-[#48EDF9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                  </span>
                  <div>
                    <p class="text-[14px] text-slate-200 font-font-2 leading-snug">Passwords that look complex can still be flagged</p>
                    <p class="text-[13px] text-slate-400 font-font-2 mt-0.5">Leet speak, name+year, and keyboard walks are in the training set</p>
                  </div>
                </div>

                <div class="flex items-start gap-3">
                  <span class="mt-0.5 w-6 h-6 rounded-full bg-cyan-400/10 border border-[#48EDF9] flex items-center justify-center flex-shrink-0">
                    <svg class="w-3.5 h-3.5 text-[#48EDF9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                  </span>
                  <div>
                    <p class="text-[14px] text-slate-200 font-font-2 leading-snug">You might be surprised by the result</p>
                    <p class="text-[13px] text-slate-400 font-font-2 mt-0.5">A password you trust may not survive 850K learned attack patterns</p>
                  </div>
                </div>

              </div>

              
              <div class="pt-3 border-t border-slate-400/40 flex items-center gap-2">
                <svg class="w-4 h-4 text-[#48EDF9] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                <p class="text-[12px] text-slate-200 font-font-2">
                  The only way to know is to let the model decide , Start the Analyze.
                </p>
              </div>

            </div>

          </div>

          
          <button
            @click="submitPassword"
            :disabled="!password"
            class="w-full py-4 rounded-xl font-font-2 font-semibold text-[16px] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-[#48EDF9] hover:from-[#48EDF9] hover:to-cyan-300 text-slate-800 shadow-lg hover:shadow-cyan-400/30"
          >
            <ShieldCheckIcon class="w-6 h-6"/>
            Analyze with MS-AI
          </button>

        </div>

        
        <div class="edu-card flex-1 bg-slate-900/60 backdrop-blur-xl border border-slate-500 rounded-2xl overflow-hidden shadow-xl flex flex-col">

          <div class="px-7 py-5 border-b border-slate-800 flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-cyan-600/10 border border-[#48EDF9] flex items-center justify-center flex-shrink-0">
              <ShieldCheckIcon class="w-5 h-5 text-[#48EDF9]"/>
            </div>
            <div>
              <h4 class="text-[16px] font-font-1 font-semibold text-white">What Our Model Was Trained to Catch</h4>
              <p class="text-[14px] text-slate-300 font-font-2">Real patterns from 850K leaked & adversarial passwords</p>
            </div>
          </div>

          
          <div class="p-7 grid grid-cols-2 gap-6 flex-1">
            <!-- Good Practices -->
            <div>
              <div class="flex items-center gap-2 mb-4">
                <span class="w-6 h-6 rounded-full bg-cyan-400/15 border border-[#48EDF9] flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-[#48EDF9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                </span>
                <span class="text-[14px] font-semibold tracking-[0.15em] uppercase text-[#48EDF9] font-font-2">Good Practices</span>
              </div>

              <ul class="space-y-4">
                <li
                  v-for="tip in doTips"
                  :key="tip.text"
                  class="flex items-start gap-2.5 font-font-2"
                >
                  <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#48EDF9] flex-shrink-0"></span>
                  <div>
                    <p class="text-[14px] text-slate-200 leading-snug">{{ tip.text }}</p>
                    <p class="text-[12px] text-slate-400 mt-0.5">{{ tip.detail }}</p>
                  </div>
                </li>
              </ul>
            </div>

            <!-- Never Use -->
            <div>
              <div class="flex items-center gap-2 mb-4">
                <span class="w-6 h-6 rounded-full bg-red-400/15 border border-red-400/40 flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </span>
                <span class="text-[14px] font-semibold tracking-[0.15em] uppercase text-red-400 font-font-2">Never Use</span>
              </div>
              <ul class="space-y-4">
                <li
                  v-for="tip in dontTips"
                  :key="tip.text"
                  class="flex items-start gap-2.5 font-font-2"
                >
                  <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400/70 flex-shrink-0"></span>
                  <div>
                    <p class="text-[14px] text-slate-200 leading-snug">{{ tip.text }}</p>
                    <p class="text-[12px] text-slate-400 mt-0.5">{{ tip.detail }}</p>
                  </div>
                </li>
              </ul>
            </div>

          </div>

          
          <div class="px-7 py-4 bg-slate-950/40 border-t border-slate-600/60 flex items-center gap-2">
            <svg class="w-5 h-5 text-[#48EDF9] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z"/>
            </svg>
            <p class="text-[12px] text-slate-200 font-font-2 leading-relaxed">
              The model scores independently ! a password passing all tips above may still be flagged if it matches patterns seen in real breaches.
            </p>
          </div>

        </div>

      </div>

    </div>
  </section>
</template>