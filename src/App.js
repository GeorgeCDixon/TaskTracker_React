import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from './components/AddTask';
import Footer from './components/Footer';
import About from './components/About';


function App() {

  const [showAddTask, setShowAddtask] = useState(false);
  const [tasks, setTasks] = useState([])

  useEffect(() =>{
    const getTasks = async () =>{
      const taskFromServer = await fetchTasks();
      setTasks(taskFromServer);
    }
    getTasks();
  
  }, [])


//fetch all tasks data from json-server
const fetchTasks = async () => {
      const res =await fetch('http://localhost:5000/tasks')
      const data = await res.json();
      return data;
      // console.log(data);
    }


    //delete task
    const deleteTask = async(id) =>{
      // console.log('delete', id);
      await fetch('http://localhost:5000/tasks/' + id, {
        method: 'DELETE'
      })


      setTasks(tasks.filter((task)=> task.id !== id))
}


//fetch specific task data from json-server
const fetchTask = async (id) => {
      const res =await fetch('http://localhost:5000/tasks/'+ id)
      const data = await res.json();
      return data;
      // console.log(data);
    }




//Toggle Reminder
 const toggleReminder =async (id) =>{

  const taskToToggle = await fetchTask(id);
  const updTask = {...taskToToggle, reminder: !taskToToggle.reminder};

  const res = await fetch('http://localhost:5000/tasks/'+ id,{
    method:'PUT',
    headers:{
      'content-type':'application/json'
    },
    body: JSON.stringify(updTask)

  })

  const data = await res.json()

  setTasks(
      tasks.map((task)=>
        task.id ===id ? {...task , reminder : data.reminder} : task
    ))
    
    // console.log(id);
    //Without JSON Server -code
    // setTasks(
    //   tasks.map((task)=>
    //     task.id ===id ? {...task , reminder : !task.reminder} : task
    // ))
    
 }

 //Add Task
 const addTask= async (task)=>{

  const res = await fetch('http://localhost:5000/tasks',{
    method:'POST',
    headers:{
      'content-type': 'application/json',
    },
    body: JSON.stringify(task),
  })

  const data = await res.json();
  console.log(data);
  setTasks([...tasks, data]);

  // const id = Math.floor(Math.random() * 10000) +1 ;
  // const newTask ={id, ...task}
  // setTasks([...tasks, newTask])
 }

  return (
    <Router>
    

    <div className="container">
        <Header onAdd={()=>setShowAddtask(!showAddTask)}
          showAdd ={showAddTask}
         />

        {showAddTask && <AddTask onAdd ={addTask} />  }

        

        {tasks.length > 0 ? (
          <Tasks
        tasks={tasks} onDelete = {deleteTask} onToggle={toggleReminder} />
        ) : (
          'No Task To Show'
        )}
      

        <About />

        {/* <Footer />  */}
     
    </div>
    
    </Router>
  );
}



export default App;
