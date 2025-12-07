import axios from "axios";
import MapDao from "./dao.js";

export default function MapRoutes(app) {
  const dao = MapDao();
  const searchForPlace = async (req, res) => {
    try {
      const search = req.body.query;
      if (!search) {
        return res.status(400).json({ error: "Missing 'query' field" });
      }
      const result = await dao.searchForPlace(search);
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: "Search failed", details: err.message });
    }
  };
  const findPlaceById = async (req, res) => {
    const placeId = req.params.placeId;
    const place = await dao.findPlaceById(placeId);
    res.send(place);
  }
  const findPlaceTitleById = async (req, res) => {
    const placeId = req.params.placeId;
    const placeTitle = await dao.findPlaceTitleById(placeId);
    res.send(placeTitle);
  }
  app.get("/api/map/place/:placeId/title", findPlaceTitleById);
  app.get("/api/map/place/:placeId", findPlaceById);
  app.post("/api/map/search", searchForPlace);
}
