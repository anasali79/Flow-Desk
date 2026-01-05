# Task Management Dashboard

A modern, responsive Task Management Dashboard built with React.js, Redux Toolkit, and Tailwind CSS.

## Features

- ✅ **Task Management**
  - Display list of tasks with title and status
  - Add new tasks with mandatory title validation
  - Edit existing tasks
  - Delete tasks with confirmation
  - Toggle task status (Pending/Completed)

- 🔍 **Filtering & Search**
  - Filter tasks by All, Completed, or Pending
  - Search tasks by title
  - Search works together with filters

- 🎨 **Theme Support**
  - Light/Dark theme toggle
  - Theme preference persisted in localStorage
  - Smooth theme transitions

- 📱 **Responsive Design**
  - Mobile-friendly interface
  - Responsive layout for all screen sizes

- 🧪 **Testing**
  - Comprehensive test suite with Vitest and React Testing Library
  - Unit tests for components and Redux slices
  - Test coverage for core functionality

## Tech Stack

- **React.js** - UI library
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Axios** - HTTP client
- **Vitest** - Testing framework (Jest-compatible)
- **React Testing Library** - Component testing
- **JSON Server** - Mock API (you'll provide the hosted URL)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure API URL**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=https://your-json-server-url.com
   ```
   
   Or update the `API_BASE_URL` in `src/services/api.js` directly.

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

5. **Run Tests**
   ```bash
   # Run tests in watch mode
   npm test

   # Run tests with UI
   npm run test:ui

   # Run tests with coverage
   npm run test:coverage
   ```

## JSON Server Setup

A sample `db.json` file is included in the root directory. You can use this with your JSON Server.

The application expects a JSON Server with the following structure:

**db.json:**
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Sample Task",
      "status": "pending",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**To run JSON Server locally (optional):**
```bash
npx json-server --watch db.json --port 3001
```

**For hosted JSON Server:**
Once you have your JSON Server hosted, update the `VITE_API_URL` in `.env` file or directly in `src/services/api.js`.

**API Endpoints:**
- `GET /tasks` - Fetch all tasks
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

## Project Structure

```
src/
├── components/          # React components
│   ├── __tests__/      # Component tests
│   ├── AddTask.jsx
│   ├── EditTask.jsx
│   ├── FilterButtons.jsx
│   ├── SearchBar.jsx
│   ├── TaskItem.jsx
│   ├── TaskList.jsx
│   └── ThemeToggle.jsx
├── store/              # Redux store and slices
│   ├── __tests__/      # Redux slice tests
│   ├── store.js
│   ├── taskSlice.js
│   └── themeSlice.js
├── services/           # API services
│   └── api.js
├── test/               # Test utilities
│   ├── setup.js
│   └── test-utils.jsx
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Testing

The project includes comprehensive tests using Vitest and React Testing Library:

- **Component Tests**: Test user interactions and component behavior
- **Redux Tests**: Test state management and reducers
- **Integration Tests**: Test component integration with Redux

Run tests with:
```bash
npm test
```

## Usage

1. **Add a Task**: Enter a task title in the form and click "Add Task"
2. **Edit a Task**: Click the "Edit" button on any task
3. **Delete a Task**: Click the "Delete" button (confirmation required)
4. **Toggle Status**: Click "Mark Complete" or "Mark Pending" to change status
5. **Filter Tasks**: Use the filter buttons (All, Pending, Completed)
6. **Search Tasks**: Type in the search bar to filter by title
7. **Toggle Theme**: Click the theme toggle button in the top-right corner

## Notes

- All API calls are handled asynchronously using Redux Toolkit's `createAsyncThunk`
- Theme preference is saved to localStorage
- The UI updates immediately after any action
- All components are mobile-responsive
- Tests are written using Vitest (Jest-compatible) and React Testing Library
