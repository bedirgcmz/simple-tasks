import React, { useEffect } from 'react';
import { FlatList, View, StatusBar, ImageBackground } from 'react-native';
import { useTodoListContext } from '../../../context/todos-context';
import Todo from '../../../components/todo';

const TodosScreen = () => {
  const { todos } = useTodoListContext();

  return (
    <ImageBackground source={require("../../../../assets/images/bg-add.jpg")} resizeMode="cover" className="flex-1 pt-10 pb-20">

    <FlatList
      className="p-2 "
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Todo todo={item} index={index}/>
        )}
      />
     <StatusBar 
          style="light"
          backgroundColor="transparent"
          translucent={true}
    
    /> 
</ImageBackground>
  );
};

export default TodosScreen;

