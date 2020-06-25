let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(renderToys)
});

const $toyForm = document.querySelector('form.add-toy-form');
$toyForm.addEventListener('submit', submitToy)

function submitToy(e) {
  e.preventDefault();
  let formData = new FormData($toyForm);
  let name = formData.get('name');
  let image = formData.get('image')
  toy = { name, image, likes: 0 }
  renderToys([toy])
  fetch('http://localhost:3000/toys', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(toy)
  })
}

function renderToys(toys) {
  toys.forEach(toy => {
    const $div = document.createElement('div');
    $div.classList.add("card");
    $div.innerHTML = `
    <h2>${toy.name}</h2>
    <img src=${toy.image} class="toy-avatar">
    <p><span class="likes">${toy.likes}</span> likes</p>
    <button class="like-btn" value=${toy.id}>Like <3</button>`;
    document.querySelector('#toy-collection').append($div);
    const $likeButton = $div.querySelector('.like-btn')
    $likeButton.addEventListener('click', e => {
      const $likes = $div.querySelector('span.likes');
      let newLikes = parseInt($likes.textContent) + 1;
      $likes.textContent = newLikes;
      fetch(`http://localhost:3000/toys/${e.target.value}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          likes: newLikes
        })
      })
    })
  })
}