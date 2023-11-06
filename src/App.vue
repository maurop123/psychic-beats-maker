<script setup>
  import { ref, computed, watch } from 'vue'
  import add from 'date-fns/add'
  import sub from 'date-fns/sub'
  import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'
  import SliderField from './components/SliderField.vue'

  /* import HelloWorld from './components/HelloWorld.vue' */
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
  osc1.start()
  osc2.start()
  const paused = ref(false)
  pause()

  const baseFreq = ref( osc1.frequency.value )
  const beatFreq = ref( osc1.frequency.value - osc2.frequency.value )

  //FUNCTIONS

  //Resume
  function resume() {
    channel1.resume()
    channel2.resume()
    paused.value = false
    timeStart.value = new Date()
    checkTime()
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

  const showTime = ref(false)
  const time = ref(1)
  const timeStart = ref(new Date())
  const timeLeft = ref('0 seconds')
  //Check time
  setInterval(() => {
    if (paused) {
      checkTime()
      if (timeLeft.value === '0 seconds' || timeLeft.value === '1 seconds') {
        pause()
      }
    }
  }, 1000)
  function checkTime() {
    timeLeft.value = formatDistanceToNowStrict(
      add(timeStart.value, {
        minutes: time.value
      })
    )
  }

  // Volume
  const volume = ref(50)
</script>


<template>
  <div id="app-container" class="flex flex-col items-center justify-center h-full">
    <div id="beat-controls" class="flex flex-col text-white">
      <SliderField label="Volume"
        v-model="volume" max="100"
      />
      <SliderField label="Base Frequency"
        v-model="baseFreq" min="200" max="1100"
      />
      <SliderField label="Beat Frequency"
        v-model="beatFreq" step="0.5"
      />
      <SliderField label="Time"
        v-model="time" max="60"
      >
        <span v-if="time > 0">{{time}} minutes</span>
        <span v-else id="infinitySpan">&infin;</span>
      </SliderField>
    </div>

    <div class="text-center text-white">
      <p v-if="time > 0  && !paused">{{timeLeft}}</p>
      <button @click="resume"
        :class="!paused ? 'hidden' : ''"
      >Play</button>
      <button @click="pause"
        :class="paused ? 'hidden' : ''"
      >Pause</button>
    </div>

  </div>
</template>


<style scoped>
  label, button {
    color: white;
  }

  input {
    margin-bottom: 15px;
  }

  button {
    @apply border rounded-md px-1.5 py-0.5;
  }

  #infinitySpan {
    font-size: 1.7rem;
    line-height: 1rem;
    vertical-align: text-top;
  }

</style>
