document.addEventListener("DOMContentLoaded", () => {

  //variable definitions
  let currentFormat = "blockColumn"
  let taskAddSpace = document.querySelector(".input-group")
  let formatToggle = document.querySelector("#formatToggle")
  let tabDisplay = document.querySelector(".tabDisplay")
  let alertSpace = document.querySelector("#alertSpace")
  let blockColumnDisplay = document.querySelector("#blockColumnDisplay")
  let activities = {"notStarted": [], "inProgress": [], "completed": []}
  const subLists = Object.keys(activities)

  //deletes task from activity array and from DOM - used for delete icon and first part of complete
  let shiftItem = listItem => {
    var position = activities[listItem.dataset.status].indexOf(listItem.dataset.taskText)
    activities[listItem.dataset.status].splice(position, 1)
    listItem.remove()
  }

  //display notifications
  let alertMessage = message => {
    var container = alertSpace.querySelector('p')
    container.innerHTML = message
    container.style.visibility = "visible"
    setTimeout( () => {
      container.style.visibility = "hidden"
    }, 3000)
  }

  //update completed task (check) icon appropiately - this becomes a left facing arrow once a task is moved to completed
  let updateIcon = (item, status, destination) => {
    item.parentElement.dataset.status = status
    activities[status].push(item.parentElement.dataset.taskText)
    destination.querySelector('ul').appendChild(item.parentElement)
    status == 'inProgress' ? item.className = "fa fa-check" : item.className = "fa fa-arrow-left"
  }

  //create a list item
  let createTask = (taskContent, taskContainer, status) => {
    var newTask = document.createElement('li')
    newTask.innerHTML = taskContent
    newTask.setAttribute("draggable", true)
    newTask.setAttribute("data-status", status)
    newTask.setAttribute("data-task-text", taskContent)

    //configure draggabiility -> dragend event deletes list item from list where it is being moved from
    newTask.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text', e.target.dataset.taskText)
    })

    newTask.addEventListener('dragend', e => {
      shiftItem(e.target)
    })

    var deleteButton = document.createElement('i')
    deleteButton.className = "fa fa-trash"
    deleteButton.addEventListener('click', e => {
      shiftItem(e.target.parentElement)
      alertMessage('Task deleted!')
    })

    var completedButton = document.createElement('i')
    completedButton.className = status != 'completed' ? "fa fa-check" : "fa fa-arrow-left"
    completedButton.addEventListener("click", e => {
      var item = e.target
      shiftItem(item.parentElement)
      if (currentFormat == 'blockColumn') {
        var destination = item.className == "fa fa-arrow-left" ? blockColumnDisplay.querySelector('.inProgress') : blockColumnDisplay.querySelector('.completed')
        item.className == "fa fa-arrow-left" ? updateIcon(item, 'inProgress', destination) : updateIcon(item, 'completed', destination)
      } else {
        var destinationList = item.parentElement.dataset.status != "completed" ? "completed" : "inProgress"
        activities[destinationList].push(item.parentElement.dataset.taskText)
      }
    })
    newTask.append(completedButton)
    newTask.append(deleteButton)
    taskContainer.appendChild(newTask)
    alertMessage('Task added!')
  }

  //configure ul's to accept dragged list items
  blockColumnDisplay.querySelectorAll('ul').forEach(taskList => {

    taskList.addEventListener('dragover', e => {
      e.preventDefault()
    })

    taskList.addEventListener('drop', e => {
      e.preventDefault()
      //if column view then clean class name to it corresponds to a key in activity list
      var newStatus = e.target.parentElement.className
      newStatus.includes('column') ? newStatus = newStatus.replace(" column", "") : ''
      var text = e.dataTransfer.getData('text')
      //add to correct activity array and DOM ul
      activities[newStatus].push(text)
      createTask(text, e.target, newStatus)
    })
  })

  //configure buttons
  //random fact button
  document.querySelector('#randomFact').onclick = () => {
    const request = new XMLHttpRequest()
    request.open('GET', 'https://uselessfacts.jsph.pl/random.json?language=en')
    request.onload = () => {
      var response = JSON.parse(request.responseText)
      alertSpace.querySelector('p').innerHTML = response.text
      alertSpace.querySelector('p').style.visibility = "visible"
    }
    request.send()
  }
  //configure tabs for tab display
  tabDisplay.querySelectorAll('p').forEach(tab => {
    tab.addEventListener('click', e => {
      //clear current selection
      tabDisplay.querySelector("#selectedTab") ? tabDisplay.querySelector("#selectedTab").id = '' : ''
      tab.id = "selectedTab"
      const listToRetrieve = e.target.dataset.tab
      tabDisplay.querySelector('ul').innerHTML = ''
      //load any existing activities
      activities[listToRetrieve] ? activities[listToRetrieve].forEach(item => { createTask(item, tabDisplay.querySelector('ul'), listToRetrieve) }) : ''
    })

    tab.addEventListener('dragover', e => {
      e.preventDefault()
    })

    tab.addEventListener('drop', e => {
      var newStatus = e.target.dataset.tab
      var text = e.dataTransfer.getData('text')
      activities[newStatus].push(text)
    })
  })

  //change views
  formatToggle.querySelectorAll('a').forEach(button => {
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
            activities[list] ? activities[list].forEach(task => createTask(task, container.querySelector('ul'), list)) : ''
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
      createTask(taskToAdd, document.querySelector(".selectedFormat ul"), 'notStarted')
    }
  }

})
