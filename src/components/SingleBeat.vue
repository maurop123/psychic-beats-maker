<script setup>
  import SliderField from './SliderField.vue'

  defineProps([ 'baseFreq', 'beatFreq', 'time', 'transition', 'noShowTransition' ])

  defineEmits([ 'update:baseFreq', 'update:beatFreq', 'update:time' ])
</script>

<template>
    <div id="beat-controls" class="flex flex-col text-white">
      <!--<SliderField label="Volume"
        v-model="volume" max="100"
      />-->
      <div v-if="!noShowTransition">
        <hr class="mb-7 mt-4">
        <SliderField label="Transition" unit="s"
          :modelValue="transition"
          @update:modelValue="$emit('update:transition', Number($event))"
          max="120"
        />
      </div>
      <SliderField label="Base Frequency" unit="hz"
        :modelValue="baseFreq" 
        @update:modelValue="$emit('update:baseFreq', Number($event))"
        min="200" max="1100"
      />
      <SliderField label="Beat Frequency" unit="hz"
        :modelValue="beatFreq"
        @update:modelValue="$emit('update:beatFreq', Number($event))"
        step="0.5"
      />
      <SliderField label="Time" unit="s"
        :modelValue="time"
        @update:modelValue="$emit('update:time', Number($event))"
        max="60"
      />
      <!--<p v-if="time === 0" class="slider-disclaimer">t = 0 will play indefinitely</p>-->
    </div>
</template>

<style scoped>
  .slider-disclaimer {
    font-size: 0.8rem;
    margin-top: -15px;
    margin-left: 6px;
    @apply mb-4;
  }
</style>
