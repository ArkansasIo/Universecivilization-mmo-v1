import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShipUpgrades } from '../../hooks/useShipUpgrades';
import PageLoading from '@/components/PageLoading';

export default function ShipUpgradesPage() {
  const navigate = useNavigate();
  const playerId = localStorage.getItem('userId') || '';
  const { ships, loading, upgradeTypes, installUpgrade, removeUpgrade, upgradeShipLevel } = useShipUpgrades(playerId);
  const [selectedShip, setSelectedShip] = useState<string | null>(null);
  const [selectedUpgradeType, setSelectedUpgradeType] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleRemoveUpgrade = async (upgradeId: string) => {
    setToastMessage(null);
    if (!confirm('Remove this upgrade? You will not get resources back.')) return;
    
    const result = await removeUpgrade(upgradeId);
    setToastMessage({ text: result.message, type: result.success ? 'success' : 'error' });
  };

  const handleUpgradeLevel = async (shipId: string) => {
    setToastMessage(null);
    const result = await upgradeShipLevel(shipId);
    setToastMessage({ text: result.message, type: result.success ? 'success' : 'error' });
  };

  if (loading) {
    return <PageLoading message="Loading ship upgrades..." className="h-64 text-cyan-400" />;
  }

  return (
    <div className="p-8">
      {/* ── Toast ─── */}
      {toastMessage && (
        <div
          className={`mb-4 px-5 py-3 rounded-lg flex items-center justify-between border ${
            toastMessage.type === 'success'
              ? 'bg-green-500/15 border-green-500/30 text-green-400'
              : 'bg-red-500/15 border-red-500/30 text-red-400'
          }`}
        >
          <span className="text-sm font-semibold flex items-center gap-2">
            <i className={`${toastMessage.type === 'success' ? 'ri-checkbox-circle-fill' : 'ri-error-warning-fill'} text-lg`}></i>
            {toastMessage.text}
          </span>
          <button onClick={() => setToastMessage(null)} className="hover:opacity-70 cursor-pointer">
            <i className="ri-close-line"></i>
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Ship Upgrades</h1>
          <p className="text-slate-400">Enhance your ships with powerful modules</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/fleet')}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors whitespace-nowrap flex items-center gap-2"
          >
            <i className="ri-ship-line"></i>
            View Fleet
          </button>
          <button
            onClick={() => navigate('/shipyard')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors whitespace-nowrap flex items-center gap-2"
          >
            <i className="ri-tools-line"></i>
            Shipyard
          </button>
        </div>
      </div>

      {ships.length === 0 ? (
        <div className="bg-slate-900 rounded-lg p-12 text-center">
          <i className="ri-ship-line text-6xl text-slate-600 mb-4"></i>
          <h3 className="text-xl font-semibold text-white mb-2">No Ships Available</h3>
          <p className="text-slate-400 mb-6">Build ships in the Shipyard to upgrade them</p>
          <button
            onClick={() => navigate('/shipyard')}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors whitespace-nowrap"
          >
            Go to Shipyard
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {ships.map((ship) => {
            const usedSlots = ship.upgrades.length;
            const totalSlots = ship.upgrade_slots;
            const requiredExp = ship.ship_level * 1000;
            const expProgress = (ship.experience / requiredExp) * 100;

            return (
              <div key={ship.id} className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{ship.ship_type}</h3>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-cyan-400">Level {ship.ship_level}</span>
                      <span className="text-slate-400">Quantity: {ship.quantity}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-400 mb-1">Upgrade Slots</div>
                    <div className="text-lg font-bold text-white">{usedSlots}/{totalSlots}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-slate-400">Experience</span>
                    <span className="text-cyan-400">{ship.experience}/{requiredExp}</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                      style={{ width: `${Math.min(expProgress, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-slate-800 rounded-lg p-3 text-center">
                    <i className="ri-sword-line text-red-400 text-xl mb-1"></i>
                    <div className="text-xs text-slate-400">Attack</div>
                    <div className="text-sm font-bold text-white">+{ship.total_attack_bonus}%</div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-3 text-center">
                    <i className="ri-shield-line text-blue-400 text-xl mb-1"></i>
                    <div className="text-xs text-slate-400">Defense</div>
                    <div className="text-sm font-bold text-white">+{ship.total_defense_bonus}%</div>
                  </div>
                  <div className="bg-slate-800 rounded-lg p-3 text-center">
                    <i className="ri-rocket-line text-cyan-400 text-xl mb-1"></i>
                    <div className="text-xs text-slate-400">Speed</div>
                    <div className="text-sm font-bold text-white">+{ship.total_speed_bonus}%</div>
                  </div>
                </div>

                {ship.upgrades.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm font-semibold text-white mb-2">Installed Upgrades</div>
                    <div className="space-y-2">
                      {ship.upgrades.map((upgrade) => {
                        const upgradeInfo = upgradeTypes.find(u => u.type === upgrade.upgrade_type);
                        return (
                          <div key={upgrade.id} className="flex items-center justify-between bg-slate-800 rounded-lg p-3">
                            <div className="flex items-center gap-3">
                              <i className={`${upgradeInfo?.icon} text-cyan-400 text-xl`}></i>
                              <div>
                                <div className="text-sm font-semibold text-white">{upgradeInfo?.name}</div>
                                <div className="text-xs text-slate-400">Level {upgrade.level} • +{upgrade.bonus_value}% {upgradeInfo?.bonus}</div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveUpgrade(upgrade.id)}
                              className="px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded text-xs transition-colors whitespace-nowrap"
                            >
                              Remove
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedShip(ship.id);
                    }}
                    disabled={usedSlots >= totalSlots}
                    className="flex-1 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors whitespace-nowrap text-sm"
                  >
                    <i className="ri-add-line mr-1"></i>
                    Install Upgrade
                  </button>
                  <button
                    onClick={() => handleUpgradeLevel(ship.id)}
                    disabled={ship.experience < requiredExp}
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-colors whitespace-nowrap text-sm"
                  >
                    <i className="ri-arrow-up-line mr-1"></i>
                    Level Up
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
