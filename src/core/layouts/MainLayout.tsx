import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout({ children }: any) {
  return (
    <div className="bg-theme-bodybg min-h-screen">
      <Sidebar />
      <Header />
      <main className="pc-container">
        <div className="pc-content">
          {children}
        </div>
      </main>
    </div>
  );
}