import { Audio, Playlist } from "@/models";
import { CreatePlaylistRequest, UpdatePlaylistRequest } from "@/types";
import { RequestHandler } from "express";

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
}

const playlistController = new PlaylistController();
export default playlistController;
