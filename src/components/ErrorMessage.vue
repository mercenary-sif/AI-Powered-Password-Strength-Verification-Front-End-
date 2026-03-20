<script setup>
import { onMounted } from "vue"
import { gsap } from "gsap"
import { ExclamationTriangleIcon, ArrowLeftIcon } from "@heroicons/vue/24/outline"

const props = defineProps({
  message: { type: String, default: "Something went wrong. Please try again." },
  code:    { type: String, default: "" },
})

const emit = defineEmits(["retry"])

onMounted(() => {
  gsap.fromTo(".err-backdrop",
    { opacity: 0 },
    { opacity: 1, duration: 0.5, ease: "power2.out" }
  )
  gsap.fromTo(".err-card",
    { opacity: 0, y: 30, scale: 0.95 },
    { opacity: 1, y: 0,  scale: 1, duration: 0.7, ease: "back.out(1.4)", delay: 0.15 }
  )
  gsap.fromTo(".err-icon",
    { opacity: 0, scale: 0.7, rotate: -10 },
    { opacity: 1, scale: 1,   rotate: 0, duration: 0.6, ease: "back.out(1.7)", delay: 0.35 }
  )
  gsap.fromTo(".err-text",
    { opacity: 0, y: 16 },
    { opacity: 1, y: 0, duration: 0.6, ease: "power2.out",
      stagger: { amount: 0.2, ease: "sine.inOut" }, delay: 0.45 }
  )
  gsap.fromTo(".err-btn",
    { opacity: 0, y: 12 },
    { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.65 }
  )
})
</script>

<template>
  <div class="err-backdrop fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-md">

    <div class="err-card relative w-full max-w-md mx-4 bg-slate-900/90 border border-red-500/30 rounded-2xl p-8 shadow-2xl shadow-red-500/10 flex flex-col items-center gap-6 text-center">

      
      <div class="absolute inset-0 rounded-2xl bg-red-500/5 pointer-events-none"></div>

     
      <div class="err-icon w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
        <ExclamationTriangleIcon class="w-10 h-10 text-red-400"/>
      </div>

      <!-- Texts -->
      <div class="err-text space-y-2">
        <h3 class="text-[20px] font-font-1 font-bold text-white">Analysis Failed</h3>
        <p class="text-[15px] font-font-2 text-slate-400 leading-relaxed">{{ message }}</p>
        <p v-if="code" class="text-[12px] font-font-2 text-slate-600 uppercase tracking-widest">
          Error code: {{ code }}
        </p>
      </div>

    
      <div class="w-full h-px bg-slate-800"></div>

      <!-- Button -->
      <button
        @click="emit('retry')"
        class="err-btn w-full py-4 rounded-xl font-font-2 font-semibold text-[15px] flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 text-slate-200 transition-all duration-300"
      >
        <ArrowLeftIcon class="w-5 h-5"/>
        Try Another Password
      </button>

    </div>
  </div>
</template>