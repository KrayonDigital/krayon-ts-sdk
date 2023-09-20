import { Transfer } from './transfer';
import { TimeInterval } from './util';

export enum PropositionType {
  TRANSFER = 'TRANSFER',
  ASSET_SPENDING_LIMIT_CHANGE = 'ASSET_SPENDING_LIMIT_CHANGE',
  USER_SPENDING_LIMIT_CHANGE = 'USER_SPENDING_LIMIT_CHANGE',
  WALLET_QUORUM_CHANGE = 'WALLET_QUORUM_CHANGE',
  WALLET_USER_ADD = 'WALLET_USER_ADD',
  WALLET_USER_REMOVE = 'WALLET_USER_REMOVE',
  WALLET_CONNECT_OP = 'WALLET_CONNECT_OP',

  WALLET_WHITELIST_CHANGE = 'WALLET_WHITELIST_CHANGE',

  ORGANIZATION_QUORUM_CHANGE = 'ORGANIZATION_QUORUM_CHANGE',
  ORGANIZATION_ADMIN_ADD = 'ORGANIZATION_ADMIN_ADD',
  ORGANIZATION_ADMIN_REMOVE = 'ORGANIZATION_ADMIN_REMOVE',
  ORGANIZATION_ROLE_CHANGE = 'ORGANIZATION_ROLE_CHANGE',
  ORGANIZATION_WHITELIST_REMOVE = 'ORGANIZATION_WHITELIST_REMOVE',
  ORGANIZATION_WHITELIST_ADD = 'ORGANIZATION_WHITELIST_ADD',
  ORGANIZATION_POLICIES_UPDATE = 'ORGANIZATION_POLICIES_UPDATE',
}

export enum ElectionDecision {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ABSTAINED = 'ABSTAINED',
}

export type Election = {
  id: string;
  decision: ElectionDecision;
  num_required_accept: number;
  organization_id: string;
  created_at: string;
  closed_at: string | null;
  frequency?: number;
  limit_from?: number;
  limit_to?: number;
  expires_at: string;
  proposition_type: PropositionType;
  proposition_data?: {
    transfer_id?: string;
    user_id?: string;
    previous_num_quorum?: number;
    num_quorum?: number;
    wallet_id?: string;
    organization_id?: string;
    policies?: any;
    whitelists?: {
      name: string;
      notes: string;
      address: string;
      blockchain: string;
    }[];
  };
  initiator_id: string;
  proposition_details: {
    transfer: Transfer;
  };
  tally: {
    [key in ElectionDecision]: number;
  };
  detail?: string;
} & (
  | {
      proposition_type: PropositionType.TRANSFER;
      proposition_data: {
        transfer_id: string;
      };
    }
  | {
      proposition_type: PropositionType.WALLET_QUORUM_CHANGE;
      proposition_data: {
        previous_num_quorum: string;
        wallet_id: string;
        num_quorum: string;
      };
    }
  | {
      proposition_type:
        | PropositionType.WALLET_USER_ADD
        | PropositionType.WALLET_USER_REMOVE;
      proposition_data: {
        wallet_id: string;
        user_id: string;
      };
    }
  | {
      proposition_type: PropositionType.WALLET_WHITELIST_CHANGE;
      proposition_data: unknown;
    }
  | {
      proposition_type: PropositionType.WALLET_CONNECT_OP;
      proposition_data: {
        wallet_id: string;
        method: string;
        message: any;
      };
    }
  | {
      proposition_type: PropositionType.ORGANIZATION_QUORUM_CHANGE;
      proposition_data: unknown;
    }
  | {
      proposition_type: PropositionType.ORGANIZATION_ADMIN_ADD;
      proposition_data: unknown;
    }
  | {
      proposition_type: PropositionType.ORGANIZATION_ADMIN_REMOVE;
      proposition_data: unknown;
    }
  | {
      proposition_type: PropositionType.ORGANIZATION_ROLE_CHANGE;
      proposition_data: {
        current_role: string;
        new_role: string;
      };
    }
  | {
      proposition_type: PropositionType.USER_SPENDING_LIMIT_CHANGE;
      proposition_data: {
        spending_limits?: {
          contract: string;
          currency: string;
          interval: TimeInterval;
          allowance: number;
          old_allowance: number;
        }[];
      };
    }
  | {
      proposition_type: PropositionType.ASSET_SPENDING_LIMIT_CHANGE;
      proposition_data: {
        asset: string;
        allowance: unknown;
        interval: unknown; // TODO: should be a proper type
      };
    }
  | {
      proposition_type: PropositionType.ORGANIZATION_WHITELIST_REMOVE;
      proposition_data: {
        organization_id: string;
      };
    }
  | {
      proposition_type: PropositionType.ORGANIZATION_WHITELIST_ADD;
      proposition_data: {
        organization_id: string;
      };
    }
  | {
      proposition_type: PropositionType.ORGANIZATION_POLICIES_UPDATE;
      proposition_data: {
        organization_id: string;
        policies: unknown;
      };
    }
);

export type ElectionDetail = Election & {
  voters: Voter[];
  pending_voter_ids: string[];
  vote_url: string;
  updated_num_required_accept?: number;
  updated_num_approved?: number;
};

export interface ElectionVote {
  election: Election;
  vote_cast: string;
  vote_status: string;
}

export type ElectionResult = Pick<ElectionDetail, 'id' | 'decision'> & {
  result: any; // exact type depending on the eleciton
  extra?: any;
} & Partial<Pick<Election, 'created_at' | 'closed_at'>>;

export interface Voter {
  id: string;
  email: string;
  avatar: string;
  decision: ElectionDecision;
}

export interface ElectionFilter {
  initiator_id?: string;
  num_required_accept?: [number, number];
  created_at?: [string, string];
  expires_at?: [string, string];
  proposition_type?: PropositionType;
  decision?: ElectionDecision;
  is_open?: boolean;
}

export interface ElectionErrorResponse {
  error: {
    details: {
      message: string;
      extra: {
        decision?: ElectionDecision;
        closed_at?: any;
      };
    };
  };
}

export interface ElectionResultPollRejection {
  electionId: string;
  reason: string;
  closed_at?: string;
}
