document.addEventListener('DOMContentLoaded', ()=>{
const restaurantDetail = document.querySelector('#restaurant-detail')
const leftHandListOfNames = document.querySelector('.list-group')

  let allReviews = []
  let allRestaurants = []
  let page = 1


  function fetchRestaurants() {
    fetch(`https://restaurantreviewsbackend.herokuapp.com/api/v1/restaurants?limit=25&page=${page}`)
      .then(r=>r.json())
      .then(r=>{
        console.log(r)
        if (r.error){
          alert(r.error)
        } else {
          allRestaurants = r
          restaurantDetail.innerHTML = staticRestaurantDetail(r)
          leftHandListOfNames.innerHTML = mapThroughRestaurantArrayIntoHTML(r)

        }
      })
  }

  fetchRestaurants()

  function mapThroughRestaurantArrayIntoHTML(r){
    return allRestaurants.map((r)=>{
      return (
        `<li id="li-${r.id}" data-id="${r.id}">
        ${r.name}
        </li>`
      )
    }).join('')
  }

  function staticRestaurantDetail(r) {
    return restaurantDetail.innerHTML = `

      <h2 data-value="${r.name}" data-id="${r.id}" data-key="name" id="name"> Eric's Magnificent Pizzas</h2><br>

      <img class="image" src="https://amp.businessinsider.com/images/5776c75188e4a714088b594d-960-720.jpg">

      <h2 data-key="food_type" data-action="update" data-value="${r.food_type}" id="food_type" data-id="${r.id}">Food Type: Italian</h2>

      <h2 data-action="update" data-value="${r.location}" data-id="${r.id}" data-key="location" id="location">Location: Astoria</h2>

      <h2 data-action="update" id="bar" data-key="bar" data-id="${r.id}" data-value="${r.bar}">Full Bar: True</h2>



    `
  }
/////////////////////////////////////////back/next button//////////////////////////////////////////////
    document.querySelector('.five.wide.column').addEventListener('click', (e)=>{
      if (e.target.className === "blue back ui button"){
        if (page === 1){
          alert("first page")
        }else if((e.target.className === "blue back ui button"))
        page -= 1
        fetchRestaurants()
      }else if (e.target.className === "blue next ui button"){
        page += 1
        fetchRestaurants()
      }
    })


  leftHandListOfNames.addEventListener('click', (e)=>{
    let r = allRestaurants.find((r)=>r.id === parseInt(e.target.dataset.id))
    document.querySelector('#restaurant-detail').innerHTML = eachRestaurantHTMLFormatted(r)
  })//end of event listener

  function eachRestaurantHTMLFormatted(r) {
    return (`
      <h2 data-action="update" data-value="${r.name}" data-id="${r.id}" data-key="name" id="name"> ${r.name}</h2><br>

      <img class="image" src="${r.image}">

      <h2 data-key="food_type" data-action="update" data-value="${r.food_type}" id="food_type" data-id="${r.id}">Food Type: ${r.food_type}</h2>

      <h2 data-action="update" data-value="${r.location}" data-id="${r.id}" data-key="location" id="location">Location: ${r.location}</h2>

      <h2 data-action="update" id="bar" data-key="bar" data-id="${r.id}" data-value="${r.bar}">Full Bar: ${r.bar}</h2>

      <button id="delete" data-value="${r.id}" class="medium ui blue button"> Delete </button>

      `
    )
  }

  restaurantDetail.addEventListener('click', (e)=>{
    if (e.target.dataset.action === "update"){
      let clickedId = parseInt(e.target.dataset.id)
      let clickedKey = e.target.dataset.key
      e.target.innerHTML = `<input id=input-${clickedId} data-id=${clickedId} data-key=${clickedKey} value=${e.target.dataset.value}></input>`

    }else if (e.target.id === "delete"){
      let clickedId = parseInt(e.target.dataset.value)
      let foundRestaurant = allRestaurants.find(r => r.id === clickedId)

      let index = allRestaurants.findIndex((restaurant)=>{
        return restaurant.id === clickedId
      })

      allRestaurants.splice(index, 1)
        fetch(`https://restaurantreviewsbackend.herokuapp.com/api/v1/restaurants/${clickedId}`,{method: 'DELETE'})
          .then(r=>r.json())
          .then(r=>{
            fetchRestaurants()
          })
    }
  })

  restaurantDetail.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter'){
      let clickedValue = e.target.value
      let clickedId = parseInt(e.target.dataset.id)
      let clickedKey = e.target.dataset.key

    fetch(`https://restaurantreviewsbackend.herokuapp.com/api/v1/restaurants/${clickedId}`,
      { method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        [clickedKey]: clickedValue
      })
    })
    .then(r => r.json())
    .then(r =>{
      fetch(`https://restaurantreviewsbackend.herokuapp.com/api/v1/restaurants?limit=25&page=${page}`)

          let foundRestaurant = r

          restaurantDetail.innerHTML =
          `
          <h2 data-action="update" data-value="${foundRestaurant.name}" data-id="${foundRestaurant.id}" data-key="name" id="name"> ${foundRestaurant.name}</h2><br>

          <img class="image" src="${foundRestaurant.image}">

          <h2 data-key="food_type" data-action="update" data-value="${foundRestaurant.food_type}" id="food_type" data-id="${foundRestaurant.id}">Food Type: ${foundRestaurant.food_type}</h2>

          <h2 data-action="update" data-value="${foundRestaurant.location}" data-id="${foundRestaurant.id}" data-key="location" id="location">Location: ${foundRestaurant.location}</h2>

          <h2 data-action="update" id="bar" data-key="bar" data-id="${foundRestaurant.id}" data-value="${foundRestaurant.bar}">Full Bar: ${foundRestaurant.bar}</h2>

          <button id="delete" data-value="${foundRestaurant.id} data-id="${foundRestaurant.id}" class="medium ui blue button"> Delete </button>
          `
        })
      }
    })
/////////////////////////////////////////////////////////////new review /////////////////////////////////////////////////////////
    document.querySelector('.ui.form').addEventListener('submit', (e)=>{
      e.preventDefault()
      let nameInput = document.querySelector('#restaurant-name-input').value
      let foodType = document.querySelector('#food-type-input').value
      let locationInput = document.querySelector('#location-input').value
      let barInput = document.querySelector('#full-bar-input').value
      let imageInput = document.querySelector('#image-input').value

        fetch(`https://restaurantreviewsbackend.herokuapp.com/api/v1/restaurants`, {method: 'POST',
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
          },
          body: JSON.stringify({
            name: nameInput,
            food_type: foodType,
            location: locationInput,
            bar: barInput,
            image: imageInput
          })
        })
          .then(r=>r.json())
          .then(r =>{
            allRestaurants.push(r)
            fetchRestaurants()
            document.querySelector('.ui.form').reset()
          })
    })

})//end of dom content loaded
