import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface DiplomaticRelation {
  id: string;
  player_id: string;
  target_player_id: string;
  target_player_name: string;
  relation_type: 'war' | 'peace' | 'alliance' | 'trade' | 'non-aggression';
  status: 'active' | 'pending' | 'expired' | 'broken';
  trust_level: number;
  trade_bonus: number;
  military_access: boolean;
  created_at: string;
  expires_at?: string;
}

export interface DiplomaticProposal {
  id: string;
  from_player_id: string;
  from_player_name: string;
  to_player_id: string;
  proposal_type: 'alliance' | 'trade' | 'peace' | 'non-aggression' | 'war';
  terms: {
    duration?: number;
    trade_bonus?: number;
    military_access?: boolean;
    tribute?: {
      metal?: number;
      crystal?: number;
      deuterium?: number;
    };
  };
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  created_at: string;
  expires_at: string;
}

export interface DiplomaticAction {
  type: 'declare_war' | 'offer_peace' | 'propose_alliance' | 'break_alliance' | 'send_tribute' | 'request_aid';
  target_player_id: string;
  terms?: any;
}

export const useDiplomacy = (playerId: string) => {
  const [relations, setRelations] = useState<DiplomaticRelation[]>([]);
  const [proposals, setProposals] = useState<DiplomaticProposal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (playerId) {
      loadDiplomaticData();
    }
  }, [playerId]);

  const loadDiplomaticData = async () => {
    try {
      setLoading(true);

      // Load relations
      const { data: relationsData, error: relationsError } = await supabase
        .from('diplomatic_relations')
        .select('*')
        .or(`player_id.eq.${playerId},target_player_id.eq.${playerId}`);

      if (relationsError) throw relationsError;

      // Load proposals
      const { data: proposalsData, error: proposalsError } = await supabase
        .from('diplomatic_proposals')
        .select('*')
        .or(`from_player_id.eq.${playerId},to_player_id.eq.${playerId}`)
        .eq('status', 'pending');

      if (proposalsError) throw proposalsError;

      setRelations(relationsData || []);
      setProposals(proposalsData || []);
    } catch (error) {
      console.error('Error loading diplomatic data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendProposal = async (
    targetPlayerId: string,
    proposalType: DiplomaticProposal['proposal_type'],
    terms: DiplomaticProposal['terms']
  ) => {
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // Proposals expire in 7 days

      const { error } = await supabase
        .from('diplomatic_proposals')
        .insert({
          from_player_id: playerId,
          to_player_id: targetPlayerId,
          proposal_type: proposalType,
          terms,
          status: 'pending',
          expires_at: expiresAt.toISOString()
        });

      if (error) throw error;

      await loadDiplomaticData();
      return { success: true };
    } catch (error) {
      console.error('Error sending proposal:', error);
      return { success: false, error };
    }
  };

  const respondToProposal = async (proposalId: string, accept: boolean) => {
    try {
      const proposal = proposals.find(p => p.id === proposalId);
      if (!proposal) return { success: false, error: 'Proposal not found' };

      // Update proposal status
      const { error: updateError } = await supabase
        .from('diplomatic_proposals')
        .update({ status: accept ? 'accepted' : 'rejected' })
        .eq('id', proposalId);

      if (updateError) throw updateError;

      // If accepted, create diplomatic relation
      if (accept) {
        const expiresAt = proposal.terms.duration
          ? new Date(Date.now() + proposal.terms.duration * 24 * 60 * 60 * 1000)
          : null;

        const { error: relationError } = await supabase
          .from('diplomatic_relations')
          .insert({
            player_id: proposal.from_player_id,
            target_player_id: proposal.to_player_id,
            relation_type: proposal.proposal_type,
            status: 'active',
            trust_level: 50,
            trade_bonus: proposal.terms.trade_bonus || 0,
            military_access: proposal.terms.military_access || false,
            expires_at: expiresAt?.toISOString()
          });

        if (relationError) throw relationError;
      }

      await loadDiplomaticData();
      return { success: true };
    } catch (error) {
      console.error('Error responding to proposal:', error);
      return { success: false, error };
    }
  };

  const declareWar = async (targetPlayerId: string) => {
    try {
      // Break any existing peaceful relations
      await supabase
        .from('diplomatic_relations')
        .update({ status: 'broken' })
        .or(`player_id.eq.${playerId},target_player_id.eq.${playerId}`)
        .or(`player_id.eq.${targetPlayerId},target_player_id.eq.${targetPlayerId}`);

      // Create war relation
      const { error } = await supabase
        .from('diplomatic_relations')
        .insert({
          player_id: playerId,
          target_player_id: targetPlayerId,
          relation_type: 'war',
          status: 'active',
          trust_level: 0,
          trade_bonus: 0,
          military_access: false
        });

      if (error) throw error;

      await loadDiplomaticData();
      return { success: true };
    } catch (error) {
      console.error('Error declaring war:', error);
      return { success: false, error };
    }
  };

  const offerPeace = async (targetPlayerId: string, terms: any) => {
    return sendProposal(targetPlayerId, 'peace', terms);
  };

  const breakAlliance = async (relationId: string) => {
    try {
      const { error } = await supabase
        .from('diplomatic_relations')
        .update({ status: 'broken' })
        .eq('id', relationId);

      if (error) throw error;

      await loadDiplomaticData();
      return { success: true };
    } catch (error) {
      console.error('Error breaking alliance:', error);
      return { success: false, error };
    }
  };

  const updateTrustLevel = async (relationId: string, change: number) => {
    try {
      const relation = relations.find(r => r.id === relationId);
      if (!relation) return { success: false };

      const newTrust = Math.max(0, Math.min(100, relation.trust_level + change));

      const { error } = await supabase
        .from('diplomatic_relations')
        .update({ trust_level: newTrust })
        .eq('id', relationId);

      if (error) throw error;

      await loadDiplomaticData();
      return { success: true };
    } catch (error) {
      console.error('Error updating trust level:', error);
      return { success: false, error };
    }
  };

  const getRelationWithPlayer = (targetPlayerId: string) => {
    return relations.find(
      r =>
        (r.player_id === playerId && r.target_player_id === targetPlayerId) ||
        (r.target_player_id === playerId && r.player_id === targetPlayerId)
    );
  };

  const isAtWar = (targetPlayerId: string) => {
    const relation = getRelationWithPlayer(targetPlayerId);
    return relation?.relation_type === 'war' && relation?.status === 'active';
  };

  const isAllied = (targetPlayerId: string) => {
    const relation = getRelationWithPlayer(targetPlayerId);
    return relation?.relation_type === 'alliance' && relation?.status === 'active';
  };

  const canAttack = (targetPlayerId: string) => {
    const relation = getRelationWithPlayer(targetPlayerId);
    if (!relation) return true; // No relation = can attack
    return relation.relation_type === 'war' || relation.status === 'broken';
  };

  return {
    relations,
    proposals,
    loading,
    sendProposal,
    respondToProposal,
    declareWar,
    offerPeace,
    breakAlliance,
    updateTrustLevel,
    getRelationWithPlayer,
    isAtWar,
    isAllied,
    canAttack,
    reload: loadDiplomaticData
  };
};
