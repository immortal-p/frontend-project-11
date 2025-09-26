import onChange from 'on-change'

export default (elements, i18n, state) => {
    const feedbackCont = elements.feedback
    const generateCurrectUrl = () => {
        feedbackCont.classList.add('text-success')
        feedbackCont.textContent = i18n.t(watchedState.feedback.success)
    }

    const generateErrorUrl = () => {
        feedbackCont.classList.add('text-danger')
        feedbackCont.textContent = i18n.t(watchedState.feedback.error)
    }

    const clearText = () => {
        feedbackCont.classList.remove('text-danger', 'text-success')
        feedbackCont.textContent = ''
    }

    const watchedState = onChange(state, (path) => {
        switch (path) {
        case 'feedback.error' :
            generateErrorUrl()
            break
        case 'feedback.success' :
            console.log(path)
            generateCurrectUrl()
            break
        default :
            console.log(path)
            clearText()
            break
        }
    })

    return watchedState
}