import { Audio, Playlist } from "@/models";
import { CreatePlaylistRequest } from "@/types";
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
}

const playlistController = new PlaylistController();
export default playlistController;
