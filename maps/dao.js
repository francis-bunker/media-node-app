import axios from "axios";

export default function MapDao() {
    async function findPlaceTitleById(placeId) {
        try {
            const apiKey = process.env.GOOGLE_MAPS_API_KEY;

            const response = await axios.get(
                `https://places.googleapis.com/v1/places/${placeId}`,
                {
                    headers: {
                        "X-Goog-Api-Key": apiKey,
                        "X-Goog-FieldMask": "displayName"  
                    }
                }
            );

            return response.data.displayName?.text || "unknown place";
        } catch (err) {
            console.error("Place Title Error:", err.response?.data || err.message);
            throw err;
        }
    }
    async function findPlaceById(placeId) {
        try {
            const apiKey = process.env.GOOGLE_MAPS_API_KEY;

            const response = await axios.get(
                `https://places.googleapis.com/v1/places/${placeId}`,
                {
                    headers: {
                        "X-Goog-Api-Key": apiKey,
                        "X-Goog-FieldMask": "*"  
                    }
                }
            );

            return response.data;
        } catch (err) {
            console.error("Place Details Error:", err.response?.data || err.message);
            throw err;
        }
    }
    async function searchForPlace(search) {
        try {
            const apiKey = process.env.GOOGLE_MAPS_API_KEY;

            const response = await axios.post(
                "https://places.googleapis.com/v1/places:searchText",
                { textQuery: search },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-Goog-Api-Key": apiKey,
                        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.id,places.location",
                    },
                }
            );

            return response.data;
        } catch (err) {
            console.error(err.response?.data || err.message);
            throw new Error(err.response?.data?.error?.message || "Google Maps API request failed");
        }
    }
    return {
        searchForPlace,
        findPlaceById,
        findPlaceTitleById
    };
}