document.addEventListener("DOMContentLoaded", () => {
  //variable definitions
  let taskAddSpace = document.querySelector(".input-group")
  let formatToggle = document.querySelector("#formatToggle")
  let tabDisplay = document.querySelector("#tabDisplay")
  let activities = {"notStarted": [], "inProgress": [], "completed": []}

  formatToggle.querySelectorAll('input').forEach(button => {
    button.addEventListener("click", e => {
      var currentView = document.querySelector(".selectedFormat")
      console.log(`${e.target.id}display`)
      console.log(currentView.id)
      if (`${e.target.id}display` != currentView.id) {
        currentView.classList.remove('selectedFormat')
        document.querySelector(`#${e.target.id}display`).classList.add('selectedFormat')
      }
    })
  })

  tabDisplay.querySelectorAll('p').forEach(p => console.log(p))

  //configure buttons
  taskAddSpace.querySelector('button').onclick = e => {
    console.log('here')
    var taskToAdd = taskAddSpace.querySelector('input').value
    if (!taskToAdd || taskToAdd.trim() == '') {
      e.preventDefault()
      window.alert("please enter something into the field")
      return false
    } else {
      //need to add an active class for whichever format is selected (between block and tab)
      //var container = document.querySelector(".notStarted.selectedFormat")
      var taskListItem = document.createElement('li')

      activities.notStarted.push(taskToAdd)
      taskListItem.innerHTML = taskToAdd
      document.querySelector("ul").appendChild(taskListItem)

    }
  }



})
