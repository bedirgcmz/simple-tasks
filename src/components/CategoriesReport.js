import { useTodoListContext } from "../context/todos-context";
import CategoryCard from '../components/CategoryCard'; 
import { View, Text, ScrollView } from 'react-native';


export const createCategoryCard = (categoryName, data, completedTodos, total, percentage) => {
    return (
        <CategoryCard 
            key={categoryName} 
            category={categoryName} 
            completed={completedTodos} 
            total={total} 
            percentage={percentage} 
        />
    );
};

const CategoriesReport = () => {
    const { todos, t } = useTodoListContext();

    const categoryNames = Array.from(new Set(todos.map((item) => item.category)));

    return (
        <View horizontal showsHorizontalScrollIndicator={false} className="px-4 mt-4">
            <Text className="text-white text-lg font-bold mb-2">
                {t("Categories_Report")}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {
                    categoryNames.map((categoryName) => {
                        const data = todos.filter((item) => item.category === categoryName);
                        const completedTodos = data.filter((item) => item.status === "done").length;
                        const percentage = parseFloat(((completedTodos / data.length) * 100).toFixed(1));
                        const total = data.length;

                        return createCategoryCard(categoryName, data, completedTodos, total, percentage);
                    })
                }
            </ScrollView>
        </View>
    );
};

export default CategoriesReport;
