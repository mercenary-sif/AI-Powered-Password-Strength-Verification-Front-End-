<script setup>
</script>

<template>
  <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">

    <div class="flex flex-col items-center gap-6">


      <div class="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>

      <div class="text-center">
        <p class="text-[18px] font-font-1 text-white font-semibold">
          Analyzing Password
        </p>

        <p class="text-[14px] font-font-2 text-slate-400 mt-1">
          Running BiLSTM model against 850K learned attack patterns...
        </p>
      </div>

    </div>

  </div>
</template>