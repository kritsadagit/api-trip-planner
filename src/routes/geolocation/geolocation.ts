import express from "express";
import * as GeolocationController from "../../controllers/geolocation/geolocation";

const router = express();

router.get("/:user_id", GeolocationController.getGeolocation);
router.post("/", GeolocationController.createGeolocation);

export default router;
