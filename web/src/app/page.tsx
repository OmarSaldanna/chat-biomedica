import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 sm:p-24 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/20 blur-[120px] pointer-events-none" />

      {/* Header Section */}
      <header className="z-10 w-full max-w-5xl text-center space-y-6 animate-fade-in-up">
        <div className="inline-flex items-center rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-sm font-medium text-indigo-300 backdrop-blur-sm mb-4">
          Prácticum II
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-4">
          Base de Datos Abiertas para <br className="hidden sm:block" />
          <span className="text-gradient">Compuestos Biológicos</span>
        </h1>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Plataforma interoperable diseñada para unificar el acceso a bases de datos científicas abiertas, facilitando la investigación en bioinformática, farmacología e ingeniería biomédica.
        </p>
        <div className="pt-4 text-sm text-slate-400 flex flex-col sm:flex-row justify-center gap-2 sm:gap-6">
          <span>Elaborado por: <strong>Karen Anneth Franco Llamas</strong></span>
          <span className="hidden sm:block">•</span>
          <span>Universidad Anáhuac México Norte</span>
        </div>
      </header>

      {/* Origin and Problem Statement */}
      <section className="z-10 w-full max-w-5xl mt-24 space-y-12">
        <div className="glass-card p-8 sm:p-12 rounded-2xl relative overflow-hidden group">
           <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
           <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-white flex items-center gap-3">
             <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
             </span>
             El Origen del Proyecto
           </h2>
           <p className="text-slate-300 leading-relaxed mb-4">
             El volumen de datos biológicos crece exponencialmente y la información suele estar fragmentada en múltiples repositorios. Esta dispersión dificulta la consolidación del conocimiento, exigiendo largas horas a los científicos buscando en distintas fuentes que no siempre cumplen con estándares de calidad.
           </p>
           <p className="text-slate-300 leading-relaxed">
             Basado en los <strong>Principios FAIR</strong> (Findable, Accessible, Interoperable, Reusable), este proyecto busca resolver la barrera técnica del acceso. La plataforma centraliza las bases más robustas, previniendo mala praxis de información y acelerando el descubrimiento en biotecnología a través de un esquema estructurado e interoperable.
           </p>
        </div>

        {/* Selected Databases Grid */}
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-2">Bases de Datos Integradas</h2>
            <p className="text-slate-400">Repositorios seleccionados tras evaluación técnica exhaustiva.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'PubChem', desc: 'Compuestos químicos, propiedades moleculares y bioensayos.', color: 'from-blue-500/20 to-blue-600/5' },
              { title: 'ChEMBL', desc: 'Compuestos bioactivos y datos de bioactividad experimental.', color: 'from-emerald-500/20 to-emerald-600/5' },
              { title: 'Protein Data Bank (PDB)', desc: 'Estructuras tridimensionales de proteínas y macromoléculas biológicas.', color: 'from-orange-500/20 to-orange-600/5' },
              { title: 'UniProt', desc: 'Secuencias de proteínas y rigurosas anotaciones funcionales.', color: 'from-purple-500/20 to-purple-600/5' },
              { title: 'GenBank', desc: 'Secuencias genéticas de ADN y ARN accesibles globalmente.', color: 'from-cyan-500/20 to-cyan-600/5' },
            ].map((db, idx) => (
              <div key={idx} className="glass-card p-6 rounded-xl hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${db.color} opacity-50`} />
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold text-white mb-2">{db.title}</h3>
                  <p className="text-sm text-slate-300">{db.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action (Chat Button) */}
      <section className="z-10 mt-24 mb-12 text-center">
        <div className="inline-flex flex-col items-center">
          <Link
            href="/chat"
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-indigo-600/20 px-8 font-medium text-indigo-300 border border-indigo-500/30 transition-all hover:bg-indigo-600/30 hover:text-white hover:border-indigo-500/50"
          >
            <span className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
              Ir al Chat
            </span>
            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-150%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(150%)]">
              <div className="relative h-full w-8 bg-white/10" />
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
