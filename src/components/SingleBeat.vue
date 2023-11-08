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
      <SliderField label="Base Frequency"
        :modelValue="baseFreq" 
        @update:modelValue="x => baseFreq=x"
        min="200" max="1100"
      />
      <SliderField label="Beat Frequency"
        :modelValue="beatFreq"
        @update:modelValue="x => beatFreq=x"
        step="0.5"
      />
      <SliderField label="Time"
        :modelValue="time"
        @update:modelValue="x => time=x"
        max="60"
      >
        <span v-if="time > 0">{{time}} minutes</span>
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
