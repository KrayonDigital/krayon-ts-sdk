// Create a simple React component that uses Krayon hooks:

// Path: krayon-frontend/src/sdk/examples/react/component-using-krayon.tsx
import React, { useEffect, useState } from 'react';
import { useKrayon, useKrayonSDKStatus } from 'sdk/flavors/react/use-sdk-hooks';
import { Election, ElectionDecision } from 'sdk/types/election';
import { Wallet } from 'sdk/types/wallet';

export const ComponentUsingKrayon = () => {
    // The below gives access to Krayon API
    // The subcomponents can be accesed using metehod like Krayon.user.listUsers().
    const Krayon = useKrayon();

    // Alternatively, if you prefer, you can destructure the Krayon APIs like so
    // const { wallet, user} = useKrayon();

    const krayonSdkStatus = useKrayonSDKStatus();
    
    const [pendingElections, setPendingElections] = useState<Election[]>([]);
    const [wallets, setWallets] = useState<Wallet[]>([]);

    useEffect(() => {
        // We can use AbortController here to cancel the request if the component is unmounted
        // This is not necessary, but it's a good practice
        const controller = new AbortController();

        // We can use the Krayon API here
        
        const pendingElectionsPromise = Krayon.election.listElections({
            // Add filtering params for election if needed
            decision: ElectionDecision.PENDING
        }, { abortSignal: controller.signal });

        const walletsPromise = Krayon.wallet.listWallets({

        }, { abortSignal: controller.signal });

        Promise.all([pendingElectionsPromise, walletsPromise]).then(([electionsResponse, walletsResponse]) => {
            setPendingElections(electionsResponse.data.data);
            setWallets(walletsResponse.data.data);
        });

        return () => controller.abort();
    }, [Krayon]);

    const handleElectionClick = async (election: Election, isApproved: boolean) => {
        // Actually vote on the election
        // You might want to set up a loader beforehand

        const response = await Krayon.election.voteElection(election.id, isApproved ? ElectionDecision.APPROVED : ElectionDecision.REJECTED)

        // Check the result, and update the loading state
    }

    return (
        <div>
            <h1>Component using Krayon</h1>
            <p>
                This component uses Krayon hooks to access Krayon SDK instance.
            </p>
            <p>
                Krayon SDK status is: {krayonSdkStatus}
            </p>
            <h3>Pending Elections</h3>
            <ul>
                {/* Render the pending elections as list items */}
                {pendingElections.map(election => <li key={election.id}>
                    Proposition type: {election.proposition_type} <br />
                    Expires at: {election.expires_at}
                    <button onClick={() => handleElectionClick(election, true)}>Approve</button>
                    <button onClick={() => handleElectionClick(election, false)}>Reject</button>
                </li>)}
            </ul>
            <h3>Wallets</h3>
            <ul>
                {wallets.map(wallet => <li key={wallet.id}>
                    {wallet.name}
                </li>)}
            </ul>
            
        </div>
    );
}
