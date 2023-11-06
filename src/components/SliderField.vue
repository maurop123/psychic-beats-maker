<script setup>
  defineProps(['label', 'min', 'max', 'step', 'modelValue'])
  defineEmits(['update:modelValue'])
</script>

<template>
  <label>{{label}}
    <span class="fieldValue">
      <slot>
        {{modelValue}}
      </slot>
    </span>
  </label>
  <input
    type="range"
    :min="min || '0'"
    :max="max || '10'"
    :step="step || '1'"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<style scoped>
  .fieldValue {
    float: right;
  }
</style>
