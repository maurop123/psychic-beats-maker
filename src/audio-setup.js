import { AudioContext, StereoPannerNode } from 'standardized-audio-context'

//Channel 1
const channel1 = new AudioContext();
export const ctx = channel1

//Channel 2
const channel2 = new AudioContext();

//Tone 1
export const osc1 = channel1.createOscillator() //default frequency is 440HZ

//Tone 2
export const osc2 = channel2.createOscillator()
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

pause()

//Audio Setup complete

export function pause() {
  channel1.suspend()
  channel2.suspend()
}

export function play() {
  channel1.resume()
  channel2.resume()
}

export default {
  osc1,
  osc2,
  play,
  pause,
  ctx,
}
