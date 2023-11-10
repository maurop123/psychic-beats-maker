<script setup>
  import { ref, reactive, computed, watch } from 'vue'
  import SliderField from './components/SliderField.vue'
  import SingleBeat from './components/SingleBeat.vue'

  //Audio Setup
  import {osc1, osc2, play, pause as _pause, ctx} from './audio-setup.js'

  const paused = ref(true)

  function pause() {
    paused.value = true
    _pause()
  }

  // Track
  const sequence = reactive([
    {
      baseFreq: 440,
      beatFreq: 7,
      time: 3, //seconds
      transition: 10 //seconds
    },
  ])

  /* setInterval(() => console.log('sequence', sequence), 5000) */


  function delay (ms) {
    return new Promise(res => setTimeout(res, ms))
  }

  let timeout
  function startTrack() {
    const { baseFreq, beatFreq, time, transition } = sequence[0]
    osc1.frequency.value = baseFreq
    osc2.frequency.value = baseFreq - beatFreq
    play()
    paused.value = false
    timeout = setTimeout(() => {
      if (sequence.length > 1) {
        playNextBeat(1)
      } else {
        pause()
      }
    }, (time+transition)*1000)
  }

  function playNextBeat(i) {
    const { baseFreq, beatFreq, time, transition } = sequence[i]
    osc1.frequency.linearRampToValueAtTime(baseFreq, ctx.currentTime + transition)
    osc2.frequency.linearRampToValueAtTime(baseFreq - beatFreq, ctx.currentTime + transition)

    timeout = setTimeout(() => {
      if (i < sequence.length - 1) {
        playNextBeat(i+1)
      } else {
        pause()
      }
    }, (time+transition)*1000)
  }

  function pauseTrack() {
    clearTimeout(timeout)
    pause()
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
      play()
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
  <div id="app-container" class="flex mt-8">
    <div class="flex flex-col items-center justify-center h-full text-white">
      <div v-for="(beat, i) in sequence">
        <hr v-if="i > 0" class="mb-3 mt-1">
        <div class="flex flex-row justify-between">
          <u v-if="sequence.length > 1"
            class="text-sm text-slate-300">
            Beat {{i+1}}
          </u>
          <p v-if="sequence.length > 1"
            class="text-xs text-right m-1 cursor-pointer"
            @click="sequence.splice(i,1)"
          >
            X
          </p>
        </div>
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
        <SliderField label="Transition" unit="s"
          v-if="i < sequence.length -1"
          :modelValue="transition"
          @update:modelValue="$emit('update:transition', Number($event))"
          max="120"
        />
    <!--<p v-if="time === 0" class="slider-disclaimer">t = 0 will play indefinitely</p>-->
      </div>

      <div class="flex flex-col text-center mt-6 mb-4">
        <button @click="addBeat" class="mb-4"
          v-if="paused">
          Add New Beat
        </button>
        <button @click="startTrack(0)"
          v-if="sequence.length > 1 && paused"
        > Play Track
        </button>
        <button @click="pauseTrack"
          v-else-if="sequence.length > 1 && !paused"
        > Pause Track
        </button>
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
