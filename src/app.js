import validator from './validator.js'
import { proxy, subscribe, snapshot } from 'valtio/vanilla'

const state = proxy({
    url: '',
    errors: [],
})

export default () => {
    const form = document.querySelector('.rss-form')
    const input = form.querySelector('input')
    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        try {
            await validator(input.value.trim())
            state.errors = [],
            state.url = input.value.trim()
        }
        catch (err) {
            state.errors.push('Ссылка должна быть валидным URL')
        }
    })

    subscribe(state, () => {
        updateUI()
    })
}

const updateUI = () => {
    const feedback = document.querySelector('.feedback')
    const input = document.querySelector('#url-input')
    const { url, errors } = snapshot(state)
    if  (errors.length === 0){
        input.classList.remove('is-invalid')
        feedback.textContent = `${url} is valid`
    }
    else {
        input.classList.add('is-invalid')
        feedback.textContent = state.errors.join(' ')
    }
}