import { useState } from 'react';
import { Link } from 'react-router-dom';

const GOLD = '#d4a853';
const BORDER = '#1e2a36';
const CARD_BG = '#080b0f';

interface DiplomaticRelation {
  id: string;
  allianceId: string;
  allianceName: string;
  allianceTag: string;
  members: number;
  power: number;
  status: 'ally' | 'nap' | 'war' | 'neutral' | 'pending';
  since: string;
  treaty?: {
    type: string;
    terms: string[];
    expires?: string;
  };
}

interface DiplomaticAction {
  id: string;
  type: 'alliance-request' | 'nap-proposal' | 'war-declaration' | 'peace-offer' | 'trade-agreement';
  from: string;
  to: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: string;
  terms?: string[];
}

export default function DiplomacyPage() {
  const [activeTab, setActiveTab] = useState<'relations' | 'actions' | 'treaties' | 'history'>('relations');
  const [selectedRelation, setSelectedRelation] = useState<DiplomaticRelation | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const relations: DiplomaticRelation[] = [
    {
      id: '1', allianceId: 'a1', allianceName: 'Galactic Federation', allianceTag: '[GF]', members: 450, power: 125000000,
      status: 'ally', since: '2024-01-15',
      treaty: { type: 'Mutual Defense Pact', terms: ['Mutual defense against external threats','Resource sharing during emergencies','Joint military operations allowed','Technology exchange permitted','Free passage through territories'], expires: '2025-01-15' }
    },
    {
      id: '2', allianceId: 'a2', allianceName: 'Stellar Empire', allianceTag: '[SE]', members: 380, power: 98000000,
      status: 'nap', since: '2024-03-20',
      treaty: { type: 'Non-Aggression Pact', terms: ['No hostile actions for 6 months','Neutral trade relations','No espionage activities','Respect territorial boundaries'], expires: '2024-09-20' }
    },
    {
      id: '3', allianceId: 'a3', allianceName: 'Dark Legion', allianceTag: '[DL]', members: 520, power: 145000000,
      status: 'war', since: '2024-04-01',
      treaty: { type: 'State of War', terms: ['Active military conflict','All members are valid targets','No trade or diplomacy','Espionage encouraged'] }
    },
    {
      id: '4', allianceId: 'a4', allianceName: 'Nova Collective', allianceTag: '[NC]', members: 280, power: 72000000,
      status: 'neutral', since: '2024-02-10'
    },
    {
      id: '5', allianceId: 'a5', allianceName: 'Void Hunters', allianceTag: '[VH]', members: 195, power: 58000000,
      status: 'pending', since: '2024-05-15',
      treaty: { type: 'Alliance Proposal', terms: ['Mutual defense agreement','Joint research projects','Resource trading at 10% discount','Shared intelligence network'] }
    }
  ];

  const actions: DiplomaticAction[] = [
    { id: '1', type: 'alliance-request', from: 'Void Hunters [VH]', to: 'Your Alliance', status: 'pending', timestamp: '2024-05-15 14:30', terms: ['Mutual defense pact','Technology sharing','Joint military operations'] },
    { id: '2', type: 'peace-offer', from: 'Your Alliance', to: 'Dark Legion [DL]', status: 'rejected', timestamp: '2024-05-10 09:15', terms: ['Cease all hostilities','Return captured territories','War reparations: 50M resources'] },
    { id: '3', type: 'trade-agreement', from: 'Nova Collective [NC]', to: 'Your Alliance', status: 'accepted', timestamp: '2024-05-05 16:45', terms: ['Preferential trade rates','15% discount on all trades','Priority access to rare resources'] }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ally': return 'emerald';
      case 'nap': return 'blue';
      case 'war': return 'red';
      case 'neutral': return 'gray';
      case 'pending': return 'amber';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ally': return 'ri-shield-check-line';
      case 'nap': return 'ri-hand-heart-line';
      case 'war': return 'ri-sword-line';
      case 'neutral': return 'ri-subtract-line';
      case 'pending': return 'ri-time-line';
      default: return 'ri-question-line';
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'alliance-request': return 'ri-team-line';
      case 'nap-proposal': return 'ri-hand-heart-line';
      case 'war-declaration': return 'ri-sword-line';
      case 'peace-offer': return 'ri-hand-heart-line';
      case 'trade-agreement': return 'ri-exchange-line';
      default: return 'ri-file-line';
    }
  };

  return (
    <div className="min-h-screen text-white" style={{ background: '#05080d' }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-5xl font-black mb-2" style={{ color: GOLD }}>
              Diplomatic Relations
            </h1>
            <p className="text-ogame-muted text-lg">Manage alliances, treaties, and diplomatic actions</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-lg px-4 py-2" style={{ background: CARD_BG, border: '1px solid rgba(52,211,153,0.3)' }}>
              <div className="text-xs text-ogame-dim mb-1">Allies</div>
              <div className="text-xl font-bold text-emerald-400">{relations.filter(r => r.status === 'ally').length}</div>
            </div>
            <div className="rounded-lg px-4 py-2" style={{ background: CARD_BG, border: '1px solid rgba(239,68,68,0.3)' }}>
              <div className="text-xs text-ogame-dim mb-1">Wars</div>
              <div className="text-xl font-bold text-red-400">{relations.filter(r => r.status === 'war').length}</div>
            </div>
            <div className="rounded-lg px-4 py-2" style={{ background: CARD_BG, border: '1px solid rgba(245,158,11,0.3)' }}>
              <div className="text-xs text-ogame-dim mb-1">Pending</div>
              <div className="text-xl font-bold text-amber-400">{relations.filter(r => r.status === 'pending').length}</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'relations', name: 'Relations', icon: 'ri-team-line' },
            { id: 'actions', name: 'Actions', icon: 'ri-file-list-line' },
            { id: 'treaties', name: 'Treaties', icon: 'ri-file-text-line' },
            { id: 'history', name: 'History', icon: 'ri-history-line' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'text-amber-400'
                  : 'text-ogame-muted hover:text-white'
              }`}
              style={activeTab === tab.id
                ? { background: 'rgba(212,168,83,0.1)', border: `1px solid rgba(212,168,83,0.3)` }
                : { background: CARD_BG, border: `1px solid ${BORDER}` }
              }
            >
              <i className={`${tab.icon} w-5 h-5 flex items-center justify-center`}></i>
              <span className="font-medium">{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Relations Tab */}
        {activeTab === 'relations' && (
          <div className="grid grid-cols-1 gap-4">
            {relations.map(relation => (
              <div
                key={relation.id}
                className="rounded-xl p-6 transition-all cursor-pointer"
                style={{
                  background: CARD_BG,
                  border: `1px solid ${BORDER}`,
                }}
                onClick={() => { setSelectedRelation(relation); setShowDetails(true); }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-br flex items-center justify-center ${
                      relation.status === 'ally' ? 'from-emerald-500 to-emerald-700' :
                      relation.status === 'nap' ? 'from-blue-500 to-blue-700' :
                      relation.status === 'war' ? 'from-red-500 to-red-700' :
                      relation.status === 'pending' ? 'from-amber-500 to-amber-700' :
                      'from-gray-500 to-gray-700'
                    }`}>
                      <i className={`${getStatusIcon(relation.status)} text-3xl text-white w-10 h-10 flex items-center justify-center`}></i>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-2xl font-bold text-white">{relation.allianceName}</h3>
                        <span className="text-lg text-ogame-muted">{relation.allianceTag}</span>
                        <span className={`text-xs px-3 py-1 rounded-full border font-bold uppercase text-${getStatusColor(relation.status)}-400 bg-${getStatusColor(relation.status)}-500/20 border-${getStatusColor(relation.status)}-500/50`}>
                          {relation.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-ogame-muted">
                        <span><i className="ri-team-line mr-1 w-4 h-4 inline-flex items-center justify-center"></i>{relation.members} Members</span>
                        <span><i className="ri-sword-line mr-1 w-4 h-4 inline-flex items-center justify-center"></i>{(relation.power / 1000000).toFixed(1)}M Power</span>
                        <span><i className="ri-calendar-line mr-1 w-4 h-4 inline-flex items-center justify-center"></i>Since {relation.since}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {relation.status === 'ally' && (
                      <button className="px-4 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer" style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' }}>
                        <i className="ri-message-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>Contact
                      </button>
                    )}
                    {relation.status === 'war' && (
                      <button className="px-4 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }}>
                        <i className="ri-hand-heart-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>Offer Peace
                      </button>
                    )}
                    {relation.status === 'pending' && (
                      <>
                        <button className="px-4 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer" style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' }}>
                          <i className="ri-check-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>Accept
                        </button>
                        <button className="px-4 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }}>
                          <i className="ri-close-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>Reject
                        </button>
                      </>
                    )}
                    {relation.status === 'neutral' && (
                      <button className="px-4 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer" style={{ background: 'rgba(212,168,83,0.12)', color: GOLD, border: `1px solid rgba(212,168,83,0.25)` }}>
                        <i className="ri-hand-heart-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>Propose NAP
                      </button>
                    )}
                    <button className="px-4 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer" style={{ background: 'rgba(255,255,255,0.05)', color: '#8892aa', border: `1px solid ${BORDER}` }}>
                      <i className="ri-information-line w-4 h-4 inline-flex items-center justify-center"></i>
                    </button>
                  </div>
                </div>
                {relation.treaty && (
                  <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${BORDER}` }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-amber-400">{relation.treaty.type}</span>
                      {relation.treaty.expires && <span className="text-xs text-ogame-dim">Expires: {relation.treaty.expires}</span>}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {relation.treaty.terms.slice(0, 2).map((term, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-ogame-muted">
                          <i className="ri-checkbox-circle-fill text-amber-400 mt-0.5 w-4 h-4 flex items-center justify-center"></i>
                          <span>{term}</span>
                        </div>
                      ))}
                    </div>
                    {relation.treaty.terms.length > 2 && (
                      <div className="text-xs text-amber-400 mt-2">+{relation.treaty.terms.length - 2} more terms...</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Actions Tab */}
        {activeTab === 'actions' && (
          <div className="grid grid-cols-1 gap-4">
            {actions.map(action => (
              <div key={action.id} className="rounded-xl p-6"
                style={{
                  background: CARD_BG,
                  border: action.status === 'pending' ? '1px solid rgba(245,158,11,0.3)' : action.status === 'accepted' ? '1px solid rgba(52,211,153,0.3)' : '1px solid rgba(239,68,68,0.3)'
                }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-lg bg-gradient-to-br flex items-center justify-center ${
                      action.status === 'pending' ? 'from-amber-500 to-amber-700' : action.status === 'accepted' ? 'from-emerald-500 to-emerald-700' : 'from-red-500 to-red-700'
                    }`}>
                      <i className={`${getActionIcon(action.type)} text-2xl text-white w-8 h-8 flex items-center justify-center`}></i>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white capitalize">{action.type.replace('-', ' ')}</h3>
                      <div className="flex items-center gap-2 text-sm text-ogame-muted">
                        <span>From: <span className="text-amber-400">{action.from}</span></span>
                        <i className="ri-arrow-right-line w-4 h-4 flex items-center justify-center"></i>
                        <span>To: <span className="text-teal-400">{action.to}</span></span>
                      </div>
                      <div className="text-xs text-ogame-dim mt-1">{action.timestamp}</div>
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full border font-bold uppercase ${
                    action.status === 'pending' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' :
                    action.status === 'accepted' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' :
                    'bg-red-500/20 border-red-500/50 text-red-400'
                  }`}>{action.status}</span>
                </div>
                {action.terms && (
                  <div className="space-y-2">
                    <div className="text-sm font-bold text-ogame-dim">Terms:</div>
                    {action.terms.map((term, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-ogame-muted rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.03)' }}>
                        <i className="ri-checkbox-circle-fill text-amber-400 mt-0.5 w-4 h-4 flex items-center justify-center"></i>
                        <span>{term}</span>
                      </div>
                    ))}
                  </div>
                )}
                {action.status === 'pending' && (
                  <div className="flex gap-2 mt-4">
                    <button className="flex-1 px-4 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer" style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' }}>
                      <i className="ri-check-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>Accept
                    </button>
                    <button className="flex-1 px-4 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer" style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)' }}>
                      <i className="ri-close-line mr-2 w-4 h-4 inline-flex items-center justify-center"></i>Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Treaties Tab */}
        {activeTab === 'treaties' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {relations.filter(r => r.treaty).map(relation => (
              <div key={relation.id} className="rounded-xl p-6"
                style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{relation.treaty?.type}</h3>
                    <div className="text-sm text-ogame-muted">with {relation.allianceName} {relation.allianceTag}</div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full border font-bold uppercase text-${getStatusColor(relation.status)}-400 bg-${getStatusColor(relation.status)}-500/20 border-${getStatusColor(relation.status)}-500/50`}>
                    {relation.status}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  {relation.treaty?.terms.map((term, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-ogame-muted rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <i className="ri-checkbox-circle-fill text-amber-400 mt-0.5 w-4 h-4 flex items-center justify-center"></i>
                      <span>{term}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-ogame-dim pt-4" style={{ borderTop: `1px solid ${BORDER}` }}>
                  <span>Since: {relation.since}</span>
                  {relation.treaty?.expires && <span>Expires: {relation.treaty.expires}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {[
              { icon: 'ri-sword-line', color: 'from-red-500 to-red-700', title: 'War Declared', desc: 'Dark Legion [DL] declared war on your alliance', date: '2024-04-01 10:30' },
              { icon: 'ri-hand-heart-line', color: 'from-blue-500 to-blue-700', title: 'NAP Signed', desc: 'Non-Aggression Pact with Stellar Empire [SE]', date: '2024-03-20 14:15' },
              { icon: 'ri-shield-check-line', color: 'from-emerald-500 to-emerald-700', title: 'Alliance Formed', desc: 'Mutual Defense Pact with Galactic Federation [GF]', date: '2024-01-15 09:00' },
            ].map((item, idx) => (
              <div key={idx} className="rounded-xl p-6" style={{ background: CARD_BG, border: `1px solid ${BORDER}` }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                    <i className={`${item.icon} text-2xl text-white w-8 h-8 flex items-center justify-center`}></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    <div className="text-sm text-ogame-muted">{item.desc}</div>
                    <div className="text-xs text-ogame-dim">{item.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetails && selectedRelation && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 z-50" onClick={() => setShowDetails(false)}>
          <div className="rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" style={{ background: '#0d1117', border: `1px solid ${BORDER}` }} onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 p-6 z-10" style={{ background: '#0d1117', borderBottom: `1px solid ${BORDER}` }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-bold text-white">{selectedRelation.allianceName}</h2>
                    <span className="text-xl text-ogame-muted">{selectedRelation.allianceTag}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-ogame-muted">
                    <span><i className="ri-team-line mr-1 w-4 h-4 inline-flex items-center justify-center"></i>{selectedRelation.members} Members</span>
                    <span><i className="ri-sword-line mr-1 w-4 h-4 inline-flex items-center justify-center"></i>{(selectedRelation.power / 1000000).toFixed(1)}M Power</span>
                    <span><i className="ri-calendar-line mr-1 w-4 h-4 inline-flex items-center justify-center"></i>Since {selectedRelation.since}</span>
                  </div>
                </div>
                <button onClick={() => setShowDetails(false)} className="text-ogame-muted hover:text-white transition-colors cursor-pointer">
                  <i className="ri-close-line text-2xl w-8 h-8 flex items-center justify-center"></i>
                </button>
              </div>
            </div>
            <div className="p-6">
              {selectedRelation.treaty && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-amber-400 mb-4">{selectedRelation.treaty.type}</h3>
                  <div className="space-y-2">
                    {selectedRelation.treaty.terms.map((term, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-ogame-muted rounded-lg p-3" style={{ background: CARD_BG }}>
                        <i className="ri-checkbox-circle-fill text-amber-400 mt-0.5 w-5 h-5 flex items-center justify-center"></i>
                        <span>{term}</span>
                      </div>
                    ))}
                  </div>
                  {selectedRelation.treaty.expires && (
                    <div className="mt-4 text-sm text-ogame-muted">
                      Treaty expires on: <span className="text-amber-400">{selectedRelation.treaty.expires}</span>
                    </div>
                  )}
                </div>
              )}
              <div className="flex gap-3">
                <button className="flex-1 px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer text-black" style={{ background: 'linear-gradient(90deg, #d4a853, #e2c044)' }}>
                  <i className="ri-message-line mr-2 w-5 h-5 inline-flex items-center justify-center"></i>Send Message
                </button>
                <button className="flex-1 px-6 py-3 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer text-ogame-muted" style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}` }}>
                  <i className="ri-file-text-line mr-2 w-5 h-5 inline-flex items-center justify-center"></i>View Full Treaty
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}