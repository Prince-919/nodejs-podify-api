import { Audio, Favorite } from "@/models";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";

class FavoriteController {
  toggleFavorite: RequestHandler = async (req, res) => {
    const audioId = req.query.audioId as string;
    let status: "added" | "removed";

    if (!isValidObjectId(audioId)) {
      res.status(422).json({ error: "Audio id is invalid!" });
      return;
    }

    const audio = await Audio.findById(audioId);
    if (!audio) {
      res.status(404).json({ error: "Resources not found!" });
      return;
    }

    const alreadyExists = await Favorite.findOne({
      owner: req.user?.id,
      items: audioId,
    });

    if (alreadyExists) {
      await Favorite.updateOne(
        { owner: req.user?.id },
        { $pull: { items: audioId } }
      );
      status = "removed";
    } else {
      const favorite = await Favorite.findOne({ owner: req.user?.id });
      if (favorite) {
        await Favorite.updateOne(
          { owner: req.user?.id },
          {
            $addToSet: {
              items: audioId,
            },
          }
        );
      } else {
        await Favorite.create({ owner: req.user?.id, items: [audioId] });
      }
      status = "added";
    }
    res.json({ status });
  };
}

const favoriteController = new FavoriteController();
export default favoriteController;
