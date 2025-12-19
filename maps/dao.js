import axios from "axios";
import { v4 as uuidv4 } from 'uuid';

export default function MapDao() {
    // Mapbox requires a session_token for the Search Box API to group searches for billing.
    // For a simple backend proxy, generating one per request is acceptable for a hobby project.
    const getSessionToken = () => uuidv4();

    async function findPlaceTitleById(placeId) {
        try {
            const place = await findPlaceById(placeId);
            return place.displayName?.text || "unknown place";
        } catch (err) {
            console.error("Place Title Error:", err.message);
            throw err;
        }
    }

    async function findPlaceById(placeId) {
        try {
            const accessToken = process.env.MAPBOX_ACCESS_TOKEN;
            const sessionToken = getSessionToken();

            const response = await axios.get(
                `https://api.mapbox.com/search/searchbox/v1/retrieve/${placeId}`,
                {
                    params: {
                        access_token: accessToken,
                        session_token: sessionToken,
                        language: 'en'
                    }
                }
            );

            const feature = response.data.features?.[0];

            if (!feature) {
                throw new Error("Place not found");
            }

            // TRANSLATION: Convert Mapbox format to match Google format
            return {
                id: feature.properties.mapbox_id,
                formattedAddress: feature.properties.full_address || feature.properties.place_formatted,
                displayName: {
                    text: feature.properties.name
                },
                location: {
                    lat: feature.geometry.coordinates[1], // Mapbox is [lon, lat]
                    lng: feature.geometry.coordinates[0]
                }
            };

        } catch (err) {
            console.error("Place Details Error:", err.response?.data || err.message);
            throw err;
        }
    }

    async function searchForPlace(searchQuery) {
        try {
            const accessToken = process.env.MAPBOX_ACCESS_TOKEN;
            const sessionToken = getSessionToken();

            // Mapbox 'Suggest' endpoint is the standard for "searching for a place"
            const response = await axios.get(
                "https://api.mapbox.com/search/searchbox/v1/suggest",
                {
                    params: {
                        q: searchQuery,
                        access_token: accessToken,
                        session_token: sessionToken,
                        language: 'en',
                        types: 'poi,address' // Optional: limit to points of interest and addresses
                    }
                }
            );

            // TRANSLATION: Map the list of results to look like Google's "places" array
            const mappedPlaces = response.data.suggestions.map(suggestion => ({
                id: suggestion.mapbox_id,
                formattedAddress: suggestion.full_address || suggestion.place_formatted,
                displayName: {
                    text: suggestion.name
                },
                // Note: 'suggest' usually doesn't return exact coordinates for privacy/speed
                // until you 'retrieve' it. If you strictly need lat/lng in the search 
                // results list, you might need a different Mapbox endpoint (Forward Geocoding),
                // but this matches the "Search" flow best.
                location: null 
            }));

            // Return wrapped in an object to match Google's { places: [...] } structure
            return { places: mappedPlaces };

        } catch (err) {
            console.error("Mapbox Search Error:", err.response?.data || err.message);
            throw new Error(err.response?.data?.message || "Mapbox API request failed");
        }
    }

    return {
        searchForPlace,
        findPlaceById,
        findPlaceTitleById
    };
}