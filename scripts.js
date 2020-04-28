document.addEventListener("DOMContentLoaded", () => {

  //variable definitions
  let currentFormat = "blockColumn"
  let taskAddSpace = document.querySelector(".input-group")
  let formatToggle = document.querySelector("#formatToggle")
  let tabDisplay = document.querySelector(".tabDisplay")
  let blockColumnDisplay = document.querySelector("#blockColumnDisplay")
  let activities = {"notStarted": [], "inProgress": [], "completed": []}
  let taskButtonClasses = ["fa fa-arrow-right", "fa fa-trash", "fa fa-check"]
  const subLists = Object.keys(activities)

  //redunancy for buttons ---> input is going to be e.target
  let shiftItem = item => {
    var listItem = item.parentElement
    var position = activities[listItem.dataset.status].indexOf(listItem.dataset.taskText)
    activities[listItem.dataset.status].splice(position, 1)
    item.closest('li').remove()
  }

  //create a list item
  let createTask = (taskContent, taskContainer) => {
    var newTask = document.createElement('li')
    newTask.innerHTML = taskContent
    newTask.setAttribute("data-status", "notStarted")
    newTask.setAttribute("data-task-text", taskContent)

    var deleteButton = document.createElement('i')
    deleteButton.className = "fa fa-trash"
    deleteButton.addEventListener('click', e => {
      shiftItem(e.target)
    })

    var completedButton = document.createElement('i')
    completedButton.className = "fa fa-check"
    completedButton.addEventListener("click", e => {
      var item = e.target
      shiftItem(item)
      if (currentFormat == 'blockColumn') {
        var destination = item.className == "fa fa-arrow-left" ? document.querySelector('.inProgress') : document.querySelector('.completed')
        if (item.className == "fa fa-arrow-left") {
          console.log('here')
          item.parentElement.dataset.status = 'inProgress'
          activities['inProgress'].push(item.parentElement.dataset.taskText)
          destination.querySelector("ul").appendChild(item.parentElement)
          item.className = "fa fa-check"
        } else {
          e.target.parentElement.dataset.status = 'completed'
          activities['completed'].push(item.dataset.tastText)
          completedButton.className = "fa fa-arrow-left"
          destination.querySelector("ul").appendChild(item.parentElement)
        }
      }
    })

    newTask.append(completedButton)
    newTask.append(deleteButton)
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

  //change views
  formatToggle.querySelectorAll('input').forEach(button => {
    button.addEventListener("click", e => {
      var currentView = document.querySelector(".selectedFormat")
      //if selecting a different view than current
      if (`${e.target.id}display` != currentView.id) {
        currentFormat = e.target.id
        currentView.classList.remove('selectedFormat')
        document.querySelector(`#${currentFormat}display`).classList.add('selectedFormat')
        //add column if column selected. Column view is the only listview that has a data attribute
        e.target.dataset.layout ? subLists.forEach(list => blockColumnDisplay.querySelector(`.${list}`).classList.add('column')) : subLists.forEach(list => blockColumnDisplay.querySelector(`.${list}`).classList.remove('column'))


        //select not started tab for tab view layout
        if (document.querySelector(".selectedFormat").className.includes('tab'))
          tabDisplay.querySelector(".notStarted").click()
        //load lists for block or column display
        else {
          subLists.forEach(list => {
            var container = blockColumnDisplay.querySelector(`.${list}`)
            container.querySelector('ul').innerHTML = ''
            activities[list] ? activities[list].forEach(task => createTask(task, container.querySelector('ul'))) : ''
          })
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
      activities.notStarted.push(taskToAdd)
      createTask(taskToAdd, document.querySelector(".selectedFormat ul"))
    }
  }



})
