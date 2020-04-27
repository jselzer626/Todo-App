document.addEventListener("DOMContentLoaded", () => {

  //variable definitions
  let taskAddSpace = document.querySelector(".input-group")
  let formatToggle = document.querySelector("#formatToggle")
  let tabDisplay = document.querySelector(".tabDisplay")
  let blockColumnDisplay = document.querySelector("#blockColumnDisplay")
  let activities = {"notStarted": [], "inProgress": [], "completed": []}
  const subLists = Object.keys(activities)

  //create a list item
  let createTask = (taskContent, taskContainer) => {
    var newTask = document.createElement('li')
    newTask.innerHTML = taskContent
    taskContainer.appendChild(newTask)
  }

  //configure buttons
  tabDisplay.querySelectorAll('p').forEach(tab => {
    tab.addEventListener('click', e => {
      //clear current selection
      tabDisplay.querySelector("#selectedTab") ? tabDisplay.querySelector("#selectedTab").id = '' : ''
      tab.id = "selectedTab"
      const listToRetrieve = e.target.dataset.tab
      tabDisplay.querySelector('ul').innerHTML = ''
      //load any existing activities
      activities[listToRetrieve] ? activities[listToRetrieve].forEach(item => { createTask(item, tabDisplay.querySelector('ul')) }) : ''
    })
  })

  formatToggle.querySelectorAll('input').forEach(button => {
    button.addEventListener("click", e => {
      var currentView = document.querySelector(".selectedFormat")
      //if selecting a different view than current
      if (`${e.target.id}display` != currentView.id) {
        currentView.classList.remove('selectedFormat')
        document.querySelector(`#${e.target.id}display`).classList.add('selectedFormat')

        //select not started tab for tab view layout
        if (document.querySelector(".selectedFormat").className.includes('tab'))
          tabDisplay.querySelector(".notStarted").click()
        else {
          //load lists for block or column display
          subLists.forEach(list => {
            var container = blockColumnDisplay.querySelector(`.${list}`)
            activities[list] ? activities[list].forEach(task => {createTask(task, container.querySelector('ul'))}) : ''
          })
        }

        //load messages for block and column display
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
      activities.notStarted.push(taskToAdd)
      createTask(taskToAdd, document.querySelector(".selectedFormat ul"))
    }
  }



})
