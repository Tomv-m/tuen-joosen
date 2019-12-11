import '../sass/style.scss'

import gsap from 'gsap'
import barba from '@barba/core'

import PlaneCrash from './planeCrash'
import buildProjects from './buildProjects'

let planeCrash

const views = [
  {
    namespace: 'index',
    beforeEnter({ next }) {
      const { container } = next
      let scrollPos = window.pageXOffset
      let scrollHeight = document.body.offsetHeight - window.innerHeight
      const circle = container.querySelector('.me-circle svg')

      const projectsTag = container.querySelector('.projects')
      buildProjects(projectsTag, { count: 2 })

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

      planeCrash = new PlaneCrash(circle)
    },
    beforeLeave() {
      planeCrash.destroy()
    }
  },
  {
    namespace: 'werk',
    beforeEnter({ next }) {
      const { container } = next
      const werkTag = container.querySelector('.werk')
      const filterButtons = werkTag.querySelectorAll('button.werk-filter-button')
      const projectsTag = werkTag.querySelector('.projects')

      filterButtons.forEach(button => {
        button.addEventListener('click', () => {
          gsap.to(projectsTag, .4, {
            alpha: 0, onComplete: () => {
              buildProjects(projectsTag, { filter: button.value })
              gsap.to(projectsTag, .4, { alpha: 1 })
            }
          })
          filterButtons.forEach(item => {
            item.classList.remove('active')
          })
          button.classList.add('active')
        })
      })

      buildProjects(projectsTag)
    },
  },
]

barba.init({
  transitions: [
    {
      name: 'go',
      once({ next }) {
        gsap.set(next.container, { alpha: 0 })
        gsap.to(next.container, { alpha: 1, delay: 1 })
      },
      beforeEnter() {
        scrollTo(0, 0)
      },
      enter({ next }) {
        gsap.set(next.container, { alpha: 0 })
        gsap.to(next.container, { alpha: 1 })
      },
      beforeLeave({ current }) {
        return new Promise(resolve => {
          gsap.to(current.container, {
            alpha: 0, onComplete: () => {
              current.container.remove()
              resolve()
            }
          })
        })
      },
    }
  ],
  views
})