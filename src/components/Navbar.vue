<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue"
import { gsap } from "gsap"
import logo from '../assets/Logo-2.png'

import {
  HomeIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  EnvelopeIcon,
  ChartBarSquareIcon,
} from "@heroicons/vue/24/outline"

const isOpen = ref(false)
const isScrolled = ref(false)

const props = defineProps({
  hasResult: { type: Boolean, default: false }
})

const staticLinks = [
  { href: "#home", label: "Home", icon: HomeIcon },
  { href: "#aboutUs", label: "About Us", icon: UserGroupIcon },
  { href: "#ATM", label: "About The Model", icon: CpuChipIcon },
  { href: "#contactUS", label: "Contact US", icon: EnvelopeIcon },
]

const ctpLink = computed(() =>
  props.hasResult
    ? { href: "#AR", label: "Analysis Result", icon: ChartBarSquareIcon }
    : { href: "#CTP", label: "Check Password", icon: ShieldCheckIcon }
)

const navLinks = computed(() => [
  staticLinks[0],
  staticLinks[1],
  ctpLink.value,
  staticLinks[2],
  staticLinks[3],
])

const toggleMenu = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    gsap.fromTo(".mobile-menu",
      { x: "100%", opacity: 0 },
      { x: "0%", opacity: 1, duration: 0.9, ease: "power2.out" }
    )
    gsap.fromTo(".mobile-link",
      { x: 50, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, stagger: 0.12, delay: 0.3, ease: "power2.out" }
    )
  } else {
    closeMenu()
  }
}

const closeMenu = () => {
  gsap.to(".mobile-menu", {
    x: "100%",
    opacity: 0,
    duration: 0.6,
    ease: "power2.in",
    onComplete: () => { isOpen.value = false }
  })
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 30
}

onMounted(() => {
  gsap.fromTo("nav",
    { y: -80, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.4, ease: "power2.out", delay: 0.2 }
  )
  gsap.fromTo(".nav-logo",
    { x: -30, opacity: 0 },
    { x: 0, opacity: 1, duration: 1.2, ease: "power2.out", delay: 0.8 }
  )
  gsap.fromTo(".nav-link",
    { y: -20, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.0, stagger: 0.14, ease: "sine.out", delay: 1.1 }
  )
  gsap.fromTo(".menu-btn",
    { opacity: 0, scale: 0.7 },
    { opacity: 1, scale: 1, duration: 1.0, ease: "back.out(1.4)", delay: 1.4 }
  )
  window.addEventListener("scroll", handleScroll)
})

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll)
})
</script>

<template>
  <nav
    class="fixed z-[999] w-full font-font-2 h-[12vh] transition-all duration-500"
    :class="isScrolled
      ? 'bg-slate-950/90 backdrop-blur-md shadow-lg shadow-cyan-900/20'
      : 'bg-transparent shadow-sm shadow-gray-200/10'">

    <div class="max-w-7xl mx-auto px-4">
      <div class="flex justify-between items-center h-[12vh]">

        <div class="nav-logo flex items-center justify-center">
          <img :src="logo" alt="logo" class="h-[60px] w-[180px] object-contain cursor-pointer hover:scale-105 transition-transform duration-300">
        </div>

        <div class="hidden md:flex items-center text-[16px] space-x-8">

          <a
            v-for="(link, i) in navLinks"
            :key="i"
            :href="link.href"
            class="nav-link relative flex items-center gap-2 text-gray-200 group"
          >
            <component
              :is="link.icon"
              class="w-6 h-6 text-gray-400 group-hover:text-[#48EDF9] transition-all duration-300"
            />

            <span class="group-hover:text-[#48EDF9] transition-colors duration-300">
              {{ link.label }}
            </span>

            <span class="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#48EDF9] rounded-full transition-all duration-300 group-hover:w-full shadow-[0_0_8px_#48EDF9]"></span>
          </a>

        </div>

        <div class="md:hidden">
          <button @click="toggleMenu" class="menu-btn text-cyan-400 p-2 rounded-md hover:bg-cyan-500/10 transition-all duration-300 hover:scale-110">
            <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

      </div>
    </div>

    <div
      v-if="isOpen"
      class="mobile-menu md:hidden absolute right-0 top-[12vh] w-[80%] h-screen z-[999] bg-gradient-to-br from-slate-950  to-cyan-900 backdrop-blur-lg border-l border-cyan-800/30 shadow-2xl"
    >
      <div class="flex flex-col items-center py-10 space-y-8">

        <a
          v-for="(link, i) in navLinks"
          :key="i"
          :href="link.href"
          @click="closeMenu"
          class="mobile-link flex items-center gap-3 text-gray-200 text-[20px] group"
        >
          <component
            :is="link.icon"
            class="w-6 h-6 text-cyan-400 group-hover:scale-110 transition"
          />

          <span class="group-hover:text-cyan-400 transition">
            {{ link.label }}
          </span>
        </a>

      </div>
    </div>

  </nav>
</template>