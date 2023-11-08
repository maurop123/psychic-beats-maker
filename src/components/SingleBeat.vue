<script setup>
  import SliderField from './SliderField.vue'

  defineProps([ 'baseFreq', 'beatFreq', 'time' ])

  defineEmits([ 'update:baseFreq', 'update:beatFreq', 'update:time' ])
</script>

<template>
    <div id="beat-controls" class="flex flex-col text-white">
      <!--<SliderField label="Volume"
        v-model="volume" max="100"
      />-->
      <!--<SliderField label="Transition"
        v-model="transitionTime" max="120"
      />-->
      <SliderField label="Base Frequency"
        :modelValue="baseFreq" 
        @update:modelValue="$emit('update:baseFreq', Number($event))"
        min="200" max="1100"
      />
      <SliderField label="Beat Frequency"
        :modelValue="beatFreq"
        @update:modelValue="$emit('update:beatFreq', Number($event))"
        step="0.5"
      />
      <SliderField label="Time"
        :modelValue="time"
        @update:modelValue="$emit('update:time', Number($event))"
        max="60"
      >
        <span v-if="time > 0">{{time}} seconds</span>
        <span v-else id="infinitySpan">&infin;</span>
      </SliderField>
      <p v-if="time === 0" class="slider-disclaimer">t = 0 will play indefinitely</p>
    </div>
</template>

<style scoped>
  #infinitySpan {
    font-size: 1.7rem;
    line-height: 1rem;
    vertical-align: text-top;
  }

  .slider-disclaimer {
    font-size: 0.8rem;
    margin-top: -15px;
    margin-left: 6px;
    @apply mb-4;
  }
</style>
