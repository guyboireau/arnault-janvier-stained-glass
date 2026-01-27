
export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-8">Tableau de bord</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Projets</h3>
                    <p className="text-3xl font-bold text-slate-900">--</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Catégories</h3>
                    <p className="text-3xl font-bold text-slate-900">--</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                    <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Vues</h3>
                    <p className="text-3xl font-bold text-slate-900">--</p>
                </div>
            </div>
        </div>
    );
}
