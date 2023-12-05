<script setup>
  import { ref, watch } from 'vue'
  import SliderField from './SliderField.vue'

  //Audio Setup
  import BeatPlayer from '../BeatPlayer.js'
  const beatPlayer = new BeatPlayer()
  const paused = ref(true)

  const props = defineProps([ 'baseFreq', 'beatFreq'])
  const emit = defineEmits([ 'update:baseFreq', 'update:beatFreq', 'update:duration'])

  beatPlayer.changeBaseFrequency(props.baseFreq)
  beatPlayer.changeBeatFrequency(props.beatFreq)

  const base = ref(props.baseFreq)
  const beat = ref(props.beatFreq)

  watch(base, newVal => {
	  beatPlayer.changeBaseFrequency(newVal)
	  emit('update:baseFreq', base)
  })

  watch(beat, newVal => {
    beatPlayer.changeBeatFrequency(newVal)
    emit('update:beatFreq', beat)
  })
</script>

<template>
  <div class="controls flex flex-col text-white">
    <div class="preview group flex flex-row">
      <div class="flex flex-col">
        <SliderField label="Base Frequency" unit="hz"
          v-model="base"
          min="200" max="1100"
		  class="beat-slider"
        />
        <SliderField label="Beat Frequency" unit="hz"
          v-model="beat"
          step="0.25"
		  max="20"
		  class="beat-slider"
        />
      </div>
      <div class="playPauseButton">
        <button @click="beatPlayer.play(paused)" v-if="beatPlayer.paused">
          Preview
        </button>
        <button @click="beatPlayer.pause(paused)" v-else>Pause</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .playPauseButton {
    @apply flex items-center;

    button {
      @apply p-1 ml-5;
    }
  }
</style>

<style>
  .beat-slider input {
    width: 19rem;
  }
</style>
