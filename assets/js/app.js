const form = document.querySelector('#form')
const API_LINK = 'https://api.github.com/users/'

function getUser(api) {
    fetch(api)
        .then(response => {
            if (!response.ok) {
                throw new Error('User not found')
            }
            return response.json()
        })
        .then(data => {
            getUserInfos(data)
            getRepos(api + '/repos?sort=created')
            showError(false)
        })
        .catch(e => {
            console.log('Error to fetch')
            showError(true)
            getUserInfos(false)
        })
}

function showError(e) {
    const errorContainer = document.querySelector('.error')
    return (
        e ? errorContainer.classList.remove('js-no-display') :
        errorContainer.classList.add('js-no-display')
    )
}

function getUserInfos(data) {
    if (!data) return generateUsercard(false)

    const avatar = data.avatar_url
    const name = data.name ? data.name : data.login
    const followers = data.followers
    const following = data.following
    const qtdRepos = data.public_repos
    const profileUrl = data.html_url
    const allInfo = { avatar, name, followers, following, qtdRepos,profileUrl }
    generateUsercard(allInfo)
}

function generateUsercard(user) {
    const main = document.querySelector('#main')

    const card = `
    <div class="user-card animate">
            <div class="avatar-container">
                <img src="${user.avatar}" alt="user image">
            </div>
            <div class="user-info">
                <div class="user-description">
                    <a class="user-name" href="${user.profileUrl}" target="_blank">${user.name}</a>
                    <p class="user-details">
                        <span id="followers">${user.followers} Followers</span>
                        <span id="following">${user.following} Following</span>
                        <span id="qtd-repos">${user.qtdRepos} Repos</span>
                    </p>
                </div>
                <div class="repos-container">
                    <ul class="repo-list">
                    </ul>
                </div>
            </div>
        </div>
    `
    if (!user) return main.innerHTML = ''
    main.classList.add('animate')
    main.innerHTML = card
}

function getRepos(data) {
    fetch(data)
        .then(response => response.json())
        .then(repo => addReposToCard(repo))
}

function addReposToCard(data) {
    const reposUl = document.querySelector('.repo-list')
    const repos = data

    repos
        .slice(0, 5)
        .forEach(repo => {
            const repoItem = document.createElement('a')
            repoItem.classList.add('repo-item')
            repoItem.href = repo.html_url
            repoItem.target = '_blank'
            repoItem.innerText = repo.name
            const li = document.createElement('li')
            li.appendChild(repoItem)
            reposUl.appendChild(li)
        })
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const main = document.querySelector('#main')
    main.classList.remove('animate')
    const search = document.querySelector('#search')

    if (search.value.trim() === '') return

    const user = API_LINK + search.value

    getUser(user)
    search.value = ''
    search.focus()
})