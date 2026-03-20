<script setup>
import { ref , watch , nextTick } from "vue"
import {NavBar , WTU , Footer , Loading , ErrorMsg} from './components/export.js'
import {Header , CTP , ATM , Analysis} from './containers/export.js'
const loading = ref(false)
const result = ref(null)
const error   = ref(null)
const analysisRef = ref(null)  
const ctpRef = ref(null)  

const handleLoading = (val) => {
  loading.value = val
}

const handleResult = (data) => {
  result.value = data
  loading.value = false
}

const handleRetry = async () => {
  error.value  = null
  result.value = null
  await nextTick()
  setTimeout(() => {
    document.getElementById("CTP")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, 100)
}
const handleError = (err) => {
  error.value   = err
  loading.value = false
}

watch(loading, (val) => {
  if (!val && result.value) {
    setTimeout(() => {
      document.getElementById("AR")?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)
  }
})

</script>

<template>
  <div class="min-h-full bg-gradient-to-br bg-slate-950">
  <NavBar msg="Vite + Vue"
  :hasResult="!!result" />
  
  <Header msg="Vite + Vue"
  :hasResult="!!result"
  @reset="handleRetry" />
  <WTU msg="Vite + Vue" />

  <Loading v-if="loading" />
  <ErrorMsg
      v-if="error && !loading"
      :message="error.message"
      :code="error.code"
      @retry="handleRetry"
    />
    
  <CTP
      v-if="!result"
      @loading="handleLoading"
      @result="handleResult"
       @error="handleError"
       ref="ctpRef"
    />

    
    <Analysis
      v-if="result && !loading"
      :result="result"
      ref="analysisRef"
      @reset="result = null"
    />
  <ATM msg="Vite + Vue" />
  <Footer msg="Vite + Vue" />
  </div>

</template>

