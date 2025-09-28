import * as yup from 'yup'
import i18next from 'i18next'
import resources from './locales/ru.js'
import watch from './view.js'
import axios from 'axios'
import { uniqueId } from 'lodash'

const parserData = (content) => {
    const parser = new DOMParser()
    const xml = parser.parseFromString(content, 'application/xml')

    const parserError = xml.querySelector('parsererror')
    if(parserError) {
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

const addPostList = (parse, state, feedId) => {
    const items = [...parse.querySelectorAll('item')]

    items.forEach(item => {
        const post = {
            id: uniqueId('post_'),
            feedId,
            title: item.querySelector('title').textContent,
            link: item.querySelector('link').textContent,
        }
        state.posts.push(post)
    })
}

export default async () => {
    const defaultLang = 'ru'

    const elements = {
        formStatus: document.querySelector('.feedback'),
        posts: document.querySelector('.posts'),
        feeds: document.querySelector('.feeds'),
    }

    const state = {
        formStatus: {
            status: null,
            error : null,
        },
        feeds: [],
        posts: [],
        submittedUrls: [],
    }

    const i18n = i18next.createInstance()
    await i18n.init({
        lng: defaultLang,
        debug: false,
        resources,
    })

    const watchedState = watch(elements, i18n, state)
    
    yup.setLocale({
        string: {
            url: () => ({ key: 'errors.invalidUrl' }),
        },
    })


    const schema = yup.string().url().test('not-exists', () => ({ key: 'errors.rssExists'}), value => !state.submittedUrls.includes(value))


    const container = document.querySelector('.container-fluid')
    const input = document.querySelector('#url-input')

    container.addEventListener('submit', async (e) => {
        e.preventDefault()
        const url = input.value.trim()

        try {
            await schema.validate(url, { abortEarly: false })
            const response = await axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
            if (response.status === 200) {
                const { contents } = response.data
                const parser = parserData(contents)
                const feedId = addNewFeed(parser, state, url)
                addPostList(parser, state, feedId)
            }
            else {
                watchedState.formStatus.errors = 'networkError'
            }
            watchedState.formStatus.error = null
            watchedState.formStatus.status = null
            watchedState.formStatus.status = 'formStatus.success'
            state.submittedUrls.push(url)
            input.value = ''
        }
        catch (err) {
            if ( err.message === 'rssParsingError' ) {
                state.formStatus.error = 'errors.invalidRss'
            } 
            else if(err.isAxiosError) {
                watchedState.formStatus.error = 'errors.networkError'
            }
            else if(err.inner) {
                watchedState.formStatus.error = err.inner[0].message.key
            }
            else {
                state.formStatus.error = 'errors.unknownError'
            }
        }
    })
}
