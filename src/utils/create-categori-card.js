
import { useTodoListContext } from "../context/todos-context";
import CategoryCard from '../components/CategoryCard'; 



export const createCategoryCard = (pCategoryName) => {
    const { todos } = useTodoListContext();

    const data = todos.filter((item) => item.category === pCategoryName);
    const completedTodos = data.filter((item) => item.status === "done").length;
    const percentage = parseFloat(((completedTodos / data.length) * 100).toFixed(1));
    const total = data.length;
    
    return (
        <CategoryCard key={data[0].id} category={pCategoryName} completed={completedTodos} total={total} percentage={percentage} />
    )

}