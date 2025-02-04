import {
  Audio,
  User,
  Playlist,
  AutoGeneratedPlaylist,
  History,
} from "@/models";
import { paginationQuery, AudioDocument } from "@/types";
import { RequestHandler } from "express";
import { isValidObjectId, ObjectId, PipelineStage } from "mongoose";
import { getUsersPreviousHistory } from "@/utils";

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

    if (!profileId) {
      res.status(422).json({ error: "Invalid profile id!" });
      return;
    }

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

  getPublicProfile: RequestHandler = async (req, res) => {
    const { profileId } = req.params;
    if (!isValidObjectId(profileId)) {
      res.status(422).json({ error: "Invalid profile id!" });
      return;
    }

    const user = await User.findById(profileId);
    if (!user) {
      res.status(422).json({ error: "User not found!" });
      return;
    }

    res.json({
      profile: {
        id: user._id,
        name: user.name,
        followers: user.followers.length,
        avatar: user.avatar?.url,
      },
    });
  };

  getPublicPlaylist: RequestHandler = async (req, res) => {
    const { profileId } = req.params;
    const { pageNo = "0", limit = "20" } = req.query as paginationQuery;

    if (!isValidObjectId(profileId)) {
      res.status(422).json({ error: "Invalid profile id!" });
      return;
    }

    const playlist = await Playlist.find({
      owner: profileId,
      visibility: "public",
    })
      .skip(parseInt(limit) * parseInt(pageNo))
      .limit(parseInt(limit))
      .sort("-createdAt");

    if (!playlist) {
      res.json({ playlist: [] });
      return;
    }

    res.json({
      playlist: playlist.map((item) => {
        return {
          id: item._id,
          title: item.title,
          itemsCount: item.items.length,
          visibility: item.visibility,
        };
      }),
    });
  };

  getRecommendedByProfile: RequestHandler = async (req, res) => {
    const user = req.user;

    let matchOptions: PipelineStage.Match = {
      $match: { _id: { $exists: true } },
    };

    if (user) {
      const category = await getUsersPreviousHistory(req);

      if (category.length) {
        matchOptions = {
          $match: { category: { $in: category } },
        };
      }
    }

    const audios = await Audio.aggregate([
      matchOptions,
      {
        $sort: {
          "likes.count": -1,
        },
      },
      { $limit: 10 },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      { $unwind: "$owner" },
      {
        $project: {
          _id: 0,
          id: "$_id",
          title: "$title",
          about: "$about",
          category: "$category",
          file: "$file.url",
          poster: "$poster.url",
          owner: { name: "$owner.name", id: "$owner._id" },
        },
      },
    ]);
    res.json(audios);
  };

  getAutoGeneratedPlaylist: RequestHandler = async (req, res) => {
    const [result] = await History.aggregate([
      { $match: { owner: req.user?.id } },
      { $unwind: "$all" },
      { $group: { _id: "$all.audio", items: { $addToSet: "$all.audio" } } },
      { $sample: { size: 20 } },
      { $group: { _id: null, items: { $push: "$_id" } } },
    ]);

    const title = "Mix 20";

    if (result) {
      await Playlist.updateOne(
        { owner: req.user?.id, title },
        { $set: { title, items: result.items, visibility: "auto" } },
        { upsert: true }
      );
    }

    const category = await getUsersPreviousHistory(req);
    let matchOptions: PipelineStage.Match = {
      $match: { _id: { $exists: true } },
    };
    if (category.length) {
      matchOptions = { $match: { title: { $in: category } } };
    }

    const agpl = await AutoGeneratedPlaylist.aggregate([
      matchOptions,
      { $sample: { size: 4 } },
      {
        $project: {
          _id: 0,
          id: "$_id",
          title: "$title",
          itemsCount: { $size: "$items" },
        },
      },
    ]);

    const playlist = await Playlist.findOne({ owner: req.user?.id, title });

    const finalList = agpl.concat({
      id: playlist?._id,
      title: playlist?.title,
      itemsCount: playlist?.items.length,
    });
    res.json({ playlist: finalList });
  };
}

const followerController = new FollowerController();
export default followerController;
