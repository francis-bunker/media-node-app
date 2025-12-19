import MapDao from "./dao.js";

export default function MapRoutes(app) {
  const dao = MapDao();

  const searchForPlace = async (req, res) => {
    try {
      // Ensure the frontend is sending { "query": "pizza" }
      const search = req.body.query; 
      
      if (!search) {
        return res.status(400).json({ error: "Missing 'query' field" });
      }
      
      const result = await dao.searchForPlace(search);
      res.json(result); // This now returns { places: [...] } just like Google did
    } catch (err) {
      res.status(500).json({ error: "Search failed", details: err.message });
    }
  };

  const findPlaceById = async (req, res) => {
    try {
      const placeId = req.params.placeId;
      const place = await dao.findPlaceById(placeId);
      res.send(place);
    } catch (err) {
      res.status(404).json({ error: "Place not found" });
    }
  }

  const findPlaceTitleById = async (req, res) => {
    try {
      const placeId = req.params.placeId;
      const placeTitle = await dao.findPlaceTitleById(placeId);
      res.send(placeTitle);
    } catch (err) {
       res.status(404).send("Unknown Place");
    }
  }

  app.get("/api/map/place/:placeId/title", findPlaceTitleById);
  app.get("/api/map/place/:placeId", findPlaceById);
  app.post("/api/map/search", searchForPlace);
}