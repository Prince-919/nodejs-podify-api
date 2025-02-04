import { Audio, Favorite } from "@/models";
import { paginationQuery, PopulateFavList } from "@/types";
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

    if (status === "added") {
      await Audio.findByIdAndUpdate(audioId, {
        $addToSet: { likes: req.user?.id },
      });
    }

    if (status === "removed") {
      await Audio.findByIdAndUpdate(audioId, {
        $pull: { likes: req.user?.id },
      });
    }
    res.json({ status });
  };

  getFavorites: RequestHandler = async (req, res) => {
    const userID = req.user?.id;
    const { pageNo = "0", limit = "20" } = req.query as paginationQuery;

    const favorites = await Favorite.aggregate([
      { $match: { owner: userID } },
      {
        $project: {
          audioIds: {
            $slice: [
              "$items",
              parseInt(pageNo) * parseInt(limit),
              parseInt(limit),
            ],
          },
        },
      },
      { $unwind: "$audioIds" },
      {
        $lookup: {
          from: "audios",
          localField: "audioIds",
          foreignField: "_id",
          as: "audioInfo",
        },
      },
      { $unwind: "$audioInfo" },
      {
        $lookup: {
          from: "users",
          localField: "audioInfo.owner",
          foreignField: "_id",
          as: "ownerInfo",
        },
      },
      { $unwind: "$ownerInfo" },
      {
        $project: {
          _id: 0,
          id: "$audioInfo._id",
          title: "$audioInfo.title",
          about: "$audioInfo.about",
          category: "$audioInfo.category",
          file: "$audioInfo.file.url",
          poster: "$audioInfo.poster.url",
          owner: { name: "$ownerInfo.name", id: "$ownerInfo._id" },
        },
      },
    ]);

    res.json({ audios: favorites });
  };

  getIsFavorite: RequestHandler = async (req, res) => {
    const audioId = req.query.audioId as string;

    if (!isValidObjectId(audioId)) {
      res.status(422).json({ error: "Invalid audio id!" });
      return;
    }

    const favorite = await Favorite.findOne({
      owner: req.user?.id,
      items: audioId,
    });

    res.json({ result: favorite ? true : false });
  };
}

const favoriteController = new FavoriteController();
export default favoriteController;
