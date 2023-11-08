<script setup>
  import { ref } from 'vue'
  import SliderField from './SliderField.vue'

  defineProps([ 'baseFreq', 'beatFreq', 'time', 'transition', 'noShowTransition' ])

  defineEmits([ 'update:baseFreq', 'update:beatFreq', 'update:time' ])

  // Setup Audio
  import { AudioContext, StereoPannerNode } from 'standardized-audio-context'

  //Channel 1
  const channel1 = new AudioContext();

  //Channel 2
  const channel2 = new AudioContext();

  //Tone 1
  const osc1 = channel1.createOscillator() //default frequency is 440HZ

  //Tone 2
  const osc2 = channel2.createOscillator()
  osc2.frequency.value = 433

  //Channel 1 Left Stereo
  const leftStereo = new StereoPannerNode(channel1)
  leftStereo.pan.value = -1 // -1 left side, 0 balanced, 1 right side

  //Channel 2 right Stereo
  const rightStereo = new StereoPannerNode(channel2, { pan: 1}) //shortcut: set pan in creation options

  //Plug the 1st tone into left stereo, and then out channel 1
  osc1.connect(leftStereo).connect(channel1.destination)

  //Plug the 2nd tone into right stereo, and then out channel 2
  osc2.connect(rightStereo).connect(channel2.destination)

  //Start oscillators
  osc1.start()
  osc2.start()

  //Pause channels
  channel1.suspend()
  channel2.suspend()
  const paused = ref(true)

  function preview() {
    channel1.resume()
    channel2.resume()
    paused.value = false 
  }

  function pause() {
    channel1.suspend()
    channel2.suspend()
    paused.value = true
  }
 
</script>

<template>
  <div class="controls flex flex-col text-white">
    <!--<SliderField label="Volume"
      v-model="volume" max="100"
    />-->
    <div class="preview group flex flex-row">
      <div class="flex flex-col">
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
      </div>
      <div class="playPauseButton">
        <button @click="preview" v-if="paused">
          Preview
        </button>
        <button @click="pause" v-else>Pause</button>
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
