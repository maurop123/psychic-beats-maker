<script setup>
  import { ref, computed, watch } from 'vue'
  import add from 'date-fns/add'
  import sub from 'date-fns/sub'
  import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'
  import SliderField from './components/SliderField.vue'
  import SingleBeat from './components/SingleBeat.vue'

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

  //Start, then pause tones
  osc1.start()
  osc2.start()
  const paused = ref(false)
  pause()

  const baseFreq = ref( osc1.frequency.value )
  const beatFreq = ref( osc1.frequency.value - osc2.frequency.value )

  watch(baseFreq, base => {
    osc1.frequency.value = base
    osc2.frequency.value = base - beatFreq.value
  })

  watch(beatFreq, beat => {
    osc2.frequency.value = baseFreq.value - beat
  })

  //TIME
  const time = ref(0)

  // Volume
  const volume = ref(50)
  
  // Transition
  const transitionTime = ref(10) //seconds
  //hardcoding for testing
  const baseFreq1 = ref(330)
  const beatFreq1 = ref(4)
  const time1 = ref(0)

  const sequence = [
    {
      base: 440,
      beat: 7,
      _time: 10,
    },
    {
      base: 330,
      beat: 4,
      _time: 10
    }
  ]

  function play() {
    channel1.resume()
    channel2.resume()
    paused.value = false
  }

  function pause() {
    channel1.suspend()
    channel2.suspend()
    paused.value = true
  }

  function delay (ms) {
    return new Promise(res => setTimeout(res, ms))
  }

  let sequenceCount = 0
  async function playSequence() {
    let { base, beat, _time } = sequence[sequenceCount]
    console.log('play sequence', base, beat, _time)
    osc1.frequency.linearRampToValueAtTime(base, channel1.currentTime + 5)
    osc2.frequency.linearRampToValueAtTime(base - beat, channel2.currentTime + 5)
    play()
    await wait(_time * 1000)
    sequenceCount++
    playSequence()
  }

  function wait(ms) {
    return new Promise(res => {
        setTimeout(res, ms);
    });
  }

</script>


<template>
  <div id="app-container" class="flex flex-col items-center justify-center h-full text-white">
    <SingleBeat
      v-model:baseFreq="baseFreq"
      v-model:beatFreq="beatFreq"
      v-model:time="time"
    />

    <div class="text-center mb-4">
      <p v-if="time > 0  && !paused">{{timeLeft}}</p>
      <button @click="playSequence"
        :class="!paused ? 'hidden' : ''"
      >Play</button>
      <button @click="pause"
        :class="paused ? 'hidden' : ''"
      >Pause</button>
    </div>

    <div class="text-center mb-4">
      <button @click="addToSequence"
      >Add To Sequence</button>
    </div>

    <div class="flex flex-col">
      <SliderField label="Transition"
        v-model="transitionTime" max="120"
      />
    </div>
  </div>
</template>


<style scoped>
  button {
    @apply border rounded-md px-1.5 py-0.5;
  }
</style>
