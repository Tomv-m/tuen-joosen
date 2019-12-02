import '../sass/style.scss'

import gsap from 'gsap'
import PlaneCrash from './planeCrash'


let scrollPos = window.pageXOffset
let scrollHeight = document.body.offsetHeight - window.innerHeight
const circle = document.querySelector('.me-circle svg')

window.addEventListener('resize', () => {
  scrollHeight = document.body.offsetHeight - window.innerHeight
})

window.addEventListener('scroll', () => {
  scrollPos = window.pageYOffset

  gsap.to(circle, .8, { rotate: `-${360 * (scrollPos / scrollHeight)}deg` })
})

const scrollDown = document.querySelector('.scroll-down')
scrollDown.addEventListener('click', () => {
  window.scrollTo({
    top: window.innerHeight,
    behavior: 'smooth'
  })
})

new PlaneCrash(circle)