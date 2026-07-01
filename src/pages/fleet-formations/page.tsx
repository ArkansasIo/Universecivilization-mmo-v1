import { useState } from 'react';
import { useFleetFormations } from '../../hooks/useFleetFormations';
import PageLoading from '@/components/PageLoading';

export default function FleetFormationsPage() {
  const {
    formations,
    loading,
    formationTemplates,
    createFormation,
    setDefaultFormation,
    deleteFormation,
  } = useFleetFormations();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const handleCreateFormation = async () => {
    if (!selectedTemplate) {
      alert('Please select a formation type');
      return;
    }

    const result = await createFormation(selectedTemplate);
    if (result.success) {
      alert('Formation created successfully!');
      setShowCreateModal(false);
      setSelectedTemplate('');
    } else {
      alert('Failed to create formation');
    }
  };

  const handleSetDefault = async (formationId: string) => {
    const result = await setDefaultFormation(formationId);
    if (result.success) {
      alert('Default formation updated!');
    } else {
      alert('Failed to set default formation');
    }
  };

  const handleDeleteFormation = async (formationId: string) => {
    if (!confirm('Are you sure you want to delete this formation?')) return;

    const result = await deleteFormation(formationId);
    if (result.success) {
      alert('Formation deleted successfully!');
    } else {
      alert('Failed to delete formation');
    }
  };

  if (loading) {
    return <PageLoading message="Loading Formations..." className="h-64 text-white" />;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Fleet Formations</h1>
          <p className="text-gray-400">Tactical positioning for combat advantage</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer"
        >
          <i className="ri-add-line mr-2"></i>
          Create Formation
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {formations.map((formation) => (
          <div key={formation.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{formation.formation_name}</h3>
                <p className="text-gray-400 text-sm capitalize">{formation.formation_type}</p>
              </div>
              {formation.is_default && (
                <span className="px-3 py-1 bg-cyan-900 text-cyan-400 rounded-full text-xs font-semibold whitespace-nowrap">
                  Default
                </span>
              )}
            </div>

            <p className="text-gray-300 text-sm mb-4">{formation.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Attack Bonus:</span>
                <span className={`font-semibold ${formation.bonuses.attack >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formation.bonuses.attack > 0 ? '+' : ''}{formation.bonuses.attack}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Defense Bonus:</span>
                <span className={`font-semibold ${formation.bonuses.defense >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formation.bonuses.defense > 0 ? '+' : ''}{formation.bonuses.defense}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Speed Bonus:</span>
                <span className={`font-semibold ${formation.bonuses.speed >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formation.bonuses.speed > 0 ? '+' : ''}{formation.bonuses.speed}%
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              {!formation.is_default && (
                <button
                  onClick={() => handleSetDefault(formation.id)}
                  className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer"
                >
                  Set Default
                </button>
              )}
              <button
                onClick={() => handleDeleteFormation(formation.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer"
              >
                <i className="ri-delete-bin-line"></i>
              </button>
            </div>
          </div>
        ))}
      </div>

      {formations.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <i className="ri-shield-star-line text-6xl text-gray-600"></i>
          </div>
          <p className="text-gray-400 text-lg mb-2">No formations created</p>
          <p className="text-gray-500 text-sm">Create your first tactical formation</p>
        </div>
      )}

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-4">Available Formation Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {formationTemplates.map((template) => (
            <div key={template.type} className="bg-gray-900 rounded-lg p-4 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-2">{template.name}</h3>
              <p className="text-gray-400 text-sm mb-3">{template.description}</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Attack:</span>
                  <span className={template.bonuses.attack >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {template.bonuses.attack > 0 ? '+' : ''}{template.bonuses.attack}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Defense:</span>
                  <span className={template.bonuses.defense >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {template.bonuses.defense > 0 ? '+' : ''}{template.bonuses.defense}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Speed:</span>
                  <span className={template.bonuses.speed >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {template.bonuses.speed > 0 ? '+' : ''}{template.bonuses.speed}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Create Formation</h2>

            <div className="mb-6">
              <label className="block text-gray-400 mb-2">Formation Type</label>
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700"
              >
                <option value="">Select a formation type</option>
                {formationTemplates.map((template) => (
                  <option key={template.type} value={template.type}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedTemplate && (
              <div className="bg-gray-900 rounded-lg p-4 mb-6 border border-gray-700">
                <p className="text-gray-400 text-sm mb-3">
                  {formationTemplates.find(t => t.type === selectedTemplate)?.description}
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Attack:</span>
                    <span className="text-white font-semibold">
                      {formationTemplates.find(t => t.type === selectedTemplate)?.bonuses.attack}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Defense:</span>
                    <span className="text-white font-semibold">
                      {formationTemplates.find(t => t.type === selectedTemplate)?.bonuses.defense}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Speed:</span>
                    <span className="text-white font-semibold">
                      {formationTemplates.find(t => t.type === selectedTemplate)?.bonuses.speed}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setSelectedTemplate('');
                }}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFormation}
                className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
