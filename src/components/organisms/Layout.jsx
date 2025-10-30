import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import progressService from "@/services/api/progressService";
import Header from "@/components/organisms/Header";

const Layout = () => {
  const [totalStars, setTotalStars] = useState(0);

useEffect(() => {
    const loadStars = async () => {
      const progress = await progressService.getCurrentProgress();
      setTotalStars(progress?.totalStars || 0);
    };
    loadStars();
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