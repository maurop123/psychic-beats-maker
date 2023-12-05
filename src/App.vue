<script setup>
  import { ref, reactive, computed, watch } from 'vue'
  import SliderField from './components/SliderField.vue'
  import SingleBeat from './components/SingleBeat.vue'

  //Audio Setup
  import BeatPlayer from './BeatPlayer.js'
  const beatPlayer = new BeatPlayer()
  const {osc1, osc2, play, pause, ctx} = beatPlayer

  const paused = ref(true)

  function _pause() {
    paused.value = true
    pause()
  }

  // Track
  const sequence = reactive([
    {
      baseFreq: 330,
      beatFreq: 5,
      duration: {
	    minutes: 1,
		seconds: 0
	  },
      transition: {
	    minutes: 0,
		seconds: 10
	  },
	  id: 0
    },
  ])

  /* setInterval(() => console.log('sequence', sequence), 5000) */


  function delay (ms) {
    return new Promise(res => setTimeout(res, ms))
  }

  let timeout
  function startTrack() {
    const { baseFreq, beatFreq, duration, transition } = sequence[0]
	const _duration = duration.minutes*60 + duration.seconds
	const _transition = transition.minutes*60 + transition.seconds
    osc1.frequency.value = baseFreq
    osc2.frequency.value = baseFreq - beatFreq
    play()
    paused.value = false
    timeout = setTimeout(() => {
      if (sequence.length > 1) {
        playNextBeat(1)
      } else {
        _pause()
      }
    }, (_duration+_transition)*1000)
  }

  function playNextBeat(i) {
    const { baseFreq, beatFreq, duration, transition } = sequence[i]
	const _duration = duration.minutes*60 + duration.seconds
	const _transition = transition.minutes*60 + transition.seconds
    osc1.frequency.linearRampToValueAtTime(baseFreq, ctx.currentTime + _transition)
    osc2.frequency.linearRampToValueAtTime(baseFreq - beatFreq, ctx.currentTime + _transition)

    timeout = setTimeout(() => {
      if (i < sequence.length - 1) {
        playNextBeat(i+1)
      } else {
        _pause()
      }
    }, (_duration+_transition)*1000)
  }

  function pauseTrack() {
    clearTimeout(timeout)
    _pause()
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
      duration: {
	    minutes: 0,
		seconds: 30
	  },
      transition: {
	    minutes: 0,
		seconds: 10
	  },
	  id: (new Date()).getTime()
    })
  }
</script>

<template>
  <div id="app-container" class="flex mt-8">
    <div class="flex flex-col items-center justify-center h-full text-white">

      <div v-for="(beat, i) in sequence" :key="beat.id" :name="`beat-${beat.id}`">
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

		<div v-if="i < sequence.length - 1">
			<div class="flex flex-row justify-between mb-4">
				<label>Beat Duration</label>
				<div class="flex flex-row">
					<div>
						<input type="number"
							class="ml-3"
							v-model="beat.duration.minutes"
						>
						<span>min</span>
					</div>
					<div>
						<input type="number"
							class="ml-3"
							v-model="beat.duration.seconds"
						>
						<span>sec</span>
					</div>
				</div>
			</div>
			<div class="flex flex-row justify-between w-full mb-4">
				<label>Transition</label>
				<div class="flex flex-row">
					<div>
						<input type="number"
							class="ml-3"
							v-model="beat.transition.minutes"
						>
						<span>min</span>
					</div>
					<div class="justify-self-end">
						<input type="number"
							class="ml-3"
							v-model="beat.transition.seconds"
						>
						<span>sec</span>
					</div>
				</div>
			</div>
		</div>
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

  .flex-row input {
	height: 1.5rem;
	width: 3rem;
	background-color: #232327;
	color: white;
	border-radius: 7px;
	border-color: #0c0c0d;
	border-width: 1px;
	appearance: textfield;
	@apply mx-2;
	text-align: center;
  }
</style>
