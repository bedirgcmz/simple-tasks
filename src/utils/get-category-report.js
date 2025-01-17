export default function generateCategoryReport(todos) {
    // Gruplama yapmak için kategorilere göre diziyi organize et
    const categoryMap = todos.reduce((acc, todo) => {
      const { category, status } = todo;
      if (!acc[category]) {
        acc[category] = { total: 0, completed: 0 };
      }
      acc[category].total += 1;
      if (status === "done") {
        acc[category].completed += 1;
      }
      return acc;
    }, {});
  
    // Raporu formatlı olarak oluştur
    const report = Object.entries(categoryMap).map(([category, stats]) => {
      const { total, completed } = stats;
      const percentage = ((completed / total) * 100).toFixed(2);
      return `${category}\n${completed}/${total}\n${percentage}%`;
    });
  
    return report.join("\n\n");
  }
  
  
  