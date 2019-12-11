import gsap from 'gsap'
import imagesLoaded from 'imagesloaded'

export default class PlaneCrash {
  constructor(target) {
    if (!!window.chrome) {
      this.target = target
      this.frames = []
      this.loaded = false
      this.audio = new Audio('../sound/plane-crash.mp3')
      this.setFrames()
      this.listeners()
    }
  }
  setFrames() {
    this.sequence = document.createElement('div')
    this.sequence.classList.add('sequence')
    this.sequence.style.display = 'none'
    
    gsap.set(this.sequence, {alpha: 0})

    document.body.appendChild(this.sequence)
  
    for (var i = 10; i < 120; i++) {
      const image = document.createElement('div')
      const url = `url(images/sequence/plane-crash-${i < 100 ? '0' : ''}${i}.png)`

      gsap.set(image, { css: { backgroundImage: url, opacity: 0 } })

      this.sequence.appendChild(image)
      this.frames.push(image)
    }
  
    imagesLoaded(this.frames, { background: true }, () => {
      this.loaded = true
    })
  }
  listeners() {
    this.target.addEventListener('mouseenter', () => {
      if (this.loaded) this.play()
    })
    this.target.addEventListener('mouseleave', () => {
      if (this.loaded) this.finish()

    })
  }
  play() {
    this.audio.play()
    
    this.sequence.style.display = 'block'
    gsap.to(this.sequence, .3, { alpha: 1 })
    
    let count = 1
    
    this.playing = setInterval(() => {
      if (count > 1) gsap.set(this.frames[count - 1], { alpha: 0 })
      gsap.set(this.frames[count], { alpha: 1 })

      if (count >= 109) {
        this.finish()
      }
      
      count++
    }, 1000/30)
  }
  finish() {
    clearInterval(this.playing)
    gsap.to(this.sequence, .3, {alpha: 0, onComplete: this.reset.bind(this)})
  }
  reset() {
    this.audio.pause()
    this.audio.currentTime = .6

    this.sequence.style.display = 'none'

    this.frames.forEach(frame => {
      gsap.set(frame, { alpha: 0 })
    })
  }
  destroy() {
    this.sequence.remove()
  }
}
