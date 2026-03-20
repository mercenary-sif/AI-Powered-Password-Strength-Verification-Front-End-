<script setup>
import { ShieldCheckIcon, CpuChipIcon, ChartBarIcon, LockClosedIcon } from "@heroicons/vue/24/outline"
import { onMounted } from "vue"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const features = [
  {
    title: "Trained on Real-World Password Leaks",
    description:
      "The model was trained using a combination of synthetic password datasets and real-world leaked passwords (the RockYou dataset), allowing it to recognize patterns commonly exploited in real cyberattacks.",
    icon: ShieldCheckIcon,
  },
  {
    title: "Deep Learning Password Pattern Detection",
    description:
      "Instead of relying on simple rules, the system uses a deep learning model (BiLSTM) that analyzes passwords character by character to learn structural patterns used in weak and strong passwords.",
    icon: CpuChipIcon,
  },
  {
    title: "Understands Real Attack Patterns",
    description:
      "During training, the model learns common password structures such as repeated characters, predictable sequences, keyboard patterns, and leetspeak transformations used in dictionary attacks.",
    icon: ChartBarIcon,
  },
  {
    title: "Robust Against Dictionary Variations",
    description:
      "The training data includes adversarial password variations such as modified dictionary words (:'p@ssw0rd'). This helps the model detect passwords that appear complex but are still vulnerable to modern cracking techniques.",
    icon: LockClosedIcon,
  },
]
onMounted(() => {
  gsap.fromTo(".about-heading",
    { opacity: 0, y: 55 },
    {
      opacity: 1, y: 0, duration: 2.6, ease: "power1.out",
      scrollTrigger: { trigger: ".about-heading", start: "top 92%", toggleActions: "play none none reverse" }
    }
  )

  gsap.fromTo(".about-subtitle",
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0, duration: 2.4, ease: "sine.out",
      scrollTrigger: { trigger: ".about-subtitle", start: "top 92%", toggleActions: "play none none reverse" }
    }
  )

  gsap.fromTo(".feature-card",
    { opacity: 0, y: 60, scale: 0.97 },
    {
      opacity: 1, y: 0, scale: 1, duration: 2.6, ease: "power1.out",
      stagger: { amount: 0.5, ease: "sine.inOut" },
      scrollTrigger: { trigger: ".features-grid", start: "top 90%", toggleActions: "play none none reverse" }
    }
  )

  gsap.fromTo(".feature-icon",
    { scale: 0, rotate: -15, opacity: 0 },
    {
      scale: 1, rotate: 0, opacity: 1, duration: 1.8, ease: "back.out(1.2)",
      stagger: { amount: 0.5, ease: "sine.inOut" },
      delay: 0.4,
      scrollTrigger: { trigger: ".features-grid", start: "top 90%", toggleActions: "play none none reverse" }
    }
  )

  const cards = document.querySelectorAll(".feature-card")
  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      gsap.to(card, { scale: 1.1, y: -6, duration: 0.5, ease: "power2.out" })
    })
    card.addEventListener("mouseleave", () => {
      gsap.to(card, { scale: 1, y: 0, duration: 0.5, ease: "power2.out" })
    })
  })
})
</script>

<template>
  <section id="aboutUs" class="py-24 text-white">
    <div class="flex flex-col justify-center flex-wrap items-center max-w-7xl mx-auto gap-[2rem] md:gap-[4rem] px-6">

     
      <div class="text-center flex flex-col justify-center items-center">
        <h2 class="about-heading text-[22px] md:text-[36px] font-font-1 font-bold mb-4">
          Why Trust Our <span class="text-[#48EDF9]">AI Model</span>
        </h2>
        <p class="about-subtitle text-[22px] md:text-[22px] font-font-2 text-slate-400 max-w-5xl mx-auto">
          Our password strength analyzer is powered by machine learning techniques
          trained on real password datasets and security research to help detect
          weak credentials before attackers do.
        </p>
      </div>

      
      <div class="features-grid grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="feature-card flex flex-col text-center items-center justify-center bg-slate-900/60 backdrop-blur-md border hover:border-[3px] border-slate-800 rounded-2xl p-6 hover:border-[#48EDF9] cursor-pointer transition-colors duration-300"
        >
        <div class="feature-icon mb-5 w-16 h-16 rounded-2xl bg-cyan-400/10 border border-[#48EDF9]/40 flex items-center justify-center flex-shrink-0"
            style="box-shadow: 0 0 18px rgba(72,237,249,0.12)">
         <component
            :is="feature.icon"
            class="w-10 h-10 text-[#48EDF9]"
          />
        </div>
          <h3 class="text-lg font-semibold mb-2">{{ feature.title }}</h3>
          <p class="text-slate-400 text-md leading-relaxed">{{ feature.description }}</p>
        </div>
      </div>

    </div>
  </section>
</template>