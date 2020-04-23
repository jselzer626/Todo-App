document.addEventListener("DOMContentLoaded", () => {
  //variable definitions
  let taskAddSpace = document.querySelector(".input-group")
  let formatToggle = document.querySelector("#formatToggle")
  let tabDisplay = document.querySelector("#tabDisplay")
  let activities = {"notStarted": [], "inProgress": [], "completed": []}

  //configure buttons
  tabDisplay.querySelectorAll('p').forEach(tab => {
    tab.addEventListener('click', e => {
      const listToRetrieve = e.target.id
      tabDisplay.querySelector('ul').innerHTML = ''
      activities[listToRetrieve].forEach(item => {
        var newTask = document.createElement('li')
        newTask.innerHTML = item
        tabDisplay.querySelector('ul').appendChild(newTask)
      })
    })
  })


  formatToggle.querySelectorAll('input').forEach(button => {
    button.addEventListener("click", e => {
      var currentView = document.querySelector(".selectedFormat")
      if (`${e.target.id}display` != currentView.id) {
        currentView.classList.remove('selectedFormat')
        document.querySelector(`#${e.target.id}display`).classList.add('selectedFormat')
        if (document.querySelector(".selectedFormat").className.includes('tab')) {
          console.log('here')
          tabDisplay.querySelector("#notStarted").click()
        }
      }
    })
  })

  //configure buttons
  taskAddSpace.querySelector('button').onclick = e => {
    var taskToAdd = taskAddSpace.querySelector('input').value
    if (!taskToAdd || taskToAdd.trim() == '') {
      e.preventDefault()
      window.alert("please enter something into the field")
      return false
    } else {
      var container = document.querySelector(".selectedFormat ul")
      var taskListItem = document.createElement('li')

      activities.notStarted.push(taskToAdd)
      taskListItem.innerHTML = taskToAdd
      container.appendChild(taskListItem)

    }
  }



})
