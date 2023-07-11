import { krayonSDK } from './instance';

// Then, you can use the SDK to get data from Krayon
// Here, we have an example function that gets users and wallets and returns them together
async function getStuffFromKrayon() {
    if(krayonSDK.status !== 'ready') {
        return {
            users: [],
            wallets: [],
        };
    }

    // Let's get the users and wallets, for example's sake
    // Note that the SDK will automatically add the token to the request
    // We run this requests in parallel, to showcase how to do it
    const usersResponsePromise = krayonSDK.organization.listOrganizationUsers();
    const walletsResponsePromise = krayonSDK.wallet.listWallets();

    // Now await them together
    const [usersResponse, walletsResponse] = await Promise.all([usersResponsePromise, walletsResponsePromise]);

    // Now, when the response arrived, we can check for errors and return the data
    let errors = [];

    if (usersResponse.status === 200) {
        console.log('users', usersResponse.data.data);

        // Let's naively assume that if there are no users, it's an error
        // This is an example business logic, you can do whatever you want here
        if(usersResponse.data.data.length === 0) {
            errors.push('No users found');
        }
    }
    else {
        console.error('Users: request failed', usersResponse);
        errors.push('Users request failed');
    }

    if (walletsResponse.status === 200) {
        console.log('wallets', walletsResponse.data.data);

        if(walletsResponse.data.data.length === 0) {
            errors.push('No wallets found');
        }
    }
    else {
        console.error('Wallets: request failed', walletsResponse);
        errors.push('Wallets request failed');
    }

    return { 
        users: usersResponse.data.data, 
        wallets: walletsResponse.data.data,
        errors,
    };
}
