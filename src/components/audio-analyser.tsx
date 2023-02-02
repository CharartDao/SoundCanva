import React, { Component } from 'react';
import { IAnimation } from "./types"
import { Arcs, IArcsOptions } from "./animations/Arcs";
import { Circles, ICirclesOptions } from "./animations/Circles";
import { Cubes, ICubesOptions } from "./animations/Cubes";
import { Flower, IFlowerOptions } from "./animations/Flower";
import { Glob, IGlobOptions } from "./animations/Glob";
import { Lines, ILinesOptions } from "./animations/Lines";
import { Shine, IShineOptions } from "./animations/Shine";
import { Square, ISquareOptions } from "./animations/Square";
import { Turntable, ITurntableOptions } from "./animations/Turntable";
import { Wave as WaveAnimation, IWaveOptions } from "./animations/Wave";
import { drawerClasses } from '@mui/material';
import BezierEasing from 'bezier-easing';

export type { IArcsOptions, ICirclesOptions, ICubesOptions, IFlowerOptions, IGlobOptions, ILinesOptions, IShineOptions, ISquareOptions, ITurntableOptions, IWaveOptions };

type Props = {
audio: MediaStream | null
};
    
type State = {
    audioData: Uint8Array
};

declare global {
    interface Window {
        webkitAudioContext: typeof AudioContext
        mozAudioContext: typeof AudioContext
    }
}

const amountOfPixelsToAnimate = 1024;
const duration = 10000;
const easing = BezierEasing(0.47, 0, 0.745, 0.715); // Create the easing function based on https://easings.net/en#easeInSine

let left = 0;
let starttime: number | null = null;

export class AudioAnalyser extends React.PureComponent<Props, State> {

    public animations = {
        "Arcs": Arcs,
        "Circles": Circles,
        "Cubes": Cubes,
        "Flower": Flower,
        "Glob": Glob,
        "Lines": Lines,
        "Shine": Shine,
        "Square": Square,
        "Turntable": Turntable,
        "Wave": WaveAnimation
    };
    private _activeAnimations: IAnimation[] = [];

    constructor(props: Props) {
    super(props);

    this.state = { audioData: new Uint8Array(0) };
    this.canvas = React.createRef();
    this.tick = this.tick.bind(this);
    }

    public addAnimation(animation: IAnimation): void {
        this._activeAnimations.push(animation);
    }

    public clearAnimations(): void {
        this._activeAnimations = [];
    }

    audioContext!: AudioContext;
    analyser!: AnalyserNode;
    dataArray!: Uint8Array;
    source!: MediaStreamAudioSourceNode;
    rafId!: number;
    canvas!: React.RefObject<HTMLCanvasElement>;

    componentDidMount() {
        this.audioContext = new (window.webkitAudioContext || window.AudioContext || window.mozAudioContext)();
        console.log("audio context", this.audioContext);
        // the AudioContext is the primary 'container' for all your audio node objects
        if(!this.audioContext) {
        try {
            this.audioContext = new AudioContext();
        } catch(e) {
            alert('Web Audio API is not supported in this browser');
        }
        }
        this.analyser = this.audioContext.createAnalyser();
        console.log("data analyser", this.analyser);
        console.log("data analyser.frequencyBinCount", this.analyser.frequencyBinCount);
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        console.log("data array", this.dataArray);
        this.source = this.audioContext.createMediaStreamSource(this.props.audio!);
        console.log("this.props.audio", this.props.audio);
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
        this.rafId = requestAnimationFrame(this.tick);
    }

    /*function setAnimation(name: string) {
        if (!wave) return;

        wave.clearAnimations();
        let fillColor = (name === "Circles") ? "rgba(0,0,0,0)" : "white";
        // @ts-ignore
        let animation = new wave.animations[name]({ lineColor: "white", fillColor });
        wave?.addAnimation(animation as IAnimation);
    }

    function setPreset(preset: number) {
        wave?.clearAnimations();

        if (preset == 0) {
            wave?.addAnimation(new wave.animations.Wave({
                lineColor: "white",
                lineWidth: 10,
                fillColor: { gradient: ["#FF9A8B", "#FF6A88", "#FF99AC"] },
                mirroredX: true,
                count: 5,
                rounded: true,
                frequencyBand: "base"
            }));
            wave?.addAnimation(new wave.animations.Wave({
                lineColor: "white",
                lineWidth: 10,
                fillColor: { gradient: ["#FA8BFF", "#2BD2FF", "#2BFF88"] },
                mirroredX: true,
                count: 60,
                rounded: true
            }));
            wave?.addAnimation(new wave.animations.Wave({
                lineColor: "white",
                lineWidth: 10,
                fillColor: { gradient: ["#FBDA61", "#FF5ACD"] },
                mirroredX: true,
                count: 25,
                rounded: true,
                frequencyBand: "highs"
            }));
        }
        if (preset == 1) {
            wave?.addAnimation(new wave.animations.Cubes({
                bottom: true,
                count: 60,
                cubeHeight: 5,
                fillColor: { gradient: ["#FAD961", "#F76B1C"] },
                lineColor: "rgba(0,0,0,0)",
                radius: 10
            }));
            wave?.addAnimation(new wave.animations.Cubes({
                top: true,
                count: 60,
                cubeHeight: 5,
                fillColor: { gradient: ["#FAD961", "#F76B1C"] },
                lineColor: "rgba(0,0,0,0)",
                radius: 10
            }));
            wave?.addAnimation(new wave.animations.Circles({
                lineColor: { gradient: ["#FAD961", "#FAD961", "#F76B1C"], rotate: 90 },
                lineWidth: 4,
                diameter: 20,
                count: 10,
                frequencyBand: "base"
            }));
        }
        if (preset == 2) {
            wave?.addAnimation(new wave.animations.Glob({
                fillColor: { gradient: ["#FAD961", "#FAD961", "#F76B1C"], rotate: 45 },
                lineColor: "white",
                glow: { strength: 15, color: "#FAD961" },
                lineWidth: 10,
                count: 45
            }));
            wave?.addAnimation(new wave.animations.Shine({
                lineColor: "#FAD961",
                glow: { strength: 15, color: "#FAD961" },
                diameter: 300,
                lineWidth: 10,
            }));
        }
        if (preset == 3) {
            wave?.addAnimation(new wave.animations.Square({
                lineColor: { gradient: ["#21D4FD", "#B721FF"] }
            }));
            wave?.addAnimation(new wave.animations.Arcs({
                lineWidth: 4,
                lineColor: { gradient: ["#21D4FD", "#B721FF"] },
                diameter: 500,
                fillColor: { gradient: ["#21D4FD", "#21D4FD", "#B721FF"], rotate: 45 }
            }));
        }
    }

                <div className={`__menu-item ${activeAnimation == 0 ? '--active' : ''}`}
                    onClick={() => {
                        setPreset(0);
                        setActiveAnimation(0);
                    }}>
                    <MdStarRate className={"c-icon"} /> Example 1
                </div>

                <div className={`__menu-item ${activeAnimation == 1 ? '--active' : ''}`}
                    onClick={() => {
                        setPreset(1);
                        setActiveAnimation(1);
                    }}>
                    <MdStarRate className={"c-icon"} /> Example 2
                </div>

                <div className={`__menu-item ${activeAnimation == 2 ? '--active' : ''}`}
                    onClick={() => {
                        setPreset(2);
                        setActiveAnimation(2);
                    }}>
                    <MdStarRate className={"c-icon"} /> Example 3
                </div>

                <div className={`__menu-item ${activeAnimation == 3 ? '--active' : ''}`}
                    onClick={() => {
                        setPreset(3);
                        setActiveAnimation(3);
                    }}>
                    <MdStarRate className={"c-icon"} /> Example 4
                </div>
    */

             
  tick (timestamp: number | null){
    if (!starttime) {
        starttime = timestamp;
    }
    
    var runtime = timestamp! - starttime!;

    const relativeProgress = runtime / duration;   
    const easedProgress = easing(relativeProgress);

    left = amountOfPixelsToAnimate * Math.min(easedProgress, 1);

    this.analyser.getByteTimeDomainData(this.dataArray!);
    this.setState({ audioData: this.dataArray });
    console.log("tick audioData1", this.state.audioData);

    const canvas = this.canvas.current;
    const height = canvas!.height;
    const width = canvas!.width;
    const context = canvas!.getContext('2d');

    let x = 0;
    let space = width / this.state.audioData.length;

    const sliceWidth = (width * 1.0) / this.state.audioData.length;

    context!.lineWidth = 20;
    context!.strokeStyle = '#008800';
    context!.clearRect(0, 0, width, height);
    context!.beginPath();
    context!.moveTo(0, height / 2);
    this._activeAnimations.forEach((animation) => {
      animation.draw(this.state.audioData, context!);
  })
  
    if(this.props.audio!.active == true) {
        try {
            this.state.audioData.forEach(item => {
                const y = (item / 255.0) * height;
                //context!.moveTo(space*item, y); //x,y
                context!.lineTo(left, y);
                //context!.lineTo(space*item,height-item); //x,y
                //x += sliceWidth;
                x += 0.0001;
            });
        } catch(e) {
            alert('no audiodata available.');
        }
    }

    context!.lineTo(x, height / 2);
    context!.stroke();
    this.addAnimation(new this.animations.Glob({
      fillColor: {gradient: ["red","blue","green"], rotate: 45},
      lineWidth: 2,
      lineColor: "#880000"
    }));
    console.log("this.props.audio", this.props.audio);
    console.log("runtime < duration 1", runtime < duration);

    //TODO: extend the duration of requestAnimationFrame or replace it to store the whole wave
    //TODO: use x2 props to enable the whole wave visualisation
    if(this.props.audio!.active === true) {
        if(runtime < duration){
            try {
                this.rafId = requestAnimationFrame(this.tick);
                console.log("this.rafId", this.rafId);
                console.log("runtime < duration 2", runtime < duration);
            } catch(e) {
                alert('no audiodata available.');
            }
        }else{
            const amountOfPixelsToAnimate = 1024;
            const duration = 10000;
            const easing = BezierEasing(0.47, 0, 0.745, 0.715); // Create the easing function based on https://easings.net/en#easeInSine
            let left = 0;
            let starttime: number | null = null;
            var runtime = 0;
            console.log("runtime < duration 3", runtime < duration);
            this.rafId = requestAnimationFrame(this.tick);
            console.log("this.rafId2", this.rafId);
        }
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.rafId);
    this.analyser.disconnect();
    this.source.disconnect();
    this.clearAnimations();
  }

  render() {
    return <canvas width="3000" height="300" ref={this.canvas} />;
  }
}

export default AudioAnalyser;
