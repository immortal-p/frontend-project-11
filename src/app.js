import * as yup from 'yup'
import i18next from 'i18next'
import resources from './locales/ru.js'
import watch from './view.js'
import axios from 'axios'
import { uniqueId } from 'lodash'

const getData = (content) => {
  const parser = new DOMParser()
  const xml = parser.parseFromString(content, 'application/xml')

  const parserError = xml.querySelector('parsererror')
  if (parserError) {
    throw new Error('rssParsingError')
  }
  return xml
}

const addNewFeed = (parse, state, url) => {
  const channel = parse.querySelector('channel')
  const feedId = uniqueId('feed_')
  const feed = {
    id: feedId,
    url,
    title: channel.querySelector('title').textContent,
    description: channel.querySelector('description').textContent,
  }
  state.feeds.push(feed)
  return feedId
}

const addPostList = (parse, watchedState, feedId) => {
  const items = [...parse.querySelectorAll('item')]

  const uniqueNewPosts = items
    .map(item => ({
      feedId,
      title: item.querySelector('title').textContent,
      link: item.querySelector('link').textContent,
      description: item.querySelector('description').textContent,
    }))
    .filter(post => !watchedState.posts.some(p => p.link === post.link))
    .map(post => ({ ...post, id: uniqueId('post_') }))
  if (uniqueNewPosts.length) {
    watchedState.posts.unshift(...uniqueNewPosts)
  }
}

const updatePosts = async (watchedState) => {
  const updatePromises = watchedState.feeds.map(async (feed) => {
    try {
      const response = await axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${feed.url}`)
      const { contents } = response.data
      const parse = getData(contents)
      addPostList(parse, watchedState, feed.id)
    }
    catch (err) {
      console.log(`Network error ${err.message}`)
    }
  })

  await Promise.all(updatePromises)
  setTimeout(() => updatePosts(watchedState), 5000)
}

export default async () => {
  const DEFAULT_LANG = 'ru'

  const modal = document.querySelector('.modal')
  const modalTitle = modal.querySelector('.modal-title')
  const modalBody = modal.querySelector('.modal-body')

  const elements = {
    formStatus: document.querySelector('.feedback'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
  }

  const state = {
    formStatus: {
      status: null,
      error: null,
    },
    feeds: [],
    posts: [],
    viewedPosts: [],
    submittedUrls: [],
  }

  elements.posts.addEventListener('click', (e) => {
    e.preventDefault()

    const clickedEl = e.target
    if (clickedEl.tagName !== 'A' && clickedEl.tagName !== 'BUTTON') return
    const postElement = clickedEl.closest('li')
    const link = postElement.querySelector('a')

    link.classList.remove('fw-bold')
    link.classList.add('fw-normal', 'link-secondary')

    const postId = link.dataset.id
    const currentPost = state.posts.find(post => post.id === postId)

    const text = currentPost.title
    const description = currentPost.description
    modalTitle.textContent = text
    modalBody.textContent = description

    if (!state.viewedPosts.includes(postId)) {
      state.viewedPosts.push(postId)
    }
  })

  const i18n = i18next.createInstance()
  await i18n.init({
    lng: DEFAULT_LANG,
    debug: false,
    resources,
  })

  const watchedState = watch(elements, i18n, state)

  updatePosts(watchedState)

  yup.setLocale({
    string: {
      url: () => ({ key: 'errors.invalidUrl' }),
    },
  })

  const schema = yup.string().url().test('not-exists', () => ({ key: 'errors.rssExists' }), value => !watchedState.submittedUrls.includes(value))

  const form = document.querySelector('form')
  const container = document.querySelector('.container-fluid')

  container.addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(form)
    const url = formData.get('url').trim()

    try {
      await schema.validate(url, { abortEarly: false })
      const response = await axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
      if (response.status === 200) {
        const { contents } = response.data
        const parser = getData(contents)
        const feedId = addNewFeed(parser, watchedState, url)
        addPostList(parser, watchedState, feedId)
      }
      else {
        watchedState.formStatus.errors = 'networkError'
      }
      watchedState.formStatus.error = null
      watchedState.formStatus.status = null
      watchedState.formStatus.status = 'formStatus.success'
      watchedState.submittedUrls.push(url)
      form.reset()
    }
    catch (err) {
      if (err.message === 'rssParsingError') {
        watchedState.formStatus.error = 'errors.invalidRss'
        return
      }
      if (err.isAxiosError) {
        watchedState.formStatus.error = 'errors.networkError'
        return
      }
      if (err.inner) {
        watchedState.formStatus.error = err.inner[0].message.key
        return
      }
      else {
        watchedState.formStatus.error = 'errors.unknownError'
      }
    }
  })
}
