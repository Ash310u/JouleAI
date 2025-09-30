import { useState } from 'react';

const Sidebar = ({ store, products, onChange, onSave }) => {
  const [activeTab, setActiveTab] = useState('pages');

  const addSection = (type) => {
    const next = { ...(store || {}), layout: { ...(store?.layout || {}), sections: [...(store?.layout?.sections || []), defaultSection(type)] } };
    onChange(next);
  };

  const removeSection = (index) => {
    const nextSections = [...(store?.layout?.sections || [])];
    nextSections.splice(index, 1);
    const next = { ...(store || {}), layout: { ...(store?.layout || {}), sections: nextSections } };
    onChange(next);
  };

  const moveSection = (from, to) => {
    const list = [...(store?.layout?.sections || [])];
    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);
    onChange({ ...store, layout: { ...(store?.layout || {}), sections: list } });
  };

  const updateSectionField = (index, field, value) => {
    const list = [...(store?.layout?.sections || [])];
    list[index] = { ...list[index], [field]: value };
    onChange({ ...store, layout: { ...(store?.layout || {}), sections: list } });
  };

  const updateTheme = (field, value) => {
    onChange({ ...store, theme: { ...(store?.theme || {}), [field]: value } });
  };

  return (
    <div className="w-80 border-r bg-white flex flex-col">
      <div className="p-4 border-b flex space-x-2">
        {['pages','products','theme'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-3 py-1 rounded ${activeTab===tab? 'bg-blue-600 text-white':'bg-gray-100'}`}>{tab.charAt(0).toUpperCase()+tab.slice(1)}</button>
        ))}
      </div>
      <div className="p-4 overflow-auto flex-1">
        {activeTab==='pages' && (
          <div className="space-y-3">
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-gray-100 rounded" onClick={() => addSection('hero')}>Add Hero</button>
              <button className="px-3 py-1 bg-gray-100 rounded" onClick={() => addSection('featuredProducts')}>Add Featured</button>
              <button className="px-3 py-1 bg-gray-100 rounded" onClick={() => addSection('text')}>Add Text</button>
            </div>
            <div className="space-y-2">
              {(store?.layout?.sections || []).map((sec, i) => (
                <div key={i} className="border rounded p-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{sec.type}</div>
                    <div className="space-x-1">
                      <button className="text-xs px-2 py-1 bg-gray-100 rounded" onClick={() => i>0 && moveSection(i, i-1)}>Up</button>
                      <button className="text-xs px-2 py-1 bg-gray-100 rounded" onClick={() => moveSection(i, i+1)}>Down</button>
                      <button className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded" onClick={() => removeSection(i)}>Remove</button>
                    </div>
                  </div>
                  {sec.type==='text' && (
                    <div className="mt-2 space-y-2">
                      <input className="w-full border px-2 py-1 rounded" placeholder="Heading" value={sec.heading||''} onChange={(e)=>updateSectionField(i,'heading',e.target.value)} />
                      <textarea className="w-full border px-2 py-1 rounded" rows={3} placeholder="Body" value={sec.body||''} onChange={(e)=>updateSectionField(i,'body',e.target.value)} />
                    </div>
                  )}
                  {sec.type==='hero' && (
                    <div className="mt-2 space-y-2">
                      <input className="w-full border px-2 py-1 rounded" placeholder="Title" value={sec.title||''} onChange={(e)=>updateSectionField(i,'title',e.target.value)} />
                      <input className="w-full border px-2 py-1 rounded" placeholder="Subtitle" value={sec.subtitle||''} onChange={(e)=>updateSectionField(i,'subtitle',e.target.value)} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab==='products' && (
          <div className="space-y-2">
            {(products||[]).map(p => (
              <div key={p._id} className="border rounded p-2 flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{p.name}</div>
                  <div className="text-xs text-gray-500">${'{'}p.price{'}'}</div>
                </div>
              </div>
            ))}
            <p className="text-xs text-gray-500">Product add/edit/delete managed via editor update API in future.</p>
          </div>
        )}

        {activeTab==='theme' && (
          <div className="space-y-2">
            <label className="block text-sm">Primary Color</label>
            <input type="color" value={store?.theme?.primaryColor || '#2563eb'} onChange={(e)=>updateTheme('primaryColor', e.target.value)} />
            <label className="block text-sm mt-2">Font Family</label>
            <input className="w-full border px-2 py-1 rounded" placeholder="e.g. Inter, system-ui" value={store?.theme?.fontFamily || ''} onChange={(e)=>updateTheme('fontFamily', e.target.value)} />
          </div>
        )}
      </div>
      <div className="p-4 border-t">
        <button onClick={onSave} className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Save</button>
      </div>
    </div>
  );
};

const defaultSection = (type) => {
  if (type==='hero') return { type: 'hero', title: 'Welcome', subtitle: 'Your subtitle' };
  if (type==='featuredProducts') return { type: 'featuredProducts', productIds: [] };
  return { type: 'text', heading: 'Heading', body: 'Write something here...' };
};

export default Sidebar;


