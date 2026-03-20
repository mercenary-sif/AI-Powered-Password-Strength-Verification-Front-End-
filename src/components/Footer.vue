<script setup>
import { ref, onMounted } from "vue"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import emailjs from "@emailjs/browser"
import {
  EnvelopeIcon,
  CpuChipIcon,
  ShieldCheckIcon,
} from "@heroicons/vue/24/outline"
import logo from "../assets/Logo-2.png"

gsap.registerPlugin(ScrollTrigger)


const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const form      = ref({ name: "", email: "", message: "" })
const submitted = ref(false)
const sending   = ref(false)
const error     = ref("")

const navLinks = [
  { href: "#home",      label: "Home"             },
  { href: "#aboutUs",   label: "About Us"          },
  { href: "#CTP",       label: "Check The Password"},
  { href: "#ATM",       label: "About The Model"   },
  { href: "#contactUS", label: "Contact Us"        },
]

// (optional) initialize once (e.g. in module scope or onMounted)
// emailjs.init(EMAILJS_PUBLIC_KEY)

const handleSubmit = async () => {
  if (!form.value.name || !form.value.email || !form.value.message) return

  sending.value = true
  error.value   = ""

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        from_name:  form.value.name,
        from_email: form.value.email,
        reply_to:   form.value.email,
        to_name:    "Sif Eddine",
        subject:    "AI PASSWORD STRENGTH CONTACT", 
        message:    form.value.message,
      },
      EMAILJS_PUBLIC_KEY // keep this (required for browser/client usage)
    )
    submitted.value = true
  } catch (err) {
    error.value = "Failed to send. Please try again or email me directly."
    console.error("EmailJS error:", err)
  } finally {
    sending.value = false
  }
}
const handleReset = () => {
  submitted.value = false
  error.value     = ""
  form.value      = { name: "", email: "", message: "" }
}

function animateIn(selector, opts = {}) {
  gsap.fromTo(
    selector,
    { opacity: 0, y: opts.y ?? 40 },
    {
      opacity: 1, y: 0,
      duration: opts.duration ?? 1.8,
      ease: opts.ease ?? "power1.out",
      stagger: opts.stagger ? { amount: opts.stagger, ease: "sine.inOut" } : 0,
      scrollTrigger: {
        trigger: selector,
        start: "top 92%",
        end: "top 50%",
        toggleActions: "play none none reverse",
      },
    }
  )
}

onMounted(() => {
  animateIn(".cu-badge",    { y: 14, duration: 1.3, ease: "sine.out"   })
  animateIn(".cu-heading",  { y: 50, duration: 2.0, ease: "power2.out" })
  animateIn(".cu-subtitle", { y: 32, duration: 1.9, ease: "sine.out"   })
  animateIn(".cu-form",     { y: 55, duration: 2.0, ease: "power2.out" })
  animateIn(".cu-nav-link", { y: 20, duration: 1.5, ease: "sine.out",   stagger: 0.13 })
  animateIn(".cu-bottom",   { y: 25, duration: 1.4, ease: "sine.out"   })
})
</script>

<template>
  <footer id="contactUS" class="bg-slate-950 relative text-white overflow-hidden pt-28 pb-0">
    <div class="max-w-6xl mx-auto px-6 relative z-10">

      <!-- Heading -->
      <div class="text-center mb-16">
        <span class="cu-badge inline-flex items-center gap-2 text-[14px] md:text-[16px] font-font-2 font-semibold tracking-[0.2em] text-[#48EDF9] uppercase mb-5 border border-[#48EDF9]/40 rounded-full px-4 py-1.5 bg-cyan-500/5">
          <EnvelopeIcon class="w-6 h-6"/>
          Get In Touch
        </span>
        <h2 class="cu-heading text-[28px] md:text-[42px] font-font-1 font-bold mb-4 leading-tight">
          Questions About the
          <span class="text-[#48EDF9]">Model?</span>
        </h2>
        <p class="cu-subtitle font-font-2 text-slate-400 text-[16px] md:text-[18px] leading-relaxed max-w-2xl mx-auto">
          Whether it's about the BiLSTM architecture, the dataset pipeline, or the adversarial strategies —
          I am happy to discuss the technical details.
        </p>
      </div>

      <!-- Form -->
      <div class="flex justify-center items-center gap-10 mb-24">
        <div class="cu-form bg-slate-900/60 border border-slate-700 rounded-2xl p-8 w-full md:w-[75%] flex flex-col gap-5">

          <!-- ── FORM STATE ── -->
          <div v-if="!submitted" class="flex flex-col gap-5">

            <div class="flex items-center gap-2 mb-2">
              <div class="w-1.5 h-5 rounded-full bg-[#48EDF9]"></div>
              <span class="text-[14px] font-semibold tracking-[0.18em] uppercase text-slate-300 font-font-2">Send a message</span>
            </div>

            <!-- Name -->
            <div class="flex flex-col gap-1.5">
              <label class="text-[13px] font-font-2 text-slate-500 uppercase tracking-widest">Name</label>
              <input
                v-model="form.name"
                type="text"
                placeholder="Your name"
                :disabled="sending"
                class="w-full px-4 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-[#48EDF9] focus:ring-2 focus:ring-cyan-400/20 outline-none text-white placeholder-slate-600 font-font-2 text-[15px] transition-all duration-300 disabled:opacity-50"
              />
            </div>

            <!-- Email -->
            <div class="flex flex-col gap-1.5">
              <label class="text-[13px] font-font-2 text-slate-500 uppercase tracking-widest">Email</label>
              <input
                v-model="form.email"
                type="email"
                placeholder="your@email.com"
                :disabled="sending"
                class="w-full px-4 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-[#48EDF9] focus:ring-2 focus:ring-cyan-400/20 outline-none text-white placeholder-slate-600 font-font-2 text-[15px] transition-all duration-300 disabled:opacity-50"
              />
            </div>

            <!-- Message -->
            <div class="flex flex-col gap-1.5">
              <label class="text-[13px] font-font-2 text-slate-500 uppercase tracking-widest">Message</label>
              <textarea
                v-model="form.message"
                rows="4"
                placeholder="Ask about the model architecture, dataset, or anything else..."
                :disabled="sending"
                class="w-full px-4 py-3.5 rounded-xl bg-slate-800/80 border border-slate-700 focus:border-[#48EDF9] focus:ring-2 focus:ring-cyan-400/20 outline-none text-white placeholder-slate-600 font-font-2 text-[15px] transition-all duration-300 resize-none disabled:opacity-50"
              ></textarea>
            </div>

            <!-- Error message -->
            <div v-if="error" class="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              <svg class="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p class="text-[13px] font-font-2 text-red-400">{{ error }}</p>
            </div>

            <!-- Submit button -->
            <button
              @click="handleSubmit"
              :disabled="!form.name || !form.email || !form.message || sending"
              class="w-full py-4 rounded-xl font-font-2 font-semibold text-[15px] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-[#48EDF9] hover:from-[#48EDF9] hover:to-cyan-300 text-slate-900 shadow-lg hover:shadow-cyan-400/30"
            >
              <!-- Spinner while sending -->
              <svg v-if="sending" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <EnvelopeIcon v-else class="w-5 h-5"/>
              {{ sending ? "Sending..." : "Send Message" }}
            </button>

          </div>

          <!-- ── SUCCESS STATE ── -->
          <div v-else class="flex flex-col items-center justify-center gap-5 py-12 text-center">
            <div class="w-16 h-16 rounded-full bg-cyan-400/10 border border-[#48EDF9]/40 flex items-center justify-center">
              <ShieldCheckIcon class="w-8 h-8 text-[#48EDF9]"/>
            </div>
            <div>
              <p class="text-[18px] font-font-1 font-bold text-white mb-2">Message Sent!</p>
              <p class="text-[14px] font-font-2 text-slate-400">We'll get back to you soon.</p>
            </div>
            <button
              @click="handleReset"
              class="text-[13px] font-font-2 text-slate-500 hover:text-[#48EDF9] transition-colors duration-300 underline underline-offset-4">
              Send another
            </button>
          </div>

        </div>
      </div>

      <!-- Footer bottom -->
      <div class="cu-bottom border-t border-slate-800">
        <div class="py-10 grid md:grid-cols-3 gap-10 items-start">

          <div class="flex flex-col gap-4">
            <img :src="logo" class="h-[60px] w-[180px] object-contain"/>
            <p class="text-[14px] font-font-2 text-slate-400 leading-relaxed max-w-[260px]">
              An AI-powered password strength classifier built on a BiLSTM model
              trained across ~850K real, synthetic, and adversarial passwords.
            </p>
          </div>

          <div class="flex flex-col gap-3">
            <p class="text-[14px] font-font-2 text-slate-600 uppercase tracking-widest mb-1">Navigation</p>
          <a
            v-for="link in navLinks"
            :key="link.href"
            :href="link.href"
            class="cu-nav-link text-[14px] font-font-2 text-slate-400 hover:text-[#48EDF9] transition-colors duration-300 w-fit relative group"
          >
            {{ link.label }}
            <span class="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-[#48EDF9] rounded-full transition-all duration-300 group-hover:w-full"></span>
          </a>
          </div>

          <div class="flex flex-col gap-3">
            <p class="text-[14px] font-font-2 text-slate-600 uppercase tracking-widest mb-1">Model Info</p>
            <div class="space-y-2">
              <div v-for="item in [
                'BiLSTM · Character-Level',
                'RockYou + Rule-based + Adversarial',
                'Leet speak & keyboard walk aware',
                'EarlyStopping · patience=3',
              ]" :key="item" class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-[#48EDF9]/60"></span>
                <span class="text-[13px] font-font-2 text-slate-400">{{ item }}</span>
              </div>
            </div>
          </div>

        </div>

        <div class="border-t border-slate-800/60 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p class="text-[12px] font-font-2 text-slate-600">
            © 2025 AI Password Strength Verification · All rights reserved, developed by:
            <span class="text-[13px] cursor-pointer hover:text-[#48EDF9] uppercase font-font-2 text-slate-400"> Aguaguena Sif Eddine</span>
          </p>
          <div class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-[#48EDF9] animate-pulse"></span>
            <p class="text-[12px] font-font-2 text-slate-600">
              Powered by <span class="text-[#48EDF9]">BiLSTM</span> · Trained on
              <span class="text-slate-400">~850K passwords</span>
            </p>
          </div>
        </div>
      </div>

    </div>
  </footer>
</template>
