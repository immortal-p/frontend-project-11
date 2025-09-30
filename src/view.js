import onChange from 'on-change'

export default (elements, i18n, state) => {
    const { formStatus, posts, feeds } = elements
    const generateCurrectUrl = () => {
        formStatus.classList.remove('text-danger')
        formStatus.classList.add('text-success')
        formStatus.textContent = i18n.t(watchedState.formStatus.status)
    }

    const generateErrorUrl = () => {
        formStatus.classList.remove('text-success')
        formStatus.classList.add('text-danger')
        formStatus.textContent = i18n.t(watchedState.formStatus.error)
    }

    const buildHeading = (container) => {
        const cardBody = document.createElement('div')
        cardBody.classList.add('card-body')
        const heading = document.createElement('h2')
        heading.classList.add('card-title', 'h4')
        heading.textContent = container.classList.contains('posts') ? 'Посты' : 'Фиды'
        cardBody.append(heading)
        return cardBody
    }

    const generatePost = () => {
        posts.innerHTML = ''

        const card = document.createElement('div')
        card.classList.add('card', 'border-0')
        card.append(buildHeading(posts))

        const ul = document.createElement('ul')
        ul.classList.add('list-group', 'border-0', 'rounded-0')

        state.posts.forEach(post => {
            const el = document.createElement('li')
            el.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0')

            const a = document.createElement('a')
            a.classList.add('fw-bold')
            a.setAttribute('href', post.link)
            a.setAttribute('data-id', post.id)
            a.setAttribute('target', '_blank')
            a.setAttribute('rel', 'noopener noreferrer')
            a.textContent = post.title

            const btn = document.createElement('button')
            btn.setAttribute('type', 'button')
            btn.classList.add('btn', 'btn-outline-primary', 'btn-sm')
            btn.setAttribute('data-id', post.id)
            btn.setAttribute('data-bs-toggle', 'modal')
            btn.setAttribute('data-bs-target', '#modal')
            btn.textContent = 'Просмотр'

            el.append(a, btn)
            ul.append(el)
        })

        card.append(ul)
        posts.append(card)
    }


    const generateFeed = () => {
        feeds.innerHTML = ''

        const card = document.createElement('div')
        card.classList.add('card', 'border-0')
        card.append(buildHeading(feeds))

        const ul = document.createElement('ul')
        ul.classList.add('list-group', 'border-0', 'rounded-0')

        state.feeds.forEach(feed => {
            const el = document.createElement('li')
            el.classList.add('list-group-item', 'border-0', 'border-end-0')

            const h3 = document.createElement('h3')
            h3.classList.add('h6', 'm-0')
            h3.textContent = feed.title

            const p = document.createElement('p')
            p.classList.add('m-0', 'small', 'text-black-50')
            p.textContent = feed.description

            el.append(h3, p)
            ul.append(el)
        })

        card.append(ul)
        feeds.append(card)
    }


    const watchedState = onChange(state, (path) => {
        switch(path) {
        case 'formStatus.status':
            generateCurrectUrl()
            break
        case 'formStatus.error':
            generateErrorUrl()
            break
        case 'feeds':
            generateFeed()
            break
        case 'posts':
            generatePost()
            break
        default :
            break
        }
    })

    return watchedState
}