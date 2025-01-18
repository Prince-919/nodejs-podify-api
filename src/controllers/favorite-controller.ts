import { RequestHandler } from "express";

class FavoriteController {
  toggleFavorite: RequestHandler = async (req, res) => {};
}

const favoriteController = new FavoriteController();
export default favoriteController;
