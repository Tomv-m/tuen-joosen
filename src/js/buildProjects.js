import projectsData from './data/projects'

export default (el, options) => {
  el.innerHTML = ''
  let data = [...projectsData]

  if (options !== undefined) {
    const random = options.random
    const exclude = options.exclude
    const count = options.count
    const filter = options.filter

    if (random) {
      data = data.sort(() => Math.random() - 0.5)
    }
    
    if (exclude) {
      data = data.filter(({ title }) => title !== exclude)
    }
    
    if (!isNaN(count)) {
      data = data.slice(0, count)
    }

    if (filter === 'overig') {
      data = data.filter(({ category }) => category !== 'website' && category !== 'video')
    } else if (filter === 'website') {
      data = data.filter(({ category }) => category === 'website')
    } else if (filter === 'video') {
      data = data.filter(({ category }) => category === 'video')
    }
  }
  
  data.forEach(({ imageName, title, category, link }) => {
    const projectTag = document.createElement('a')
    projectTag.href = link
    projectTag.className = 'project'
    projectTag.innerHTML = `
      <img src="/images/projects/${imageName}.jpg"
      srcset="/images/projects/${imageName}.jpg 1x, /images/projects/${imageName}-2x.jpg 2x" alt="${title}">
      <div class="project__info">
        <h3>${title}</h3>
        <span class="category">${category}</span>
      </div>
    `
    el.appendChild(projectTag)
  })
}