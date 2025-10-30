import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import progressService from "@/services/api/progressService";

const Layout = () => {
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
    <div className="min-h-screen bg-background">
      <Header totalStars={totalStars} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet context={{ totalStars }} />
      </main>
    </div>
  );
};

export default Layout;