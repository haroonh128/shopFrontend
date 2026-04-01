import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout({ children }: any) {
  return (
    <div className="flex h-screen bg-theme-bodybg">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="p-4 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}