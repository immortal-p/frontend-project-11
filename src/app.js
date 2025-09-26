import * as yup from 'yup'
import i18next from 'i18next'
import resources from './locales/ru.js'
import watch from './view.js'

export default async () => {
    const defaultLang = 'ru'

    const elements = {
        feedback: document.querySelector('.feedback'),
    }

    const state = {
        feedback: {
            success: null,
            error : null,
        },
        urlList: [],
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


    const schema = yup.string().url().test('not-exists', () => ({ key: 'errors.rssExists'}), value => !state.urlList.includes(value))


    const container = document.querySelector('.container-fluid')
    const input = document.querySelector('#url-input')

    container.addEventListener('submit', async (e) => {
        e.preventDefault()
        const text = input.value.trim()

        try {
            await schema.validate(text, { abortEarly: false })
            watchedState.urlList.push(text)
            watchedState.feedback.error = null
            watchedState.feedback.success = 'feedback.success'
            input.value = ''
        }
        catch (err) {
            err.errors.forEach(error => {
                watchedState.feedback.error = error.key
            })
        }
    })
}
