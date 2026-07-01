import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTradeRoutes } from '../../hooks/useTradeRoutes';
import { supabase } from '../../lib/supabase';

export default function TradeRoutesPage() {
  const { user } = useAuth();
  const { routes, createRoute, toggleRoute, deleteRoute } = useTradeRoutes(user?.id || '');
  const [planets, setPlanets] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoute, setNewRoute] = useState({
    fromPlanetId: '',
    toPlanetId: '',
    resourceType: 'metal' as 'metal' | 'crystal' | 'deuterium',
    amountPerHour: 1000
  });

  useEffect(() => {
    if (user?.id) {
      loadPlanets();
    }
  }, [user]);

  const loadPlanets = async () => {
    const { data } = await supabase
      .from('planets')
      .select('*')
      .eq('player_id', user?.id)
      .order('created_at', { ascending: true });

    setPlanets(data || []);
  };

  const handleCreateRoute = async () => {
    if (!newRoute.fromPlanetId || !newRoute.toPlanetId) {
      alert('Please select both source and destination planets');
      return;
    }

    if (newRoute.fromPlanetId === newRoute.toPlanetId) {
      alert('Source and destination must be different planets');
      return;
    }

    const result = await createRoute(
      newRoute.fromPlanetId,
      newRoute.toPlanetId,
      newRoute.resourceType,
      newRoute.amountPerHour
    );

    if (result.success) {
      alert('Trade route created successfully!');
      setShowCreateModal(false);
      setNewRoute({
        fromPlanetId: '',
        toPlanetId: '',
        resourceType: 'metal',
        amountPerHour: 1000
      });
    }
  };

  const handleToggleRoute = async (routeId: string) => {
    await toggleRoute(routeId);
  };

  const handleDeleteRoute = async (routeId: string) => {
    if (confirm('Are you sure you want to delete this trade route?')) {
      await deleteRoute(routeId);
    }
  };

  const getResourceColor = (type: string) => {
    switch (type) {
      case 'metal': return 'text-gray-400';
      case 'crystal': return 'text-blue-400';
      case 'deuterium': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <i className="ri-route-line"></i>
              Trade Routes
            </h1>
            <p className="text-gray-400">Automate resource transportation between your colonies</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <i className="ri-add-line"></i>
            Create Route
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Total Routes</span>
              <i className="ri-route-line text-2xl text-cyan-400"></i>
            </div>
            <p className="text-3xl font-bold text-white">{routes.length}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Active Routes</span>
              <i className="ri-checkbox-circle-line text-2xl text-green-400"></i>
            </div>
            <p className="text-3xl font-bold text-white">
              {routes.filter(r => r.active).length}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Metal Routes</span>
              <i className="ri-copper-coin-line text-2xl text-gray-400"></i>
            </div>
            <p className="text-3xl font-bold text-white">
              {routes.filter(r => r.resource_type === 'metal').length}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">Crystal Routes</span>
              <i className="ri-vip-diamond-line text-2xl text-blue-400"></i>
            </div>
            <p className="text-3xl font-bold text-white">
              {routes.filter(r => r.resource_type === 'crystal').length}
            </p>
          </div>
        </div>

        {/* Routes List */}
        <div className="space-y-4">
          {routes.map((route) => (
            <div
              key={route.id}
              className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 flex-1">
                  {/* Source Planet */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <i className="ri-planet-line text-2xl text-white"></i>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{route.from_planet?.name || 'Unknown'}</p>
                      <p className="text-gray-400 text-sm">
                        [{route.from_planet?.galaxy}:{route.from_planet?.system}:{route.from_planet?.planet}]
                      </p>
                    </div>
                  </div>

                  {/* Arrow and Resource */}
                  <div className="flex items-center gap-3">
                    <i className="ri-arrow-right-line text-2xl text-cyan-400"></i>
                    <div className="px-4 py-2 bg-white/10 rounded-lg">
                      <p className={`font-semibold capitalize ${getResourceColor(route.resource_type)}`}>
                        {route.resource_type}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {route.amount_per_hour.toLocaleString()}/h
                      </p>
                    </div>
                    <i className="ri-arrow-right-line text-2xl text-cyan-400"></i>
                  </div>

                  {/* Destination Planet */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <i className="ri-planet-line text-2xl text-white"></i>
                    </div>
                    <div>
                      <p className="text-white font-semibold">{route.to_planet?.name || 'Unknown'}</p>
                      <p className="text-gray-400 text-sm">
                        [{route.to_planet?.galaxy}:{route.to_planet?.system}:{route.to_planet?.planet}]
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleRoute(route.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
                      route.active
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                    }`}
                  >
                    {route.active ? 'Active' : 'Paused'}
                  </button>
                  <button
                    onClick={() => handleDeleteRoute(route.id)}
                    className="w-10 h-10 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all flex items-center justify-center"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {routes.length === 0 && (
            <div className="text-center py-12">
              <i className="ri-route-line text-6xl text-gray-600 mb-4"></i>
              <p className="text-gray-400 text-lg mb-2">No trade routes yet</p>
              <p className="text-gray-500 text-sm">Create your first trade route to automate resource transportation</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Route Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-lg border border-white/20 p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-white mb-6">Create Trade Route</h2>

            <div className="space-y-6">
              {/* Source Planet */}
              <div>
                <label className="block text-gray-400 mb-2">Source Planet</label>
                <select
                  value={newRoute.fromPlanetId}
                  onChange={(e) => setNewRoute({ ...newRoute, fromPlanetId: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                >
                  <option value="">Select source planet</option>
                  {planets.map((planet) => (
                    <option key={planet.id} value={planet.id}>
                      {planet.name} [{planet.galaxy}:{planet.system}:{planet.planet}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination Planet */}
              <div>
                <label className="block text-gray-400 mb-2">Destination Planet</label>
                <select
                  value={newRoute.toPlanetId}
                  onChange={(e) => setNewRoute({ ...newRoute, toPlanetId: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                >
                  <option value="">Select destination planet</option>
                  {planets.map((planet) => (
                    <option key={planet.id} value={planet.id}>
                      {planet.name} [{planet.galaxy}:{planet.system}:{planet.planet}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Resource Type */}
              <div>
                <label className="block text-gray-400 mb-2">Resource Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {['metal', 'crystal', 'deuterium'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setNewRoute({ ...newRoute, resourceType: type as any })}
                      className={`px-4 py-3 rounded-lg font-semibold capitalize transition-all ${
                        newRoute.resourceType === type
                          ? 'bg-cyan-500 text-white'
                          : 'bg-white/10 text-gray-400 hover:bg-white/20'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount Per Hour */}
              <div>
                <label className="block text-gray-400 mb-2">Amount Per Hour</label>
                <input
                  type="number"
                  value={newRoute.amountPerHour}
                  onChange={(e) => setNewRoute({ ...newRoute, amountPerHour: parseInt(e.target.value) || 0 })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
                  min="100"
                  step="100"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleCreateRoute}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all whitespace-nowrap"
              >
                Create Route
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 bg-white/10 text-gray-400 rounded-lg font-semibold hover:bg-white/20 transition-all whitespace-nowrap"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}