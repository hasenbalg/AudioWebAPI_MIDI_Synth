class Synth{
  private key_freq_mapping: any;

  private audioContext: AudioContext;
  private gain: GainNode;
  private oscs : OscillatorNode[];
  private wave_forms: string[] = ['sine', 'square', 'sawtooth', 'triangle'];

  private distortion : WaveShaperNode;

  constructor(window:any){
    this.audioContext = new(window.AudioContext || window.webkitAudioContext)();
    this.gain = this.audioContext.createGain();
    this.gain.gain.value = 1;



    this.oscs = new Array<OscillatorNode>();
    this.oscs[0] = this.audioContext.createOscillator();
    this.oscs[0].type = this.wave_forms[0];
    this.oscs[0].frequency.value = 0; //start silent
    this.oscs[0].detune.value = 0;
    this.oscs[0].connect(this.gain);
    this.oscs[0].start(0);

    this.oscs[1] = this.audioContext.createOscillator();
    this.oscs[1].type = this.wave_forms[0];
    this.oscs[1].frequency.value = 0; //start silent
    this.oscs[1].detune.value = 0;
    this.oscs[1].connect(this.gain);
    this.oscs[1].start(0);

    this.oscs[2] = this.audioContext.createOscillator();
    this.oscs[2].type = this.wave_forms[0];
    this.oscs[2].frequency.value = 0; //start silent
    this.oscs[2].detune.value = 0;
    this.oscs[2].connect(this.gain);
    this.oscs[2].start(0);

    this.gain.connect(this.audioContext.destination);
  
  }

  public play_tone(freq:number){

    for(var i = 0; i < this.oscs.length; i++){
      if(this.oscs[i].frequency.value == 0){
        this.oscs[i].frequency.value = freq;
        return;
      }
    }
  }

  public stop_tone(freq:number){
    for(var i = 0; i < this.oscs.length; i++){
      if(parseFloat(this.oscs[i].frequency.value.toFixed(4)) == freq){
        this.oscs[i].frequency.value = 0;
        // this.oscs[i].frequency.value = 17000;
        return;
      }
    }
  }

  public change_freq(freq:number){
    this.oscs[0].frequency.value = freq;
    return this.oscs[0].frequency.value;
  }

  public dail_control(dail:number, value:number){
    switch (dail) {
      case 14:
      //wave form
      var x = Math.ceil((value/127) * this.wave_forms.length)-1
      for(var i = 0; i < this.oscs.length; i++){
        this.oscs[i].type = this.wave_forms[x];
      }
      break;
      case 15:
        //destortion
        this.distortion.curve = this.make_distortion_curve(value);
        this.distortion.oversample = '4x';

      break;
      default:
    }

  }

  private make_distortion_curve(amount:number) {
    var      n_samples = 44100,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180,
    x;
    for ( var i = 0; i < n_samples; ++i ) {
      x = i * 2 / n_samples - 1;
      curve[i] = ( 3 + amount ) * amount * 20 * deg / ( Math.PI + amount * Math.abs(x) );
    }
    return curve;
  }



}
