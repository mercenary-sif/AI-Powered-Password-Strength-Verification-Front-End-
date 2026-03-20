<script setup>
import { ref, onMounted } from "vue"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { CpuChipIcon, CircleStackIcon, BeakerIcon, BoltIcon } from "@heroicons/vue/24/outline"

gsap.registerPlugin(ScrollTrigger)

const activeChart = ref("accuracy")

const datasetSources = [
  {
    label: "Rule-Based",
    count: "~350K",
    border: "border-cyan-500/30",
    bg: "bg-cyan-500/5",
    badge: "text-cyan-400",
    badgeBorder: "border-cyan-500/40",
    badgeBg: "bg-cyan-500/10",
    description: "Programmatically generated using strict policies — weak (4–7 chars), medium (8–11), strong (12–20). ~116K passwords per class, each enforcing minimum uppercase, digit, and special character counts via the secrets module.",
    tags: ["~116K per class", "Policy-driven", "cryptographically secure"],
  },
  {
    label: "Adversarial",
    count: "~155K",
    border: "border-orange-500/30",
    bg: "bg-orange-500/5",
    badge: "text-orange-400",
    badgeBorder: "border-orange-500/40",
    badgeBg: "bg-orange-500/10",
    description: "Edge cases engineered to fool rule-based checkers. Five strategies: deceptive weak (looks strong, is weak), keyboard walks, name+year combos, disguised medium, and truly strong passphrases.",
    tags: ["Deceptive weak (≈30%)", "Keyboard walks (≈20%)", "Name+year (≈20%)"],
  },
  {
    label: "RockYou Leaks",
    count: "333K",
    border: "border-red-500/30",
    bg: "bg-red-500/5",
    badge: "text-red-400",
    badgeBorder: "border-red-500/40",
    badgeBg: "bg-red-500/10",
    description: "Stratified sample from the RockYou breach. Strong passwords were relabeled as Medium — real leaked passwords should never teach the model what 'safe' looks like.",
    tags: ["270K Weak", "63K Medium", "Strong → relabeled Medium"],
  },
]

const preprocessingSteps = [
  {
    step: "01",
    title: "Cleaning & Deduplication",
    detail: "Passwords filtered: length 4–30, printable ASCII only, no whitespace. Cross-dataset duplicates dropped globally. Label conflicts — same password with different labels — removed to eliminate noise.",
    icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    step: "02",
    title: "Character-Level Tokenization",
    detail: "Each character mapped to a unique integer starting at index 2. Vocabulary built from the training split only — PAD=0, UNK=1. Characters unseen at inference time map to UNK.",
    icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
  },
  {
    step: "03",
    title: "Padding to MAX_LEN=30",
    detail: "Sequences padded post-sequence to length 30. Longer passwords truncated. This length was chosen to cover ~90% of password lengths in the dataset. mask_zero=True in the Embedding layer propagates the padding mask to the BiLSTM automatically.",
    icon: "M4 6h16M4 12h16M4 18h7",
  },
  {
    step: "04",
    title: "70 / 15 / 15 Split",
    detail: "Stratified split preserving class ratios: 70% train, 15% validation, 15% test. Stratification guarantees proportional Weak/Medium/Strong representation in every split.",
    icon: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z",
  },
  {
    step: "05",
    title: "Oversampling + Uniform Weights",
    detail: "Medium and Strong minority classes upsampled via sklearn resample to match the Weak majority count. Because the training set is now balanced, class weights are set uniformly to 1.0 — no further correction needed.",
    icon: "M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3",
  },
]

const architectureLayers = [
  { name: "Input",     detail: "Integer sequence · MAX_LEN=30",                    color: "#64748b" },
  { name: "Embedding", detail: "VOCAB_SIZE → 64-dim vectors · mask_zero=True",    color: "#48EDF9" },
  { name: "BiLSTM",    detail: "128 units · input_drop=0.3 · recurrent_drop=0.3", color: "#818cf8" },
  { name: "Dense",     detail: "64 units · ReLU activation",                       color: "#48EDF9" },
  { name: "Dropout",   detail: "0.3 rate · post-dense regularization",             color: "#94a3b8" },
  { name: "Softmax",   detail: "3 classes → Weak / Medium / Strong probabilities",  color: "#34d399" },
]

const hyperparams = [
  { label: "Embedding Dim",  value: "64"      },
  { label: "LSTM Units",     value: "128"     },
  { label: "LSTM Dropout",   value: "0.3"     },
  { label: "Recurrent Drop", value: "0.3"     },
  { label: "Dense Dropout",  value: "0.3"     },
  { label: "Batch Size",     value: "128"     },
  { label: "Max Epochs",     value: "15"      },
  { label: "Learning Rate",  value: "1e-3"    },
  { label: "Optimizer",      value: "Adam"    },
  { label: "Loss",           value: "Cat. CE" },
  { label: "Early Stop",     value: "p=3"     },
  { label: "Max Seq Len",    value: "30"      },
]

const allEpochs = [
  { ep: 1,  train: 97.36, val: 98.45, trainLoss: 0.0730, valLoss: 0.0300 },
  { ep: 2,  train: 98.99, val: 98.47, trainLoss: 0.0245, valLoss: 0.0279 },
  { ep: 3,  train: 99.12, val: 99.09, trainLoss: 0.0206, valLoss: 0.0225 },
  { ep: 4,  train: 99.32, val: 99.36, trainLoss: 0.0170, valLoss: 0.0171 },
  { ep: 5,  train: 99.49, val: 99.55, trainLoss: 0.0138, valLoss: 0.0145 },
  { ep: 6,  train: 99.64, val: 99.63, trainLoss: 0.0104, valLoss: 0.0111 },
  { ep: 7,  train: 99.72, val: 99.76, trainLoss: 0.0084, valLoss: 0.0088 },
  { ep: 8,  train: 99.79, val: 99.81, trainLoss: 0.0071, valLoss: 0.0070 },
  { ep: 9,  train: 99.82, val: 99.83, trainLoss: 0.0057, valLoss: 0.0065 },
  { ep: 10, train: 99.85, val: 99.84, trainLoss: 0.0050, valLoss: 0.0061 },
  { ep: 11, train: 99.87, val: 99.86, trainLoss: 0.0046, valLoss: 0.0061 },
  { ep: 12, train: 99.88, val: 99.87, trainLoss: 0.0040, valLoss: 0.0056, best: true },
  { ep: 13, train: 99.88, val: 99.87, trainLoss: 0.0040, valLoss: 0.0058 },
  { ep: 14, train: 99.88, val: 99.87, trainLoss: 0.0045, valLoss: 0.0060 },
  { ep: 15, train: 99.89, val: 99.87, trainLoss: 0.0036, valLoss: 0.0057 },
]

const leetMap = [
  { from: "a", to: "@" }, { from: "e", to: "3" }, { from: "i", to: "1" },
  { from: "o", to: "0" }, { from: "s", to: "$" }, { from: "t", to: "7" },
  { from: "l", to: "1" }, { from: "g", to: "9" }, { from: "b", to: "8" },
]

const CL = 52, CR = 690, CT = 22, CB = 172, STEPS = allEpochs.length - 1
const SX = (CR - CL) / STEPS
function toX(i)    { return CL + i * SX }
const ACC_MIN = 97.3, ACC_MAX = 99.95
function toYacc(v) { return CB - ((v - ACC_MIN) / (ACC_MAX - ACC_MIN)) * (CB - CT) }
const LOSS_MAX = 0.075
function toYloss(v) { return CB - (v / LOSS_MAX) * (CB - CT) }
function pts(fn)  { return allEpochs.map((ep, i) => `${toX(i)},${fn(ep)}`).join(" ") }
function area(fn) { return pts(fn) + ` ${toX(STEPS)},${CB} ${CL},${CB}` }

function animateSection(selector, opts = {}) {
  gsap.fromTo(
    selector,
    { opacity: 0, y: opts.y ?? 45, ...(opts.scale ? { scale: opts.scale } : {}) },
    {
      opacity: 1, y: 0, scale: 1,
      duration: opts.duration ?? 2.6,
      ease: opts.ease ?? "power1.out",
      stagger: opts.stagger ? { amount: opts.stagger, ease: "sine.inOut" } : 0,
      scrollTrigger: {
        trigger: selector,
        start: "top 93%",
        end: "top 48%",
        toggleActions: "play none none reverse",
      },
    }
  )
}

onMounted(() => {
  animateSection(".atm-badge",     { y: 16, duration: 1.8, ease: "sine.out"    })
  animateSection(".atm-heading",   { y: 60, duration: 3.0, ease: "power1.out"  })
  animateSection(".atm-subtitle",  { y: 38, duration: 2.8, ease: "sine.out"    })
  animateSection(".dataset-card",  { y: 70, duration: 3.0, ease: "power1.out", stagger: 0.60 })
  animateSection(".prep-step",     { y: 45, duration: 2.6, ease: "sine.out",   stagger: 0.38 })
  animateSection(".atm-bilstm",    { y: 52, duration: 2.8, ease: "power1.out"  })
  animateSection(".arch-layer",    { y: 28, duration: 2.4, ease: "sine.out",   stagger: 0.26 })
  animateSection(".hyperparam",    { y: 24, duration: 2.2, ease: "sine.out",   stagger: 0.14 })
  animateSection(".acc-card",      { y: 36, duration: 2.4, ease: "power1.out", stagger: 0.22 })
  animateSection(".stability-card",{ y: 30, duration: 2.2, ease: "sine.out",   stagger: 0.18 })
  animateSection(".epoch-row",     { y: 18, duration: 2.0, ease: "sine.out",   stagger: 0.09 })
  animateSection(".adv-layer",     { y: 32, duration: 2.6, ease: "sine.out",   stagger: 0.30 })
  animateSection(".leet-cell",     { y: 24, scale: 0.94,   duration: 2.2, ease: "back.out(1.1)", stagger: 0.18 })
})
</script>

<template>
  <section id="ATM" class="py-28 text-white relative overflow-hidden">

    <div class="absolute top-20 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none"></div>
    <div class="absolute bottom-20 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none"></div>

    <div class="max-w-6xl mx-auto px-6 relative z-10">

      <!-- ── HEADING ── -->
      <div class="text-center mb-20">
        <span class="atm-badge inline-flex items-center gap-2 text-[14px] md:text-[16px] font-font-2 font-semibold tracking-[0.2em] text-[#48EDF9] uppercase mb-5 border border-[#48EDF9]/40 rounded-full px-4 py-1.5 bg-cyan-500/5">
          <CpuChipIcon class="w-6 h-6"/>
          Model Architecture & Training
        </span>
        <h2 class="atm-heading text-[28px] md:text-[42px] font-font-1 font-bold mb-4 leading-tight">
          How the <span class="text-[#48EDF9]">AI Model</span> Actually Works
        </h2>
        <p class="atm-subtitle font-font-2 text-slate-300 text-[16px] md:text-[18px] leading-relaxed max-w-3xl mx-auto">
          A deep dive into the dataset construction, preprocessing pipeline,
          and BiLSTM architecture that powers the password strength classifier.
        </p>
      </div>

      <!-- ── DATASET CONSTRUCTION ── -->
      <div class="mb-24">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-9 h-9 rounded-lg bg-cyan-400/10 border border-[#48EDF9]/20 flex items-center justify-center flex-shrink-0">
            <CircleStackIcon class="w-6 h-6 text-[#48EDF9]"/>
          </div>
          <h3 class="text-[20px] font-font-1 font-bold text-white">Dataset Construction</h3>
          <div class="flex-1 h-px bg-slate-600 ml-2"></div>
          <span class="text-[14px] font-font-2 text-slate-300 border border-slate-600 rounded-full px-3 py-1">~850K unique passwords</span>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          <div v-for="src in datasetSources" :key="src.label"
               class="dataset-card rounded-2xl border p-6 flex flex-col gap-4"
               :class="[src.border, src.bg]">
            <div class="flex items-center justify-between">
              <span class="text-[14px] font-bold font-font-2 tracking-widest uppercase border rounded px-2 py-0.5"
                    :class="[src.badge, src.badgeBorder, src.badgeBg]">{{ src.label }}</span>
              <span class="text-[28px] font-font-1 font-bold" :class="src.badge">{{ src.count }}</span>
            </div>
            <p class="text-[16px] text-slate-400 font-font-2 leading-relaxed">{{ src.description }}</p>
            <div class="flex flex-wrap gap-2 mt-auto">
              <span v-for="tag in src.tags" :key="tag"
                    class="text-[14px] font-font-2 text-slate-300 border border-slate-600 rounded-full px-2.5 py-0.5 bg-slate-900/60">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
        <div class="mt-5 flex items-start gap-3 bg-slate-900/50 border border-slate-700 rounded-xl px-5 py-4">
          <svg class="w-6 h-6 text-[#48EDF9] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z"/>
          </svg>
          <p class="text-[15px] text-slate-400 font-font-2 leading-relaxed">
            After merging all three sources, cross-dataset duplicates and label conflicts were detected and removed. The final dataset was globally shuffled before splitting.
          </p>
        </div>
      </div>

      <!-- ── PREPROCESSING PIPELINE ── -->
      <div class="mb-24">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-9 h-9 rounded-lg bg-cyan-400/10 border border-[#48EDF9]/20 flex items-center justify-center flex-shrink-0">
            <BeakerIcon class="w-6 h-6 text-[#48EDF9]"/>
          </div>
          <h3 class="text-[20px] font-font-1 font-bold text-white">Preprocessing Pipeline</h3>
          <div class="flex-1 h-px bg-slate-600 ml-2"></div>
        </div>
        <div class="grid md:grid-cols-5 gap-4">
          <div v-for="(step, i) in preprocessingSteps" :key="step.step"
               class="prep-step bg-slate-900/60 border border-slate-700 rounded-2xl p-5 flex flex-col items-center text-center gap-3 relative">
            <span class="text-[12px] font-font-1 font-bold text-slate-600 tracking-widest">{{ step.step }}</span>
            <div class="w-9 h-9 rounded-lg bg-cyan-400/10 border border-[#48EDF9]/20 flex items-center justify-center">
              <svg class="w-6 h-6 text-[#48EDF9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round" :d="step.icon"/>
              </svg>
            </div>
            <h4 class="text-[16px] font-font-1 font-semibold text-white leading-snug">{{ step.title }}</h4>
            <p class="text-[14px] text-slate-300 font-font-2 leading-relaxed">{{ step.detail }}</p>
            <div v-if="i < preprocessingSteps.length - 1"
                 class="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-slate-950 border border-slate-600 items-center justify-center">
              <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- ── BILSTM ARCHITECTURE ── -->
      <div class="mb-8">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-9 h-9 rounded-lg bg-cyan-400/10 border border-[#48EDF9]/20 flex items-center justify-center flex-shrink-0">
            <CpuChipIcon class="w-6 h-6 text-[#48EDF9]"/>
          </div>
          <h3 class="text-[20px] font-font-1 font-bold text-white">BiLSTM Architecture</h3>
          <div class="flex-1 h-px bg-slate-700 ml-2"></div>
        </div>

        <div class="grid md:grid-cols-2 gap-8 mb-8">

          <div class="atm-bilstm bg-slate-900/60 border border-slate-700 rounded-2xl p-7 flex flex-col gap-6">
            <p class="text-[16px] text-slate-400 font-font-2 leading-relaxed">
              A <span class="text-white font-semibold">Bidirectional LSTM</span> reads each password both
              <span class="text-[#48EDF9]">forward</span> (left→right) and
              <span class="text-indigo-400">backward</span> (right→left) simultaneously.
              This lets the model capture context from both ends — essential for detecting keyboard
              walks and name+year combos that only reveal their pattern when read in full sequence.
            </p>
            <div class="space-y-2.5">
              <p class="text-[14px] text-slate-400 uppercase tracking-widest font-font-2 mb-3">Layer stack</p>
              <div v-for="layer in architectureLayers" :key="layer.name" class="arch-layer flex items-center gap-3">
                <div class="flex-shrink-0 w-28 text-center text-[12px] font-bold font-font-1 py-1.5 rounded-lg border"
                     :style="{ color: layer.color, borderColor: layer.color + '40', backgroundColor: layer.color + '12' }">
                  {{ layer.name }}
                </div>
                <svg class="w-3 h-3 text-slate-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
                <span class="text-[14px] text-slate-400 font-font-2">{{ layer.detail }}</span>
              </div>
            </div>
            <div class="flex items-start gap-2 pt-4 border-t border-slate-700">
              <svg class="w-5 h-5 text-[#48EDF9] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <p class="text-[14px] text-slate-500 font-font-2 leading-relaxed">
                EarlyStopping (patience=3) monitors val_loss and restores the best weights — training halts automatically before overfitting sets in.
              </p>
            </div>
          </div>

          <div class="bg-slate-900/60 border border-slate-700 rounded-2xl p-7">
            <p class="text-[14px] text-slate-400 uppercase tracking-widest font-font-2 mb-5">Training hyperparameters</p>
            <div class="grid grid-cols-3 gap-3">
              <div v-for="p in hyperparams" :key="p.label"
                   class="hyperparam bg-slate-800/60 border border-slate-600 rounded-xl p-3 text-center">
                <p class="text-[16px] font-font-1 font-bold text-[#48EDF9]">{{ p.value }}</p>
                <p class="text-[12px] text-slate-400 font-font-2 mt-0.5 leading-tight">{{ p.label }}</p>
              </div>
            </div>
          </div>

        </div>

        <!-- ── TRAINING RESULTS ── -->
        <div class="bg-slate-900/60 border border-slate-700 rounded-2xl p-5 md:p-7">

          <!-- Header -->
          <div class="flex items-center gap-3 mb-7">
            <div class="w-9 h-9 rounded-lg bg-cyan-400/10 border border-[#48EDF9]/20 flex items-center justify-center flex-shrink-0">
              <svg class="w-6 h-6 text-[#48EDF9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <div>
              <h4 class="text-[16px] font-font-1 font-semibold text-white">Training Results</h4>
              <p class="text-[13px] font-font-2 text-slate-400">
                15 epochs · Best at epoch 12 · EarlyStopping restored weights
              </p>
            </div>
          </div>

          <!-- ── KPI CARDS — stack on mobile, 3 cols on md+ ── -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div class="acc-card bg-slate-800/60 border border-cyan-500/30 rounded-xl p-4 text-center relative overflow-hidden">
              <div class="absolute inset-0 bg-cyan-500/5 pointer-events-none"></div>
              <p class="text-[12px] font-font-2 text-slate-300 uppercase tracking-widest mb-1">Train Accuracy</p>
              <p class="text-[26px] font-font-1 font-bold text-[#48EDF9] leading-none">99.88<span class="text-[16px]">%</span></p>
              <div class="flex items-center justify-center gap-1.5 mt-1.5">
                <span class="text-[11px] font-font-2 text-slate-400">loss 0.0040 · ep 12</span>
              </div>
            </div>
            <div class="acc-card bg-slate-800/60 border border-indigo-500/30 rounded-xl p-4 text-center relative overflow-hidden">
              <div class="absolute inset-0 bg-indigo-500/5 pointer-events-none"></div>
              <p class="text-[12px] font-font-2 text-slate-400 uppercase tracking-widest mb-1">Val Accuracy</p>
              <p class="text-[26px] font-font-1 font-bold text-indigo-400 leading-none">99.87<span class="text-[16px]">%</span></p>
              <div class="flex items-center justify-center gap-1.5 mt-1.5">
                <span class="text-[11px] font-font-2 text-slate-400">loss 0.0056 · ep 12</span>
              </div>
            </div>
            <div class="acc-card bg-slate-800/60 border border-emerald-500/30 rounded-xl p-4 text-center relative overflow-hidden">
              <div class="absolute inset-0 bg-emerald-500/5 pointer-events-none"></div>
              <p class="text-[12px] font-font-2 text-slate-300 uppercase tracking-widest mb-1">Test Accuracy</p>
              <p class="text-[26px] font-font-1 font-bold text-emerald-400 leading-none">99.87<span class="text-[16px]">%</span></p>
              <div class="flex items-center justify-center gap-1.5 mt-1.5">
                <span class="text-[11px] font-font-2 text-slate-400">loss 0.0044 · unseen</span>
              </div>
            </div>
          </div>

          <!-- ── STABILITY INDICATORS — stack on mobile, 3 cols on md+ ── -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div class="stability-card bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div>
                <p class="text-[11px] font-font-2 text-slate-400 uppercase tracking-widest">Overfitting</p>
                <p class="text-[14px] font-font-1 font-bold text-emerald-400">None detected</p>
              </div>
            </div>
            <div class="stability-card bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-[#48EDF9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
              </div>
              <div>
                <p class="text-[11px] font-font-2 text-slate-400 uppercase tracking-widest">Train / Test Gap</p>
                <p class="text-[14px] font-font-1 font-bold text-[#48EDF9]">0.01%</p>
              </div>
            </div>
            <div class="stability-card bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                </svg>
              </div>
              <div>
                <p class="text-[11px] font-font-2 text-slate-400 uppercase tracking-widest">Generalisation</p>
                <p class="text-[14px] font-font-1 font-bold text-indigo-400">Excellent</p>
              </div>
            </div>
          </div>

          <!-- ── CHART TABS — wrap on mobile ── -->
          <div class="flex flex-wrap items-center gap-2 mb-4">
            <button
              @click="activeChart = 'accuracy'"
              class="px-4 py-1.5 rounded-lg text-[13px] font-font-2 font-semibold transition-all duration-300"
              :class="activeChart === 'accuracy'
                ? 'bg-cyan-500/15 border border-[#48EDF9]/40 text-[#48EDF9]'
                : 'bg-slate-800/60 border border-slate-700 text-slate-500 hover:text-slate-300'"
            >Accuracy Curve</button>
            <button
              @click="activeChart = 'loss'"
              class="px-4 py-1.5 rounded-lg text-[13px] font-font-2 font-semibold transition-all duration-300"
              :class="activeChart === 'loss'
                ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                : 'bg-slate-800/60 border border-slate-700 text-slate-500 hover:text-slate-300'"
            >Loss Curve</button>

            <!-- Legend — wraps below tabs on mobile -->
            <div class="flex items-center gap-3 ml-auto flex-wrap">
              <div class="flex items-center gap-1.5">
                <div class="w-5 h-0.5 rounded-full" :style="{ background: activeChart === 'accuracy' ? '#48EDF9' : '#f97316' }"></div>
                <span class="text-[11px] font-font-2 text-slate-400">Train</span>
              </div>
              <div class="flex items-center gap-1.5">
                <div class="w-5 h-0.5 rounded-full" :style="{ background: activeChart === 'accuracy' ? '#818cf8' : '#ef4444' }"></div>
                <span class="text-[11px] font-font-2 text-slate-400">Val</span>
              </div>
              <div class="flex items-center gap-1.5">
                <div class="w-2.5 h-2.5 rounded-full border border-yellow-400 bg-yellow-400/20"></div>
                <span class="text-[11px] font-font-2 text-slate-400">Best ep 12</span>
              </div>
            </div>
          </div>

          <!-- ── SVG CHART — scrollable wrapper on mobile ── -->
          <div class="bg-slate-800/40 border border-slate-700/50 rounded-xl p-3 md:p-4 mb-6 overflow-x-auto">
            <div class="min-w-[480px]">
              <svg viewBox="0 0 740 200" class="w-full" style="height:180px">
                <defs>
                  <linearGradient id="gTrain" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" :stop-color="activeChart === 'accuracy' ? '#48EDF9' : '#f97316'"/>
                    <stop offset="100%" :stop-color="activeChart === 'accuracy' ? '#48EDF9' : '#f97316'" stop-opacity="0"/>
                  </linearGradient>
                  <linearGradient id="gVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" :stop-color="activeChart === 'accuracy' ? '#818cf8' : '#ef4444'"/>
                    <stop offset="100%" :stop-color="activeChart === 'accuracy' ? '#818cf8' : '#ef4444'" stop-opacity="0"/>
                  </linearGradient>
                </defs>
                <line v-for="y in [42, 82, 122, 162]" :key="y" :x1="CL" :y1="y" :x2="CR" :y2="y" stroke="#1e293b" stroke-width="1"/>
                <template v-if="activeChart === 'accuracy'">
                  <text x="48" y="46"  text-anchor="end" fill="#475569" font-size="10" font-family="monospace">99.9%</text>
                  <text x="48" y="86"  text-anchor="end" fill="#475569" font-size="10" font-family="monospace">99.7%</text>
                  <text x="48" y="126" text-anchor="end" fill="#475569" font-size="10" font-family="monospace">99.5%</text>
                  <text x="48" y="166" text-anchor="end" fill="#475569" font-size="10" font-family="monospace">97.5%</text>
                </template>
                <template v-else>
                  <text x="48" y="46"  text-anchor="end" fill="#475569" font-size="10" font-family="monospace">0.000</text>
                  <text x="48" y="86"  text-anchor="end" fill="#475569" font-size="10" font-family="monospace">0.019</text>
                  <text x="48" y="126" text-anchor="end" fill="#475569" font-size="10" font-family="monospace">0.038</text>
                  <text x="48" y="166" text-anchor="end" fill="#475569" font-size="10" font-family="monospace">0.056</text>
                </template>
                <text v-for="(ep, i) in allEpochs" :key="'xl'+ep.ep" :x="toX(i)" y="195" text-anchor="middle" fill="#475569" font-size="10" font-family="monospace">{{ ep.ep }}</text>
                <polygon :points="activeChart === 'accuracy' ? area(ep => toYacc(ep.train)) : area(ep => toYloss(ep.trainLoss))" fill="url(#gTrain)" opacity="0.18"/>
                <polygon :points="activeChart === 'accuracy' ? area(ep => toYacc(ep.val)) : area(ep => toYloss(ep.valLoss))" fill="url(#gVal)" opacity="0.12"/>
                <polyline :points="activeChart === 'accuracy' ? pts(ep => toYacc(ep.train)) : pts(ep => toYloss(ep.trainLoss))" fill="none" :stroke="activeChart === 'accuracy' ? '#48EDF9' : '#f97316'" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
                <polyline :points="activeChart === 'accuracy' ? pts(ep => toYacc(ep.val)) : pts(ep => toYloss(ep.valLoss))" fill="none" :stroke="activeChart === 'accuracy' ? '#818cf8' : '#ef4444'" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>
                <circle v-for="(ep, i) in allEpochs" :key="'tdc'+ep.ep" :cx="toX(i)" :cy="activeChart === 'accuracy' ? toYacc(ep.train) : toYloss(ep.trainLoss)" :r="ep.best ? 5.5 : 3" :fill="ep.best ? (activeChart === 'accuracy' ? '#48EDF9' : '#f97316') : (activeChart === 'accuracy' ? '#0e7490' : '#92400e')" :stroke="ep.best ? '#fff' : 'none'" :stroke-width="ep.best ? 1.5 : 0"/>
                <circle v-for="(ep, i) in allEpochs" :key="'vdc'+ep.ep" :cx="toX(i)" :cy="activeChart === 'accuracy' ? toYacc(ep.val) : toYloss(ep.valLoss)" :r="ep.best ? 5.5 : 3" :fill="ep.best ? (activeChart === 'accuracy' ? '#818cf8' : '#ef4444') : (activeChart === 'accuracy' ? '#3730a3' : '#7f1d1d')" :stroke="ep.best ? '#fff' : 'none'" :stroke-width="ep.best ? 1.5 : 0"/>
                <line :x1="toX(11)" y1="18" :x2="toX(11)" y2="172" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="5,3" opacity="0.6"/>
                <rect :x="toX(11) + 5" y="18" width="52" height="14" rx="3" fill="#1e293b" stroke="#fbbf24" stroke-width="0.5" opacity="0.8"/>
                <text :x="toX(11) + 31" y="28" text-anchor="middle" fill="#fbbf24" font-size="8.5" font-family="monospace" opacity="0.9">Best ep 12</text>
              </svg>
            </div>
          </div>

          <!-- ── EPOCH TABLE — hidden on mobile, shown on sm+ ── -->
          <div class="hidden sm:block">
            <p class="text-[11px] text-slate-600 uppercase tracking-widest font-font-2 mb-3">Per-epoch breakdown</p>
            <div class="grid grid-cols-[3rem_1fr_4rem_4rem_1fr_4rem_4rem] items-center gap-2 mb-2 px-1">
              <span class="text-[11px] font-font-2 text-slate-500 text-right">Ep</span>
              <span class="text-[11px] font-font-2 text-slate-500 text-center">Train acc</span>
              <span class="text-[11px] font-font-2 text-slate-500 text-right">%</span>
              <span class="text-[11px] font-font-2 text-slate-500 text-right">loss</span>
              <span class="text-[11px] font-font-2 text-slate-500 text-center">Val acc</span>
              <span class="text-[11px] font-font-2 text-slate-500 text-right">%</span>
              <span class="text-[11px] font-font-2 text-slate-500 text-right">loss</span>
            </div>
            <div class="space-y-2">
              <div v-for="ep in allEpochs" :key="ep.ep"
                   class="epoch-row grid grid-cols-[3rem_1fr_4rem_4rem_1fr_4rem_4rem] items-center gap-2 rounded-lg px-1 py-0.5"
                   :class="ep.best ? 'bg-cyan-500/5 border border-cyan-500/20' : 'opacity-70'">
                <span class="text-[11px] font-font-2 text-right" :class="ep.best ? 'text-[#48EDF9] font-bold' : 'text-slate-600'">{{ ep.ep }}{{ ep.best ? ' ★' : '' }}</span>
                <div class="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div class="h-full rounded-full" :style="{ width: ep.train + '%', background: ep.best ? 'linear-gradient(90deg,#48EDF9,#7dd3fc)' : 'linear-gradient(90deg,#0e7490,#0891b2)' }"></div>
                </div>
                <span class="text-[11px] font-font-1 text-right" :class="ep.best ? 'text-[#48EDF9] font-bold' : 'text-slate-600'">{{ ep.train }}%</span>
                <span class="text-[11px] font-font-2 text-right" :class="ep.best ? 'text-slate-400 font-bold' : 'text-slate-600'">{{ ep.trainLoss.toFixed(4) }}</span>
                <div class="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div class="h-full rounded-full" :style="{ width: ep.val + '%', background: ep.best ? 'linear-gradient(90deg,#818cf8,#a5b4fc)' : 'linear-gradient(90deg,#3730a3,#4338ca)' }"></div>
                </div>
                <span class="text-[11px] font-font-1 text-right" :class="ep.best ? 'text-indigo-400 font-bold' : 'text-slate-600'">{{ ep.val }}%</span>
                <span class="text-[11px] font-font-2 text-right" :class="ep.best ? 'text-indigo-400 font-bold' : 'text-slate-600'">{{ ep.valLoss.toFixed(4) }}</span>
              </div>
            </div>
          </div>

          <!-- ── MOBILE EPOCH SUMMARY — shown only on mobile ── -->
          <div class="sm:hidden">
            <p class="text-[11px] text-slate-600 uppercase tracking-widest font-font-2 mb-3">Key epochs</p>
            <div class="space-y-2">
              <div v-for="ep in allEpochs.filter(e => [1, 6, 12, 15].includes(e.ep))" :key="ep.ep"
                   class="rounded-xl px-4 py-3 flex items-center justify-between"
                   :class="ep.best ? 'bg-cyan-500/5 border border-cyan-500/20' : 'bg-slate-800/40 border border-slate-700/50'">
                <div class="flex items-center gap-2">
                  <span class="text-[12px] font-font-2" :class="ep.best ? 'text-[#48EDF9] font-bold' : 'text-slate-500'">
                    Ep {{ ep.ep }}{{ ep.best ? ' ★' : '' }}
                  </span>
                </div>
                <div class="flex items-center gap-4">
                  <div class="text-center">
                    <p class="text-[10px] text-slate-600 font-font-2">Train</p>
                    <p class="text-[13px] font-font-1 font-bold" :class="ep.best ? 'text-[#48EDF9]' : 'text-slate-400'">{{ ep.train }}%</p>
                  </div>
                  <div class="text-center">
                    <p class="text-[10px] text-slate-600 font-font-2">Val</p>
                    <p class="text-[13px] font-font-1 font-bold" :class="ep.best ? 'text-indigo-400' : 'text-slate-400'">{{ ep.val }}%</p>
                  </div>
                  <div class="text-center">
                    <p class="text-[10px] text-slate-600 font-font-2">Val Loss</p>
                    <p class="text-[13px] font-font-1 font-bold" :class="ep.best ? 'text-indigo-400' : 'text-slate-500'">{{ ep.valLoss.toFixed(4) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer notes -->
          <div class="mt-6 pt-5 border-t border-slate-800 grid md:grid-cols-2 gap-4">
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-[#48EDF9] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <p class="text-[13px] text-slate-500 font-font-2 leading-relaxed">
                Train and val accuracy converge tightly at epoch 12 with no measurable gap — zero overfitting. EarlyStopping fired at epoch 15 and restored weights from epoch 12 (lowest val_loss: 0.0056).
              </p>
            </div>
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p class="text-[13px] text-slate-500 font-font-2 leading-relaxed">
                Test accuracy of 99.87% on completely unseen data — matching val accuracy exactly. The 0.01% gap between train and test confirms the model generalises cleanly across all three password classes.
              </p>
            </div>
          </div>

        </div>
      </div>

      <!-- ── ADVERSARIAL TRAINING STRATEGIES ── -->
      <div class="mt-24">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-9 h-9 rounded-lg bg-cyan-400/10 border border-[#48EDF9]/20 flex items-center justify-center flex-shrink-0">
            <BoltIcon class="w-6 h-6 text-[#48EDF9]"/>
          </div>
          <h3 class="text-[20px] font-font-1 font-bold text-white">Adversarial Training Strategies</h3>
          <div class="flex-1 h-px bg-slate-700 ml-2"></div>
        </div>

        <div class="grid md:grid-cols-2 gap-8">

          <div class="adv-layer bg-slate-900/60 border border-slate-700 rounded-2xl p-7">
            <p class="text-[14px] text-slate-500 uppercase tracking-widest font-font-2 mb-5">~155K adversarial — 5 strategies</p>
            <div class="space-y-5">
              <div v-for="s in [
                { name: 'Deceptive Weak',   pct: 48, k: '75K',   detail: 'Common word + case mix + leet + suffix — looks strong but statistically weak',        color: '#ef4444' },
                { name: 'Disguised Medium', pct: 24, k: '37.5K', detail: 'Short passwords (4–6 chars) containing all character types — borderline medium cases', color: '#8b5cf6' },
                { name: 'Truly Strong',     pct: 24, k: '37.5K', detail: 'High-entropy passphrases with mixed casing, digits and symbols',                       color: '#48EDF9' },
                { name: 'Name + Year',      pct: 3,  k: '4.7K',  detail: 'Real-world attack pattern: name followed by a recent year (Ahmed2024!, Karim2025)',    color: '#eab308' },
                { name: 'Keyboard Walks',   pct: 1,  k: '120',   detail: 'Sequential keyboard patterns such as qwerty, 1qaz2wsx, zxcvbn',                       color: '#f97316' },
              ]" :key="s.name" class="space-y-1.5">
                <div class="flex justify-between items-center">
                  <span class="text-[14px] font-font-2 text-slate-300">{{ s.name }}</span>
                  <span class="text-[13px] font-font-1 font-bold" :style="{ color: s.color }">{{ s.k }}</span>
                </div>
                <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div class="h-full rounded-full" :style="{ width: s.pct + '%', backgroundColor: s.color }"></div>
                </div>
                <p class="text-[13px] text-slate-400 font-font-2">{{ s.detail }}</p>
              </div>
            </div>
          </div>

          <div class="bg-slate-900/60 border border-slate-700 rounded-2xl p-7 flex flex-col gap-6">
            <div>
              <p class="text-[14px] text-slate-500 uppercase tracking-widest font-font-2 mb-4">
                Full leet map used in training
                <span class="text-slate-600 normal-case tracking-normal ml-1">(9 substitutions)</span>
              </p>
              <div class="grid grid-cols-3 gap-2">
                <div v-for="l in leetMap" :key="l.from"
                     class="leet-cell bg-slate-800/60 border border-slate-600 rounded-lg p-3 flex items-center justify-center gap-3">
                  <span class="text-[16px] font-font-1 font-bold text-slate-300">{{ l.from }}</span>
                  <svg class="w-3 h-3 text-slate-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                  </svg>
                  <span class="text-[16px] font-font-1 font-bold text-[#48EDF9]">{{ l.to }}</span>
                </div>
              </div>
            </div>

            <div class="bg-slate-800/40 border border-slate-700 rounded-xl p-5 space-y-3">
              <p class="text-[14px] text-slate-400 uppercase tracking-widest font-font-2">Why adversarial data matters</p>
              <div v-for="point in [
                'p@ssw0rd passes most rule checkers — WEAK here (full leet on blacklisted word)',
                'Mohamed@2025 has uppercase, digit & symbol — still WEAK (name+year pattern)',
                '1qaz2wsx looks random — WEAK (keyboard diagonal, flagged by keyboard_walk strategy)',
              ]" :key="point" class="flex items-start gap-2.5">
                <span class="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500/70 flex-shrink-0"></span>
                <p class="text-[14px] text-slate-400 font-font-2 leading-snug">{{ point }}</p>
              </div>
            </div>

            <div class="flex items-start gap-2 pt-1 border-t border-slate-700">
              <svg class="w-5 h-5 text-[#48EDF9] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z"/>
              </svg>
              <p class="text-[14px] text-slate-400 font-font-2 leading-relaxed">
                Deceptive weak passwords received the highest weight (30%) — they are the hardest edge cases and the most dangerous in the real world.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  </section>
</template>