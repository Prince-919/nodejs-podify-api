import { Audio, Playlist } from "@/models";
import { CreatePlaylistRequest, UpdatePlaylistRequest } from "@/types";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";

class PlaylistController {
  createPlaylist: RequestHandler = async (req: CreatePlaylistRequest, res) => {
    const { title, resId, visibility } = req.body;
    const ownerId = req.user?.id;

    if (resId) {
      const audio = await Audio.findById(resId);
      if (!audio) {
        res.status(404).json({ error: "Cloud not found the audio!" });
        return;
      }
    }
    const newPlaylist = new Playlist({ title, owner: ownerId, visibility });

    if (resId) newPlaylist.items = [resId as any];

    await newPlaylist.save();
    res.status(201).json({
      playlist: {
        id: newPlaylist._id,
        title: newPlaylist.title,
        visibility: newPlaylist.visibility,
      },
    });
  };

  updatePlaylist: RequestHandler = async (req: UpdatePlaylistRequest, res) => {
    const { id, title, item, visibility } = req.body;

    const playlist = await Playlist.findOneAndUpdate(
      {
        _id: id,
        owner: req.user?.id,
      },
      { title, visibility },
      { new: true }
    );

    if (!playlist) {
      res.status(404).json({ error: "Playlist not found!" });
      return;
    }

    if (item) {
      const audio = await Audio.findById(item);
      if (!audio) {
        res.status(404).json({ error: "Audio not found!" });
        return;
      }
      await Playlist.findByIdAndUpdate(playlist._id, {
        $addToSet: { items: item },
      });
    }

    res.status(200).json({
      playlist: {
        id: playlist._id,
        title: playlist.title,
        visibility: playlist.visibility,
      },
    });
  };

  removePlaylist: RequestHandler = async (req, res) => {
    const { playlistId, resId, all } = req.query;

    if (!isValidObjectId(playlistId)) {
      res.status(422).json({ error: "Invalid playlist id!" });
      return;
    }

    if (all === "yes") {
      const playlist = await Playlist.findOneAndDelete({
        _id: playlistId,
        owner: req.user?.id,
      });
      if (!playlist) {
        res.status(404).json({ error: "Playlist not found!" });
        return;
      }
    }

    if (resId) {
      if (!isValidObjectId(resId)) {
        res.status(422).json({ error: "Invalid audio id!" });
        return;
      }
      const playlist = await Playlist.findOneAndUpdate(
        {
          _id: playlistId,
          owner: req.user?.id,
        },
        { $pull: { items: resId } }
      );
      if (!playlist) {
        res.status(404).json({ error: "Playlist not found!" });
        return;
      }
    }
    res.json({ success: true });
  };

  getPlaylistByProfile: RequestHandler = async (req, res) => {
    const { pageNo = "0", limit = "20" } = req.query as {
      pageNo: string;
      limit: string;
    };

    const data = await Playlist.find({
      owner: req.user?.id,
      visibility: { $ne: "auto" },
    })
      .skip(parseInt(pageNo) * parseInt(limit))
      .limit(parseInt(limit))
      .sort("-createdAt");

    const playlist = await data.map((item) => {
      return {
        id: item._id,
        title: item.title,
        itemsCount: item.items.length,
        visibility: item.visibility,
      };
    });
    res.json({ playlist });
  };
}

const playlistController = new PlaylistController();
export default playlistController;
