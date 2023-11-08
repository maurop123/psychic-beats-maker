<script setup>
  import { ref, reactive, computed, watch } from 'vue'
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
  channel1.suspend()
  channel2.suspend()
  const paused = ref(true)

  //Setup complete

  function pause() {
    channel1.suspend()
    channel2.suspend()
    paused.value = true
  }

  function resume() {
    channel1.resume()
    channel2.resume()
    paused.value = false
  }

  const sequence = reactive([
    {
      baseFreq: 440,
      beatFreq: 7,
      time: 3, //seconds
      transition: 0 //seconds
    },
  ])

  /* setInterval(() => console.log('sequence', sequence), 5000) */


  function delay (ms) {
    return new Promise(res => setTimeout(res, ms))
  }

  const activeBeatI = ref(0)
  const timeLeft = ref(0)
  
  async function playSequence() {
    for (let i=0; i<sequence.length; ++i) {
      const { baseFreq, beatFreq, time, transition } = sequence[i]
      console.log('beat', baseFreq, beatFreq, time, transition)
      activeBeatI.value = i+1
      timeLeft.value = time
      osc1.frequency.linearRampToValueAtTime(baseFreq, channel1.currentTime + transition)
      osc2.frequency.linearRampToValueAtTime(baseFreq - beatFreq, channel2.currentTime + transition)
      resume()
      const interval = setInterval(() => {
        timeLeft.value = timeLeft.value - 1
      }, 1000)
      await wait(time * 1000)
      clearInterval(interval)
      if (i === sequence.length-1) pause()
    }
  }

  function wait(ms) {
    return new Promise(res => {
        setTimeout(res, ms);
    });
  }

  function addBeat() {
    sequence.push({
      baseFreq: 330,
      beatFreq: 4,
      time: 60,
      transition: 10,
    })
  }
</script>

<template>
  <div id="app-container" class="flex">
    <div class="flex flex-col items-center justify-center h-full text-white">
      <div v-for="(beat, i) in sequence">
        <hr v-if="i > 0" class="mb-3 mt-1">
        <p v-if="sequence.length > 1"
          class="text-xs text-right m-1 cursor-pointer"
          @click="sequence.splice(i,1)"
        >
          X
        </p>
        <SingleBeat class="mt-3"
          v-model:baseFreq="beat.baseFreq"
          v-model:beatFreq="beat.beatFreq"
        />
        <SliderField label="Duration" unit="s"
          class="mt-1"
          v-if="i < sequence.length -1"
          :modelValue="beat.time"
          @update:modelValue="$emit('update:time', Number($event))"
          max="60"
        />
        <SliderField label="Transition Time" unit="s"
          v-if="i < sequence.length -1"
          :modelValue="transition"
          @update:modelValue="$emit('update:transition', Number($event))"
          max="120"
        />
        <p v-if="sequence.length > 1"
          class="text-sm text-slate-100">
          Beat {{i+1}}
        </p>
    <!--<p v-if="time === 0" class="slider-disclaimer">t = 0 will play indefinitely</p>-->
      </div>

      <div class="flex flex-col text-center mt-6 mb-4" v-if="paused">
        <button @click="addBeat" class="mb-4">
          Add New Beat
        </button>
        <button @click="addBeat"
          v-if="sequence.length > 1"
        > Preview Sequence
        </button>
        <!--<button @click="playSequence"
          :class="!paused ? 'hidden' : ''"
        >Play Sequence</button>
        <button @click="pause"
          :class="paused ? 'hidden' : ''"
        >Pause</button>-->
      </div>
      <div class="text-center mb-4" v-else>
        <p>Beat {{activeBeatI}} : {{timeLeft}} seconds left</p>
      </div>
    </div>
  </div>
</template>

<style>
  button {
    @apply border rounded-md;
  }
</style>

<style scoped>
  button {
    @apply p-1;
  }
</style>
