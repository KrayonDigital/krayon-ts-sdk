import SignClient from '@walletconnect/sign-client';

import { SessionTypes, SignClientTypes } from '@walletconnect/types';
import { EIP155_SIGNING_METHODS } from '../data/EIP155Data';
// import { COSMOS_SIGNING_METHODS } from '../data/COSMOSData'
// import { SOLANA_SIGNING_METHODS } from '../data/SolanaData'
// import { POLKADOT_SIGNING_METHODS } from '../data/PolkadotData'
// import { ELROND_SIGNING_METHODS } from '../data/ElrondData'
// import { TRON_SIGNING_METHODS } from '../data/TronData'
// import { NEAR_SIGNING_METHODS } from '../data/NEARData'
// import { approveNearRequest } from '@/utils/legacy-request-handler-util/NearRequestHandlerUtil'

//  TODO: drop this, shouldn't really be needed since it only specifies stuff
// that needs to be in project config
// export async function createSignClient(relayerRegionURL: string) {
//   const signClient = await SignClient.init({
//     logger: 'debug',
//     projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
//     relayUrl: relayerRegionURL ?? process.env.NEXT_PUBLIC_RELAY_URL,
//     metadata: {
//       name: 'React Wallet',
//       description: 'React Wallet for WalletConnect',
//       url: 'https://walletconnect.com/',
//       icons: ['https://avatars.githubusercontent.com/u/37784886'],
//     },
//   });
//   return signClient;
// }

export enum WalletConnectModalType {
    SessionProposal = 'SessionProposal',
    SignMessage = 'SignMessage',
    SignTypedData = 'SignTypedData',
    SignTransaction = 'SignTransaction',
    UnsupportedMethod = 'UnsupportedMethod',

    // "SessionSignCosmosModal",
    // "SessionSignSolanaModal",
    // "SessionSignPolkadotModal",
    // "SessionSignNearModal",
    // "SessionSignElrondModal",
    // "SessionSignTronModal",
};

export type SessionRequestHandlerParam = {
    modalType: Exclude<WalletConnectModalType, 'SessionProposalModal'>,
    requestEvent: SignClientTypes.EventArguments['session_request'],
    requestSession: SessionTypes.Struct,
}

type CallRequestHandlerFn = (param: SessionRequestHandlerParam) => void;

type AssignSignClientEventsProps = {
    onSessionProposal: (proposal: SignClientTypes.EventArguments['session_proposal']) => void;
    onSessionRequest: CallRequestHandlerFn;
    
    onSessionPing?: (eventData: SignClientTypes.EventArguments['session_ping']) => void;
    onSessionEvent?: (eventData: SignClientTypes.EventArguments['session_event']) => void;
    onSessionUpdate?: (eventData: SignClientTypes.EventArguments['session_update']) => void;
    onSessionDelete?: (eventData: SignClientTypes.EventArguments['session_delete']) => void;
}


export function assignSignClientModalEvents(signClient: SignClient, {
    onSessionProposal,
    onSessionRequest,
    // TODO: drop these defaults
    onSessionPing = (eventData) => {console.log('session_ping', eventData)},
    onSessionEvent = (eventData) => {console.log('session_event', eventData)},
    onSessionUpdate = (eventData) => {console.log('session_update', eventData)},
    onSessionDelete = (eventData) => {console.log('session_delete', eventData)},
}: AssignSignClientEventsProps) {
    // All this fn does is routes the request based on the request.method to the one of the approproate ModalTypes
    const _onSessionRequest = async (requestEvent: SignClientTypes.EventArguments['session_request']) => {
        console.log('session_request', requestEvent);
        const { topic, params } = requestEvent;
        const { request } = params;
        const requestSession = signClient.session.get(topic);

        let modalType: WalletConnectModalType = WalletConnectModalType.UnsupportedMethod;

        switch (request.method) {
            case EIP155_SIGNING_METHODS.ETH_SIGN:
            case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
                modalType = WalletConnectModalType.SignMessage;
                break;

            case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
            case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
            case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
                modalType = WalletConnectModalType.SignTypedData;
                break;

            case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
            case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
                modalType = WalletConnectModalType.SignTransaction, { requestEvent, requestSession };
                break;

            // case COSMOS_SIGNING_METHODS.COSMOS_SIGN_DIRECT:
            // case COSMOS_SIGNING_METHODS.COSMOS_SIGN_AMINO:
            //   return _openModal('SessionSignCosmosModal', { requestEvent, requestSession })

            // case SOLANA_SIGNING_METHODS.SOLANA_SIGN_MESSAGE:
            // case SOLANA_SIGNING_METHODS.SOLANA_SIGN_TRANSACTION:
            //   return _openModal('SessionSignSolanaModal', { requestEvent, requestSession })

            // case POLKADOT_SIGNING_METHODS.POLKADOT_SIGN_MESSAGE:
            // case POLKADOT_SIGNING_METHODS.POLKADOT_SIGN_TRANSACTION:
            //   return _openModal('SessionSignPolkadotModal', { requestEvent, requestSession })

            // case NEAR_SIGNING_METHODS.NEAR_SIGN_IN:
            // case NEAR_SIGNING_METHODS.NEAR_SIGN_OUT:
            // case NEAR_SIGNING_METHODS.NEAR_SIGN_TRANSACTION:
            // case NEAR_SIGNING_METHODS.NEAR_SIGN_AND_SEND_TRANSACTION:
            // case NEAR_SIGNING_METHODS.NEAR_SIGN_TRANSACTIONS:
            // case NEAR_SIGNING_METHODS.NEAR_SIGN_AND_SEND_TRANSACTIONS:
            // case NEAR_SIGNING_METHODS.NEAR_VERIFY_OWNER:
            //   return _openModal('SessionSignNearModal', { requestEvent, requestSession })

            // case ELROND_SIGNING_METHODS.ELROND_SIGN_MESSAGE:
            // case ELROND_SIGNING_METHODS.ELROND_SIGN_TRANSACTION:
            // case ELROND_SIGNING_METHODS.ELROND_SIGN_TRANSACTIONS:
            // case ELROND_SIGNING_METHODS.ELROND_SIGN_LOGIN_TOKEN:
            //   return _openModal('SessionSignElrondModal', { requestEvent, requestSession })

            // // case NEAR_SIGNING_METHODS.NEAR_GET_ACCOUNTS:
            // //   return signClient.respond({
            // //     topic,
            // //     response: await approveNearRequest(requestEvent)
            // //   })
            // case TRON_SIGNING_METHODS.TRON_SIGN_MESSAGE:
            // case TRON_SIGNING_METHODS.TRON_SIGN_TRANSACTION:
            //   return _openModal('SessionSignTronModal', { requestEvent, requestSession })
        }
        return onSessionRequest({modalType, requestEvent, requestSession});
    };
    // Set up WalletConnect event listeners
    signClient.on('session_proposal', onSessionProposal);
    signClient.on('session_request', _onSessionRequest);
    
    onSessionPing && signClient.on('session_ping', onSessionPing);
    onSessionEvent && signClient.on('session_event', onSessionEvent);
    onSessionUpdate && signClient.on('session_update', onSessionUpdate);
    onSessionDelete && signClient.on('session_delete', onSessionDelete);
}
