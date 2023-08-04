const form = document.querySelector('#form')
const main = document.querySelector('#main')
const search = document.querySelector('#search')

async function searchUser(user) {
    try {
        const response = await fetch('https://api.github.com/users/' + user)
        if (!response.ok) {
            throw new Error('User not found')
        }
        const data = await response.json()
        getUserInfos(data)
        getRepos('https://api.github.com/users/' + user + '/repos?sort=created')
        showError(false)
    } catch (e) {
        showError(true)
        console.log(e)
    }
}

function showError(e) {
    const errorContainer = document.querySelector('.error')

    if (e) {
        errorContainer.classList.remove('js-no-display')
        document.querySelector('.user-card').style.display = 'none'
    } else {
        errorContainer.classList.add('js-no-display')
    }
}

function getUserInfos(data) {
    const avatar = data.avatar_url
    const name = data.name ? data.name : data.login
    const followers = data.followers
    const following = data.following
    const qtdRepos = data.public_repos
    const profileUrl = data.html_url
    const allInfo = { avatar, name, followers, following, qtdRepos, profileUrl }
    generateUsercard(allInfo)
}

function generateUsercard(user) {
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
    main.classList.add('animate')
    main.innerHTML = card
}

async function getRepos(data) {
    const response = await fetch(data)
    const repos = await response.json()
    addReposToCard(repos)
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
    main.classList.remove('animate')

    if (search.value.trim() === '') return

    searchUser(search.value)
    search.value = ''
    search.focus()
})