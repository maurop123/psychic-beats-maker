import { AudioContext, StereoPannerNode } from 'standardized-audio-context'

export default class BeatPlayer {
	
	constructor() {
		//Channel 1
		this.channel1 = new AudioContext();
		this.ctx = this.channel1

		//Channel 2
		this.channel2 = new AudioContext();

		//Tone 1
		this.osc1 = this.channel1.createOscillator() 

		//Tone 2
		this.osc2 = this.channel2.createOscillator()

		//Base Frequency
		this.baseFrequency = 440

		//Beat Frequency
		this.beatFrequency = 5

		//Channel 1 Left Stereo
		this.leftStereo = new StereoPannerNode(this.channel1)
		this.leftStereo.pan.value = -1 // -1 left side, 0 balanced, 1 right side

		//Channel 2 right Stereo
		this.rightStereo = new StereoPannerNode(this.channel2, { pan: 1}) //shortcut: set pan in creation options

		//Plug the 1st tone into left stereo, and then out channel 1
		this.osc1.connect( this.leftStereo ).connect( this.channel1.destination )

		//Plug the 2nd tone into right stereo, and then out channel 2
		this.osc2.connect( this.rightStereo ).connect( this.channel2.destination )

		//Start, then pause tones
		this.osc1.start()
		this.osc2.start()
		this.channel1.suspend()
		this.channel2.suspend()
		this.paused = true
	}


	pause(ref) {
		this.channel1.suspend()
		this.channel2.suspend()
		this.paused = true
		console.log('paused', this.paused)
		/* ref.value = true */
	}

	play(ref) {
		this.channel1.resume()
		this.channel2.resume()
		this.paused = false
		console.log('paused', this.paused)
		/* ref.value = false */
	}

	changeBaseFrequency(newVal) {
		this.osc1.frequency.value = newVal
		this.osc2.frequency.value = newVal - this.beatFrequency
		this.baseFrequency = newVal
	}

	changeBeatFrequency(newVal) {
		this.osc2.frequency.value = this.osc1.frequency.value - newVal
		this.beatFrequency = newVal
	}
}
	/* export default { */
	/*   osc1, */
	/*   osc2, */
	/*   play, */
	/*   pause, */
	/*   ctx, */
	/* } */
