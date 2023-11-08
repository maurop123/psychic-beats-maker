<script setup>
  import { ref } from 'vue'

  import { AudioContext, StereoPannerNode } from 'standardized-audio-context'

  //Channel 1
  const channel1 = new AudioContext();

  //Channel 2
  const channel2 = new AudioContext();

  //Tone 1
  const osc1 = channel1.createOscillator() //default frequency is 440HZ

  //Tone 2
  const osc2 = channel2.createOscillator()
  osc2.frequency.value = 435

  //Channel 1 Left Stereo
  const leftStereo = new StereoPannerNode(channel1)
  leftStereo.pan.value = -1 // -1 left side, 0 balanced, 1 right side

  //Channel 2 right Stereo
  const rightStereo = new StereoPannerNode(channel2, { pan: 1}) //shortcut: set pan in creation options

  //Plug the 1st tone into left stereo, and then out channel 1
  osc1.connect(leftStereo).connect(channel1.destination)

  //Plug the 2nd tone into right stereo, and then out channel 2
  osc2.connect(rightStereo).connect(channel2.destination)

  //Start, then pause tones
  const paused = ref(false)
  osc1.start()
  osc2.start()
  pause()

  const baseFreq = ref( osc1.frequency.value )
  const beatFreq = ref( osc1.frequency.value - osc2.frequency.value )

  //FUNCTIONS

  //Resume
  function resume() {
    channel1.resume()
    channel2.resume()
    paused.value = false
  }

  //Pause
  function pause() {
    channel1.suspend()
    channel2.suspend()
    paused.value = true
  }

  //Update left stereo (channel 1's tone)
  function updateBaseFreq(val) {
    baseFreq.value = val
    updateTwoTones()
  }

  //Update right stereo (channel 2's tone)
  function updateBeatFreq(val) {
    beatFreq.value = val
    updateTwoTones()
  }

  function updateTwoTones() {
    osc1.frequency.value = baseFreq.value
    osc2.frequency.value = baseFreq.value - beatFreq.value
  }
</script>

<template>
  <div id="main-group" class="flex flex-col items-center justify-center h-full">
    <label>Base Frequency: {{baseFreq}}</label>
    <input
      type="range"
      min="100"
      max="500"
      :value="baseFreq"
      @change="e => updateBaseFreq(e.target.value)"
    />
    <label>Beat Frequency: {{beatFreq}}</label>
    <input
      type="range"
      min="0"
      max="10"
      step="0.5"
      :value="beatFreq"
      @input="e => updateBeatFreq(e.target.value)"
    />
    <button :class="paused ? 'block' : 'hidden'"
      @click="resume">Play</button>
    <button :class="paused ? 'hidden' : 'block'"
      @click="pause">Pause</button>
  </div>
</template>

<style scoped>
  h1 {
    color: blue;

    &:hover {
      color: red;
    }
  }

  label, button {
    color: white;
  }

  input {
    margin-bottom: 15px;
  }

  button {
    @apply border rounded-md px-1.5 py-0.5;
  }
</style>
