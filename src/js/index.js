import '../sass/style.scss'

import gsap, { Power2 } from 'gsap'
import barba from '@barba/core'
import Scrollbar from 'smooth-scrollbar'
import YTPlayer from 'yt-player'

import PlaneCrash from './planeCrash'
import buildProjects from './buildProjects'

const scroll = Scrollbar.init(document.querySelector('.scroll-container'), {
  damping: .1,
  renderByPixels: false
})
scroll.track.xAxis.element.remove()
scroll.track.yAxis.element.remove() 


let planeCrash

const views = [
  {
    namespace: 'index',
    beforeEnter({ next }) {
      const { container } = next
      const circle = container.querySelector('.me-circle svg')

      const projectsTag = container.querySelector('.projects')
      buildProjects(projectsTag, { count: 2, random: true })

      scroll.addListener(({ offset, limit }) => {
        gsap.set(circle, { rotate: `-${360 * (offset.y / limit.y)}deg` })
      })

      const scrollDown = document.querySelector('.scroll-down')
      scrollDown.addEventListener('click', () => {
        scroll.scrollTo(0, window.innerHeight, 600, {
          easing: Power2.easeInOut,
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

      buildProjects(projectsTag, { random: true })
    },
  },
  {
    namespace: 'project',
    beforeEnter({ next }) {
      const { container } = next

      const projectsTag = container.querySelector('.projects')
      const pageTitle = container.querySelector('.title h2').innerText
      buildProjects(projectsTag, { count: 2, random: true, exclude: pageTitle })
    }
  }
]

const buildVideos = container => {
  const players = container.querySelectorAll('.player')
  players.forEach(playerTag => {
    const videoTag = document.createElement('div')
    videoTag.style.pointerEvents = 'none'
    const videoId = playerTag.getAttribute('data-player-id')
    const ratio = playerTag.getAttribute('data-player-ratio')
    const height = playerTag.offsetWidth / ratio

    const player = new YTPlayer(videoTag, {
      width: '100%',
      height,
      controls: false
    })
    player.load(videoId)
    player.setVolume(100)

    let isPlaying = false
    playerTag.addEventListener('click', () => {
      if (isPlaying) {
        player.pause()
        isPlaying = false
      } else {
        player.play()
        isPlaying = true
      }
    })

    window.addEventListener('resize', () => { 
      player.setSize('100%', playerTag.offsetWidth / ratio)
    })

    playerTag.appendChild(videoTag)
  })
}

barba.init({
  transitions: [
    {
      name: 'go',
      once({ next }) {
        gsap.set(next.container, { alpha: 0 })
        gsap.to(next.container, { alpha: 1, delay: 1 })

        if (next.namespace === 'project') {
          buildVideos(next.container)
        }
      },
      beforeEnter() {
        scrollTo(0, 0)
      },
      enter({ next }) {
        gsap.set(next.container, { alpha: 0 })
        gsap.to(next.container, { alpha: 1 })

        if (next.namespace === 'project') {
          buildVideos(next.container)
        }
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