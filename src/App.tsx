import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./screens/home/Home";
import Dashboard from "./screens/dashboard/Dashboard";
import RegisterPage from "./screens/registration/Register";
import InvitePage from "./screens/invite/InvitePage";
import CourseScreen from "./screens/course/Course";
import CourseList from "./screens/course/CourseList";
import CreateCourse from "./screens/course/CreateCourse";
import ViewCourse from "./screens/course/ViewCourse";
import CreateTask from "./screens/task/CreateTask";
import TaskPage from "./screens/task/Task";
import TaskList from "./screens/task/TaskList";
import ViewTask from "./screens/task/ViewTask";
import SubmitTask from "./screens/task/SubmitTask";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register-admin" element={<RegisterPage admin={true} />} />
        <Route path="/invites" element={<InvitePage />} />
        <Route path="/course" element={<CourseScreen />} />
        <Route path="/course/all" element={<CourseList all={true} />} />
        <Route path="/user/courses" element={<CourseList all={false} />} />
        <Route path="/course/create" element={<CreateCourse />} />
        <Route path="/course/view" element={<ViewCourse />} />
        <Route path="/assignment/create" element={<CreateTask />} />
        <Route path="/assignments" element={<TaskPage />} />
        <Route path="/assignments/ongoing" element={<TaskList />} />
        <Route path="/assignment/view" element={<ViewTask />} />
        <Route path="/assignment/submit" element={<SubmitTask />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
