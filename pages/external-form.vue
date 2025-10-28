<template>
  <div id="myFormContainer" style="height: 100vh;"></div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const script = document.createElement('script')
  script.src = "https://taskforge-inline.vercel.app/widget/inline.js"
  script.dataset.width = '100%'
  script.dataset.height = '100%'
  script.dataset.requestId = '87aace11-1b59-41f6-8c61-5dcc0db3f69a'
  script.dataset.targetId = 'myFormContainer'

  document.getElementById('myFormContainer').appendChild(script)
})
</script>
