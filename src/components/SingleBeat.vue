<script setup>
  import { ref, watch } from 'vue'
  import SliderField from './SliderField.vue'

  //Audio Setup
  import {osc1, osc2, play, pause} from '../audio-setup.js'

  const props = defineProps([ 'baseFreq', 'beatFreq'])
  const emit = defineEmits([ 'update:baseFreq', 'update:beatFreq', 'update:time'])

  const paused = ref(true)

  const base = ref(440)
  const beat = ref(7)

  watch(base, newVal => {
    osc1.frequency.value = newVal
    osc2.frequency.value = newVal - beat.value
    emit('update:baseFreq', base)
  })

  watch(beat, newVal => {
    osc2.frequency.value = base.value - newVal
    emit('update:beatFreq', beat)
  })

  function preview() {
    osc1.frequency.value = props.baseFreq
    osc2.frequency.value = props.baseFreq - props.beatFreq
    play()
    paused.value = false
  }
</script>

<template>
  <div class="controls flex flex-col text-white">
    <!--<SliderField label="Volume"
      v-model="volume" max="100"
    />-->
    <div class="preview group flex flex-row">
      <div class="flex flex-col">
        <SliderField label="Base Freq" unit="hz"
          v-model="base"
          min="200" max="1100"
        />
        <SliderField label="Beat Freq" unit="hz"
          v-model="beat"
          step="0.5"
        />
      </div>
      <div class="playPauseButton">
        <button @click="preview" v-if="paused">
          Preview
        </button>
        <button @click="() => {pause();paused=true}" v-else>Pause</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .slider-disclaimer {
    font-size: 0.8rem;
    margin-top: -15px;
    margin-left: 6px;
    @apply mb-4;
  }

  .playPauseButton {
    @apply flex items-center;

    button {
      @apply p-1 ml-5;
    }
  }
</style>
