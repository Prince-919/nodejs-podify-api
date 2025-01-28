import { Audio, User } from "@/models";
import { paginationQuery, AudioDocument } from "@/types";
import { RequestHandler } from "express";
import { isValidObjectId, ObjectId } from "mongoose";

class FollowerController {
  updateFollower: RequestHandler = async (req, res) => {
    const { profileId } = req.params;
    let status: "added" | "removed";

    if (!isValidObjectId(profileId)) {
      res.status(422).json({ error: "INvalid profile Id!" });
      return;
    }

    const profile = await User.findById(profileId);
    if (!profile) {
      res.status(404).json({ error: "Profile not found!" });
      return;
    }

    const alreadyAFollower = await User.findOne({
      _id: profileId,
      followers: req.user?.id,
    });

    if (alreadyAFollower) {
      await User.updateOne(
        { _id: profileId },
        { $pull: { followers: req.user?.id } }
      );
      status = "removed";
    } else {
      await User.updateOne(
        { _id: profileId },
        { $addToSet: { followers: req.user?.id } }
      );
      status = "added";
    }

    if (status === "added") {
      await User.updateOne(
        { _id: req.user?.id },
        { $addToSet: { followings: profileId } }
      );
    }
    if (status === "removed") {
      await User.updateOne(
        { _id: req.user?.id },
        { $pull: { followings: profileId } }
      );
    }
    res.json({ status });
  };

  getUploads: RequestHandler = async (req, res) => {
    const { pageNo = "0", limit = "20" } = req.query as paginationQuery;

    const data = await Audio.find({ owner: req.user?.id })
      .skip(parseInt(limit) * parseInt(pageNo))
      .limit(parseInt(limit))
      .sort("-createdAt");

    const audios = await data.map((item) => {
      return {
        id: item._id,
        title: item.title,
        about: item.about,
        file: item.file.url,
        poster: item.poster?.url,
        date: item.createdAt,
        owner: { name: req.user?.name, id: req.user?.id },
      };
    });

    res.json({ audios });
  };

  getPublicUploads: RequestHandler = async (req, res) => {
    const { pageNo = "0", limit = "20" } = req.query as paginationQuery;
    const { profileId } = req.params;

    const data = await Audio.find({ owner: profileId })
      .skip(parseInt(limit) * parseInt(pageNo))
      .limit(parseInt(limit))
      .sort("-createdAt")
      .populate<AudioDocument<{ name: string; _id: ObjectId }>>("owner");

    const audios = await data.map((item) => {
      return {
        id: item._id,
        title: item.title,
        about: item.about,
        file: item.file.url,
        poster: item.poster?.url,
        date: item.createdAt,
        owner: { name: item.owner.name, id: item.owner._id },
      };
    });

    res.json({ audios });
  };
}

const followerController = new FollowerController();
export default followerController;
