
import './App.css';
import Layout from './layout/layout';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/body/pages/home/home'; // Adjust the path as necessary
import AppPage from './components/body/pages/app/app'; // Adjust the path as necessary

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/app" element={<AppPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;