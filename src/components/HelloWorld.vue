<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div>
    <h1 class="text-red-600">{{ msg }}</h1>
    <h3>
      You’ve successfully created a Vue 3 project
    </h3>
  </div>
</template>

<style scoped>
</style>
