import React, { useState, useEffect } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState('');

  const categories = ['Work', 'Personal', 'Shopping'];

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      priority,
      category,
      dueDate,
      subtasks: []
    };

    if (editId) {
      // Update existing todo
      setTodos(todos.map(todo => 
        todo.id === editId ? { ...todo, ...newTodo } : todo
      ));
      setEditId(null);
    } else {
      // Add new todo
      setTodos([...todos, newTodo]);
    }

    // Reset form
    setInputValue('');
    setPriority('medium');
    setCategory('');
    setDueDate('');
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const addSubtask = (todoId) => {
    setTodos(todos.map(todo => 
      todo.id === todoId 
        ? { 
            ...todo, 
            subtasks: [
              ...todo.subtasks, 
              { id: Date.now(), text: 'New Subtask', completed: false }
            ] 
          } 
        : todo
    ));
  };

  const toggleSubtask = (todoId, subtaskId) => {
    setTodos(todos.map(todo => 
      todo.id === todoId 
        ? {
            ...todo,
            subtasks: todo.subtasks.map(subtask => 
              subtask.id === subtaskId 
                ? { ...subtask, completed: !subtask.completed } 
                : subtask
            )
          }
        : todo
    ));
  };

  const filteredTodos = todos.filter(todo => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'active' && !todo.completed) || 
      (filter === 'completed' && todo.completed);
    
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      
      {/* Todo Input Form */}
      <form onSubmit={addTodo} className="mb-4">
        <div className="flex mb-2">
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter todo item"
            className="flex-1 p-2 border rounded-l"
          />
          <button 
            type="submit" 
            className="bg-blue-500 text-white p-2 rounded-r"
          >
            {editId ? 'Update' : 'Add'}
          </button>
        </div>
        
        {/* Additional Todo Details */}
        <div className="flex space-x-2">
          <select 
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <input 
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="p-2 border rounded"
          />
        </div>
      </form>
      
      {/* Search and Filter */}
      <div className="mb-4 flex space-x-2">
        <input 
          type="text"
          placeholder="Search todos"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      
      {/* Todo List */}
      <div>
        {filteredTodos.map(todo => (
          <div 
            key={todo.id} 
            className={`flex items-center justify-between p-3 border-b ${
              todo.completed ? 'bg-gray-100' : ''
            }`}
          >
            <div className="flex items-center">
              <input 
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleComplete(todo.id)}
                className="mr-2"
              />
              <span 
                className={todo.completed ? 'line-through text-gray-500' : ''}
              >
                {todo.text}
              </span>
              
              {/* Todo Details */}
              <div className="ml-4 text-sm text-gray-600">
                {todo.priority && <span className="mr-2">{todo.priority}</span>}
                {todo.category && <span className="mr-2">{todo.category}</span>}
                {todo.dueDate && <span>{todo.dueDate}</span>}
              </div>
            </div>
            
            {/* Actions */}
            <div>
              <button 
                onClick={() => {
                  setEditId(todo.id);
                  setInputValue(todo.text);
                  setPriority(todo.priority);
                  setCategory(todo.category);
                  setDueDate(todo.dueDate);
                }}
                className="mr-2 text-blue-500"
              >
                Edit
              </button>
              <button 
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodoApp;