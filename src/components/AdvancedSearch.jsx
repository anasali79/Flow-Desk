import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectFilteredTasks } from '../store/taskSlice';
import { selectAllComments } from '../store/commentSlice';

const AdvancedSearch = ({ searchQuery, onClose, onSearch }) => {
  const [activeSearchType, setActiveSearchType] = useState('all'); // 'all', 'tasks', 'comments', 'categories', 'tracking'
  const tasks = useSelector(selectFilteredTasks);
  const comments = useSelector(selectAllComments);
  
  // Filter results based on search query and active search type
  const filteredTasks = activeSearchType === 'all' || activeSearchType === 'tasks'
    ? tasks.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];
  
  const filteredComments = activeSearchType === 'all' || activeSearchType === 'comments'
    ? comments.filter(comment => 
        comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (comment.taskTitle && comment.taskTitle.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];
  
  // For categories and tracking, we'll use sample data since we need to define what these are
  const categories = ['Work', 'Personal', 'Shopping', 'Health', 'Finance', 'Project']; // Sample categories
  const filteredCategories = activeSearchType === 'all' || activeSearchType === 'categories'
    ? categories.filter(category => 
        category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];
  
  // Sample tracking data (this would come from your store in a real implementation)
  const trackingItems = [
    { id: 1, name: 'Project Report', type: 'Report' },
    { id: 2, name: 'Meeting Notes', type: 'Notes' },
    { id: 3, name: 'Budget Tracking', type: 'Finance' },
    { id: 4, name: 'Client Feedback', type: 'Feedback' }
  ];
  
  const filteredTracking = activeSearchType === 'all' || activeSearchType === 'tracking'
    ? trackingItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Close the search dropdown if query is empty
  useEffect(() => {
    if (!searchQuery) {
      onClose();
    }
  }, [searchQuery, onClose]);

  if (!searchQuery) return null;

  return (
    <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      <div className="p-3 border-b border-gray-100">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSearchType('all')}
            className={`px-3 py-1 text-xs rounded-full ${
              activeSearchType === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveSearchType('tasks')}
            className={`px-3 py-1 text-xs rounded-full ${
              activeSearchType === 'tasks' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => setActiveSearchType('comments')}
            className={`px-3 py-1 text-xs rounded-full ${
              activeSearchType === 'comments' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Comments
          </button>
          <button
            onClick={() => setActiveSearchType('categories')}
            className={`px-3 py-1 text-xs rounded-full ${
              activeSearchType === 'categories' 
                ? 'bg-purple-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveSearchType('tracking')}
            className={`px-3 py-1 text-xs rounded-full ${
              activeSearchType === 'tracking' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tracking
          </button>
        </div>
      </div>
      
      <div className="p-3">
        {/* Tasks Results */}
        {filteredTasks.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-700 mb-2">Tasks ({filteredTasks.length})</h3>
            <div className="space-y-1">
              {filteredTasks.slice(0, 5).map(task => (
                <div 
                  key={task.id} 
                  className="p-2 hover:bg-gray-50 rounded cursor-pointer flex items-center gap-2"
                  onClick={() => onSearch('tasks', task)}
                >
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <span className="text-sm text-gray-800">{task.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Comments Results */}
        {filteredComments.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-700 mb-2">Comments ({filteredComments.length})</h3>
            <div className="space-y-1">
              {filteredComments.slice(0, 5).map(comment => (
                <div 
                  key={comment.id} 
                  className="p-2 hover:bg-gray-50 rounded cursor-pointer flex items-center gap-2"
                  onClick={() => onSearch('comments', comment)}
                >
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-sm text-gray-800 truncate">{comment.content}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Categories Results */}
        {filteredCategories.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-700 mb-2">Categories ({filteredCategories.length})</h3>
            <div className="space-y-1">
              {filteredCategories.slice(0, 5).map((category, index) => (
                <div 
                  key={index} 
                  className="p-2 hover:bg-gray-50 rounded cursor-pointer flex items-center gap-2"
                  onClick={() => onSearch('categories', category)}
                >
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  <span className="text-sm text-gray-800">{category}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Tracking Results */}
        {filteredTracking.length > 0 && (
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-700 mb-2">Tracking ({filteredTracking.length})</h3>
            <div className="space-y-1">
              {filteredTracking.slice(0, 5).map(item => (
                <div 
                  key={item.id} 
                  className="p-2 hover:bg-gray-50 rounded cursor-pointer flex items-center gap-2"
                  onClick={() => onSearch('tracking', item)}
                >
                  <div className="w-2 h-2 rounded-full bg-red-400"></div>
                  <span className="text-sm text-gray-800">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* No results */}
        {filteredTasks.length === 0 && 
         filteredComments.length === 0 && 
         filteredCategories.length === 0 && 
         filteredTracking.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No results found for "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedSearch;