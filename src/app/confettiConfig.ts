import { ISourceOptions, RecursivePartial } from "tsparticles-engine";
import { IEmitter } from "tsparticles-plugin-emitters/types/Options/Interfaces/IEmitter";

export const confettiEmitter: RecursivePartial<IEmitter> = {
  autoPlay: true,
  fill: true,
  life: {
    wait: false,
    count: 8,
    delay: 0.2,
    duration: 0.1,
  },
  rate: {
    quantity: 150,
    delay: 0.1,
  },
  shape: "square",
  startCount: 0,
  size: {
    mode: "percent",
    height: 0,
    width: 0,
  },
  name: "customConfetti",
  particles: {},
};

export const confettiConfig: ISourceOptions = {
  fullScreen: {
    zIndex: 1,
  },
  particles: {
    number: {
      value: 0,
    },
    color: {
      value: ["#00FFFC", "#FC00FF", "#fffc00"],
    },
    shape: {
      type: ["circle", "square"],
      options: {},
    },
    opacity: {
      value: 1,
      animation: {
        enable: true,
        minimumValue: 0,
        speed: 2,
        startValue: "max",
        destroy: "min",
      },
    },
    size: {
      value: 4,
      random: {
        enable: true,
        minimumValue: 2,
      },
    },
    links: {
      enable: false,
    },
    life: {
      duration: {
        sync: true,
        value: 5,
      },
      count: 1,
    },
    move: {
      enable: true,
      // gravity: {
      //   enable: false,
      // },
      speed: {
        min: 10,
        max: 20,
      },
      decay: 0.1,
      direction: "none",
      straight: false,
      outModes: {
        default: "destroy",
        top: "none",
      },
    },
    rotate: {
      value: {
        min: 0,
        max: 360,
      },
      direction: "random",
      move: true,
      animation: {
        enable: true,
        speed: 60,
      },
    },
    tilt: {
      direction: "random",
      enable: true,
      move: true,
      value: {
        min: 0,
        max: 360,
      },
      animation: {
        enable: true,
        speed: 60,
      },
    },
    roll: {
      darken: {
        enable: true,
        value: 25,
      },
      enable: true,
      speed: {
        min: 15,
        max: 25,
      },
    },
    wobble: {
      distance: 30,
      enable: true,
      move: true,
      speed: {
        min: -15,
        max: 15,
      },
    },
  },
  emitters: confettiEmitter,
  // duration: 3,
  detectRetina: true,
};
