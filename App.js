import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList} from 'react-native';
import React,{useState, useEffect} from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push, onValue} from 'firebase/database';
import Remove from './component/remove';


const firebaseConfig = {
  apiKey: "AIzaSyCCzMZiys-AcKyFRR_lIrYJsj-TO4rZylc",
  authDomain: "my-task-list-b62c7.firebaseapp.com",
  databaseURL: "https://my-task-list-b62c7-default-rtdb.firebaseio.com",
  projectId: "my-task-list-b62c7",
  storageBucket: "my-task-list-b62c7.appspot.com",
  messagingSenderId: "828162683106",
  appId: "1:828162683106:web:b629404f2037d26e7e6ebb"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default function App() {

const [task, setTask] = useState('')
const [tasks, setTasks] = useState([]); // Estado para armazenar as tarefas

 // Função para adicionar a tarefa ao banco de dados
 const addTask = () => {
  if (task.trim()) {
    const tasksRef = ref(database, 'tasks'); // 'tasks' é o nome do nó no banco de dados
    push(tasksRef, {
      task: task,
      completed: false,
    })
    .then(() => {
      setTask(''); // Limpa o campo de texto após adicionar
      alert('Task added!');
    })
    .catch((error) => {
      alert('Error: ' + error.message);
    });
  } else {
    alert('Task cannot be empty');
  }
};

 // Função para buscar as tarefas do Firebase
 useEffect(() => {
  const tasksRef = ref(database, 'tasks');
  onValue(tasksRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
      const taskArray = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
      setTasks(taskArray); // Atualiza o estado com as tarefas recuperadas
    } else {
      setTasks([]); // Se não houver tarefas, define o array como vazio
    }
  });
}, []);

  return (
    <View style={styles.container}>
      <Text
      style={styles.titulo}>Task List</Text>
      <br/>
      <View style={styles.input}>
      <TextInput 
      placeholder='Add a task'
      value={task}
          onChangeText={text => setTask(text)}

      style={styles.textinput}
      />
       <TouchableOpacity style={styles.botao} onPress={addTask}>
          <Text style={{ color: 'white', fontSize: 18 }}> + </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskText}>{item.task}</Text>
            <Remove taskId={item.id} />
          </View>
        )}
      />


      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'collumn',
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: 20,
  },
  input: {
    display: 'flex',
    flexDirection: 'row',
    color: 'gray',
  },
  textinput:{
    borderWidth:1,
    borderColor: 'grey',
    padding: '5px',
    marginRight: '5px',
    borderRadius: '28px',
    width: '350px'
  },
  titulo:{
    fontSize: '35px'
  },
  botao:{
    backgroundColor: 'green',
    color: 'white',
    width: '40px',
    height: '40px',
    fontWeight: 'bolder',
    alignContent: 'center',
    alignItems: 'center' ,
   justifyContent: 'center',
   borderRadius: '25px',
  }
});
