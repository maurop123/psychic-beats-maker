<script setup>
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

  //Start tones
  osc1.start()
  osc2.start()


  //FUNCTIONS

  //Resume
  /* function resume() { */
  /*   channel1.resume() */
  /*   channel2.resume() */
  /* } */

  /* //Pause */
  /* function pause() { */
  /*   channel1.suspend() */
  /*   channel2.suspend() */
  /* } */

  /* //Update left stereo (channel 1's tone) */
  /* function updateLeftStereo() { */
  /*   const val = document.getElementById("leftStereo").value */
  /*   osc1.frequency.value = val */
  /* } */

  /* //Update right stereo (channel 2's tone) */
  /* function updateRightStereo() { */
  /*   const val = document.getElementById("rightStereo").value */
  /*   osc2.frequency.value = val */
  /* } */
</script>


<template>
  <div class="flex flex-col items-center justify-center h-full">
    <h1>Hello wooorld</h1>
  </div>
</template>


<style scoped>
  h1 {
    color: blue;

    &:hover {
      color: red;
    }
  }
</style>
