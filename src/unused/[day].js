// import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { useLocalSearchParams, router } from "expo-router";
// import Ionicons from "@expo/vector-icons/Ionicons";
// import { useTodoListContext } from "../../../context/todos-context";
// import Todo from '../../../components/todo';
// import { LinearGradient } from "expo-linear-gradient";


// const DaysTodos = () => {
//   const { day, from } = useLocalSearchParams();
//   const [thisDaysTodos, setThisDaysTodos] = useState([])
//   const { todos } = useTodoListContext();
//   console.log("burasi eski day");

//   const ThisDayTodos = () => {
//     const filteredTodos = todos.filter((todo) => todo.dueDate === day);
//     setThisDaysTodos(filteredTodos) ;
//   }

//   useEffect(() => {
//     ThisDayTodos();
//   }, [day])

//   return (
//     <LinearGradient
//     colors={["#01061b", "#431127", "#931e36"]}
//       style={{ flex: 1, padding: 7, justifyContent: "center" }}
//     >
//     <ScrollView className="mt-12 flex-1">
//       <Text>DaysTodos {day} {from}</Text>
//       {thisDaysTodos.map((todo, index) => (
//         <Todo key={todo.id} todo={todo} index={index} fromText={`/list/${day}`}/>
//       ))}
//       {
//         thisDaysTodos.length === 0 && (
//           <View className="flex-1 items-center justify-center pt-8">
//             <Text className="text-2xl text-white">No ToDos found for this date</Text>
//             <Text className="text-2xl text-yellow-600">{day}</Text>
//           </View>
//         )
//       }
//     </ScrollView>
//       <TouchableOpacity
//             className="bg-[#001d3d] h-10 w-[110px] pb-2 pr-4 rounded-full items-center flex-row gap-2 justify-center absolute bottom-[100px] right-[36%]" 
//             onPress={() => {
//               router.push('/');
//               // if (from === 'home') {
//               //   router.push('/'); 
//               // } else if (from === 'add') {
//               //   router.push('/add'); 
//               // } else {
//               //   router.back(); // Varsayılan olarak bir önceki ekrana git
//               // }
//             }}
//           >
//             <Ionicons name="chevron-back-outline" size={24} color="white" />
//             <Text className="text-white text-md font-bold">Back</Text>
//       </TouchableOpacity>
//     </LinearGradient>

//   )
// }

// export default DaysTodos