<script setup>
import cover from "../assets/heroCover-2.png"
import { gsap } from "gsap"
import Typed from "typed.js"
import SplitType from "split-type"
import { onMounted } from "vue"

const emit = defineEmits(["reset"])
const props = defineProps({
  hasResult: { type: Boolean, default: false }
})

onMounted(() => {
  new Typed("#typing", {
    strings: [" AI-Powered Password Security"],
    typeSpeed: 60,
    backSpeed: 30,
    loop: false,
    showCursor: false
  })

  const splitTitle = new SplitType(".hero-title", { types: "chars" })

  const tl = gsap.timeline({ delay: 1.2 })

  tl.from(splitTitle.chars, {
    opacity: 0,
    y: 65,
    duration: 1.2,
    ease: "power1.out",
    stagger: 0.05
  })
  .from(".hero-text", {
    opacity: 0,
    y: 40,
    duration: 2.0,
    ease: "sine.out"
  }, "-=0.4")

  const btnTl = gsap.timeline()

  btnTl.from(".hero-btn", {
    opacity: 0,
    y: 14,
    scale: 0.88,
    duration: 1.4,
    delay: 2.8,
    ease: "back.out(1.2)"
  })
  .to(".hero-btn", {
    opacity: 1,
    scale: 1.05,
    duration: 2.4,
    yoyo: true,
    ease: "sine.inOut"
  })
})

</script>

<template>
<header
  id='home'
  class="relative min-h-screen flex items-center justify-center text-white bg-cover bg-center"
  :style="{ backgroundImage: `url(${cover})` }"
>
  <div class="absolute inset-0 bg-slate-950/70"></div>

  <div class="relative z-10 max-w-6xl mx-auto px-6 text-center">

    <p id="typing" class="text-[#48EDF9] uppercase tracking-widest font-font-1 text-[15px] md:text-[22px] mb-4" ></p>

    <h1 class="hero-title text-4xl md:text-6xl font-bold font-font-2 leading-tight mb-6">
      Verify the Strength of Your Password
      <span class="text-[#48EDF9]">With Artificial Intelligence</span>
    </h1>

    <p class="hero-text text-gray-100  text-lg md:text-[20px] font-font-1 max-w-4xl mx-auto mb-8">
      Weak passwords are one of the most common causes of data breaches.
      Our AI-powered password strength analyzer helps you evaluate the
      security of your passwords in real time, protecting your accounts
      from brute-force attacks, credential leaks, and cyber threats.
    </p>

    <a
      href="#CTP"
      v-if="!hasResult"
      class=" hero-btn inline-block bg-cyan-500 hover:bg-[#48EDF9] text-white hover:text-slate-900 font-semibold px-8 py-4 rounded-xl transition duration-300 shadow-lg hover:shadow-cyan-500/30"
    >
      Verify Your Password Strength Now
    </a>
    <button
      v-else
      @click="emit('reset')"
      class="hero-btn inline-block bg-cyan-500 hover:bg-[#48EDF9] text-white hover:text-slate-900 font-semibold px-8 py-4 rounded-xl transition duration-300 shadow-lg hover:shadow-cyan-500/30"
    >
      Check Another Password
    </button>

  </div>
</header>
</template>