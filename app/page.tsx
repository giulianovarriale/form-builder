export default function Page() {
  return (
    <div className="container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
      <aside className="md:col-span-1">
        <p>Sidebar</p>
      </aside>

      <main className="md:col-span-3">
        <p>Main content</p>
      </main>
    </div>
  );
}
