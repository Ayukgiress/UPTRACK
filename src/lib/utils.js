export function formatMessageTime(date) {
    return new Date(date).toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    })
}

export function groupTodosByTypeAndPriority(todos) {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    
    const groupTodosByType = (todosArray) => {
        const personalTodos = todosArray.filter(todo => todo.taskType === 'personal');
        const groupTodos = todosArray.filter(todo => todo.taskType === 'project' || !todo.taskType);
        
        const sortByPriority = (todosArray) => {
            return [...todosArray].sort((a, b) => {
                return (priorityOrder[a.priority] || 999) - (priorityOrder[b.priority] || 999);
            });
        };
        
        return {
            personal: sortByPriority(personalTodos),
            group: sortByPriority(groupTodos)
        };
    };
    
    return groupTodosByType(todos);
}
