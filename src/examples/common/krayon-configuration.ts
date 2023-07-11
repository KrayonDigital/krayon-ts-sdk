// Get the base URL - normally, this would be done from the env variables or similar
// This will be parameters that'll be provided by Krayon
const baseURL = process.env.KRAYON_BASE_URL as string;

export const krayonConfiguration = {
    baseURL,
}
