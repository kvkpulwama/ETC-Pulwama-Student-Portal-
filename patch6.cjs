const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminPage.tsx', 'utf8');

const wipeFunc = `  const handleWipeDatabase = async () => {
    if (!window.confirm("Are you sure you want to delete all student records except Jahangir Ahmad Magray? This will wipe the local storage and Supabase database.")) return;
    
    // Filter to keep only Jahangir
    const keep = students.filter(s => s.name.toLowerCase().includes('jahangir ahmad magray'));
    
    try {
      // 1. Delete from Supabase
      const { error } = await supabase.from('students').delete().neq('name', 'Jahangir Ahmad Magray');
      if (error) console.warn('Supabase wipe note:', error);
    } catch (e) {
      console.warn(e);
    }
    
    // 2. Overwrite Local Storage
    localStorage.setItem('etc_registered_students', JSON.stringify(keep));
    
    // 3. Update State
    setStudents(keep);
    showToast('Database wiped successfully! Kept ' + keep.length + ' records.');
  };

  // Export CSV Handler`;

code = code.replace('  // Export CSV Handler', wipeFunc);

const wipeBtn = `              <button
                onClick={handleWipeDatabase}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-sm border border-red-500"
                title="Wipe database except Jahangir"
              >
                <span className="hidden sm:inline">Wipe Database</span>
              </button>

              <button
                onClick={handleSyncAllToSupabase}`;

code = code.replace(`              <button
                onClick={handleSyncAllToSupabase}`, wipeBtn);

fs.writeFileSync('src/pages/AdminPage.tsx', code);
