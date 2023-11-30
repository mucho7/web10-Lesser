import { Routes, Route } from 'react-router-dom';
import ProjectPage from './pages/ProjectPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import BacklogPage from './pages/BacklogPage';
import SprintPage from './pages/SprintPage';
import ReviewPage from './pages/ReviewPage';
import ProjectCreatePage from './pages/ProjectCreatePage';
import { ModalProvider } from './modal/ModalProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <Routes>
          <Route path="/project" element={<ProjectPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/project/create" element={<ProjectCreatePage />} />
          <Route element={<MainPage />}>
            <Route path="/backlog" element={<BacklogPage />} />
            <Route path="/sprint" element={<SprintPage />} />
            <Route path="/review/sprint/*" element={<ReviewPage />} />
          </Route>
        </Routes>
      </ModalProvider>
    </QueryClientProvider>
  );
}

export default App;
