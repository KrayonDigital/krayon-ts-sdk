import { KrayonOrganizationSDK } from './organization/organization-sdk';
import { KrayonWalletSDK } from './wallet/wallet-sdk';
import { KrayonUserSDK } from './user/user-sdk';
import { KrayonAssetSDK } from './asset/asset-sdk';
import { KrayonTagSDK } from './tag/tag-sdk';
import { KrayonTransferSDK } from './transfer/transfer-sdk';
import { KrayonWhitelistnSDK } from './whitelist/whitelist-sdk';
import { KrayonWalletGroupSDK } from './wallet-group/wallet-group-sdk';
import { KrayonAuthSDK } from './auth/auth-sdk';
import { KrayonUtilSDK } from './util/util-sdk';
import { User } from './types/user';
import { KrayonElectionSDK } from './election/election-sdk';
import { KrayonNftTransferSDK } from './nft-transfer/nft-transfer-sdk';
import { AuthPlugin, AuthPluginOptions } from './types/plugins/auth';
import { KrayonTradeSDK } from './trade/trade-sdk';
import { KrayonAPIClient } from './api-client';
import { SDKReadyStatus } from './consts/enums';
import { KrayonGasStationSDK } from './gas-station/gas-station-sdk';
import { KrayonDepositSDK } from './deposit/deposit-sdk';
import { KrayonNotificationSDK } from './notification/notification-sdk';
import { KrayonCheckoutSDK } from './checkout/checkout-sdk';

export interface KrayonSDKConfig {
  token: string;
  organizationId: string;
  claims?: any; // arbitrary data that depends on the provider
  rawUserInfoHeader?: string; // Claims that we send with every request, given as a string
  userData: User;
}

export type KrayonSDKCreateParams = Pick<KrayonSDKConfig, 'token'> &
  AuthPluginOptions;

export class KrayonSDK {
  asset: KrayonAssetSDK;
  auth: KrayonAuthSDK;
  election: KrayonElectionSDK;
  nftTransfer: KrayonNftTransferSDK;
  organization: KrayonOrganizationSDK;
  transfer: KrayonTransferSDK;
  tag: KrayonTagSDK;
  trade: KrayonTradeSDK;
  user: KrayonUserSDK;
  util: KrayonUtilSDK;
  wallet: KrayonWalletSDK;
  whitelist: KrayonWhitelistnSDK;
  gasStation: KrayonGasStationSDK;
  walletGroup: KrayonWalletGroupSDK;
  deposit: KrayonDepositSDK;
  notification: KrayonNotificationSDK;
  checkout: KrayonCheckoutSDK;
  // For now, don't use the KrayonAPIClient, but rather, the singleton one
  // Easy to swap it later on
  // defaultApiClient: KrayonAPIClient;

  protected storage: {
    authClaims: KrayonSDKConfig['claims'];
    userData: User;
  } | null = null;
  protected apiClient: KrayonAPIClient;

  // not-loaded is the initial state, but already in the constructor, itlll change to anonymous
  public status: SDKReadyStatus = SDKReadyStatus.NotLoaded;

  protected eventHandlers: {
    readyStateChange: Array<(status: SDKReadyStatus) => void>;
  } = {
    readyStateChange: [],
  };

  public constructor({ baseURL }: { baseURL: string }) {
    // The API client is in anonymous mode
    this.apiClient = new KrayonAPIClient({
      baseURL,
    });

    // Alias it for less verbose code in the initializations
    const apiClient = this.apiClient;

    // Initialize each sub-SDK separately - later on, consider only initializing those that we need, or do lazy initialization
    this.auth = new KrayonAuthSDK({ apiClient });
    this.asset = new KrayonAssetSDK({ apiClient });
    this.election = new KrayonElectionSDK({ apiClient });
    this.nftTransfer = new KrayonNftTransferSDK({ apiClient });
    this.transfer = new KrayonTransferSDK({ apiClient });
    this.util = new KrayonUtilSDK({ apiClient });
    this.user = new KrayonUserSDK({ apiClient });
    this.whitelist = new KrayonWhitelistnSDK({ apiClient });
    this.gasStation = new KrayonGasStationSDK({ apiClient });
    this.deposit = new KrayonDepositSDK({ apiClient });
    this.notification = new KrayonNotificationSDK({ apiClient });
    this.checkout = new KrayonCheckoutSDK({ apiClient });
    // Lastly, initialize all the SDKs that are (currently) dependent on the organization ID
    // We should eventually refactor these deps away, and simply be able to initialize everything here
    // But for now, this is the easiest way to do it, and we simply rerun this function in the
    // start method, where we'll have the org id
    // Note - using these APIs will probably fail since org id is not present

    // Note: not passing organizationId here on purpose - undefined will be passed, and some methods
    // in these sub-SDKs will fail
    this.organization = new KrayonOrganizationSDK({ apiClient });
    this.tag = new KrayonTagSDK({ apiClient });
    this.trade = new KrayonTradeSDK({ apiClient });
    this.wallet = new KrayonWalletSDK({ apiClient });
    this.walletGroup = new KrayonWalletGroupSDK({ apiClient });

    this.setReadyState(SDKReadyStatus.Anonymous);
  }

  /**
   * Loads an authentication plugin based on the provided authProvider.
   * @param authProvider The name of the authentication plugin to load.
   * @returns The loaded authentication plugin.
   * @throws Error if the authProvider is not a valid and safe path.
   * @throws Error if the authentication plugin cannot be found or loaded.
   */
  protected async loadAuthPlugin(
    authProvider: KrayonSDKCreateParams['authProvider']
  ): Promise<AuthPlugin> {
    try {
      // Import and return the authentication plugin
      const authPluginModule = await import(
        `./plugins/auth/${authProvider}.ts`
      );
      const authPlugin: AuthPlugin = authPluginModule.default;
      return authPlugin;
    } catch (err) {
      throw new Error(`Unknown auth plugin ${authProvider}`);
    }
  }

  /**
   * Starts the SDK with the provided parameters.
   * @param params The SDK creation parameters.
   * @throws Error if the SDK is already loaded or authenticated.
   * @throws Error if an error occurs during the setup process.
   */
  public async start(params: KrayonSDKCreateParams): Promise<void> {
    const { token, authProvider = 'auth0', ...authPluginParams } = params;

    if (this.status !== SDKReadyStatus.Anonymous) {
      throw new Error(`Cannot start SDK - already ${this.status}`);
    }

    this.setReadyState(SDKReadyStatus.Loading);

    try {
      // Set up the authentication plugin and obtain authClaims and rawUserInfoHeader
      const authPlugin = await this.loadAuthPlugin(authProvider);

      const { authClaims, rawUserInfoHeader } =
        await authPlugin.processAuthClaim(authPluginParams);

      // Set the token and rawUserInfoHeader in the API client
      this.apiClient.setAuthorizationHeaders(token, rawUserInfoHeader);

      // Retrieve user data from the API by performing a login
      const userData = (await this.auth.login()).data.data;

      // Store the authentication information in the storage
      this.storage = {
        authClaims,
        userData,
      };

      // Determine the SDK's ready state based on the presence of organization information
      // If we have an org, we need to reinitialize all the SDKs that depend on the org id
      // TODO: refactor this away once we break the dependency on the org id in the API
      //const apiClient = this.apiClient;
      const org_id = userData.extra_data?.org_id;
      if (org_id) {
        this.setOrganizationId(org_id);
        this.setReadyState(SDKReadyStatus.Ready);
      } else {
        this.setReadyState(SDKReadyStatus.ReadyNotOnboarded);
      }
    } catch (error) {
      // this.status = SDKReadyStatus.Error;
      this.setReadyState(SDKReadyStatus.Error);
      throw new Error('An error occurred during the setup process: ' + error);
    }
  }

  public setOrganizationId(organizationId: string) {
    this.organization = new KrayonOrganizationSDK({
      apiClient: this.apiClient,
      organizationId,
    });
    this.tag = new KrayonTagSDK({ apiClient: this.apiClient, organizationId });
    this.wallet = new KrayonWalletSDK({
      apiClient: this.apiClient,
      organizationId,
    });
    this.walletGroup = new KrayonWalletGroupSDK({
      apiClient: this.apiClient,
      organizationId,
    });
  }

  public getUserData() {
    if (!this.storage?.userData) {
      throw new Error('User data not loaded');
    }
    return this.storage.userData;
  }

  public onReadyStateChange(fn: (status: SDKReadyStatus) => void) {
    this.eventHandlers.readyStateChange.push(fn);
  }
  public offReadyStateChange(fn: (status: SDKReadyStatus) => void) {
    this.eventHandlers.readyStateChange =
      this.eventHandlers.readyStateChange.filter((f) => f !== fn);
  }
  protected setReadyState(newStatus: SDKReadyStatus) {
    this.status = newStatus;
    this.eventHandlers.readyStateChange.forEach((fn) => fn(this.status));
  }

  public getApiClient() {
    return this.apiClient;
  }
}
