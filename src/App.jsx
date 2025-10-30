import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import Home from "@/components/pages/Home";
import ChallengePage from "@/components/pages/ChallengePage";
import Progress from "@/components/pages/Progress";
import AvatarCustomization from "@/components/pages/AvatarCustomization";
import progressService from "@/services/api/progressService";

function App() {
  const [totalStars, setTotalStars] = useState(0);

  useEffect(() => {
    const loadStars = async () => {
      const progress = await progressService.getCurrentProgress();
      setTotalStars(progress?.totalStars || 0);
    };
    loadStars();

    const interval = setInterval(loadStars, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Header totalStars={totalStars} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
<Route path="/" element={<Home />} />
<Route path="/challenges/:subject" element={<ChallengePage />} />
            <Route path="/challenges/:subject/timed" element={<ChallengePage />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/avatar" element={<AvatarCustomization />} />
          </Routes>
        </main>
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;