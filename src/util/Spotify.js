const clientId = "8ad0c09ef5c74c6b9929b666a346f1a9";
const redirectUri = "http://localhost:3000/";

let userAccessToken;

const Spotify = {
  getAccessToken() {
    if (userAccessToken) {
      return userAccessToken;
    } else {
      const accessTokenMatch =
        window.location.href.match(/access_token=([^&]*)/);
      const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

      if (accessTokenMatch && expiresInMatch) {
        userAccessToken = accessTokenMatch[1];
        const expiresIn = Number(expiresInMatch[1]);

        window.setTimeout(() => (userAccessToken = ""), expiresIn * 1000);
        window.history.pushState("Access Token", null, "/");
        return userAccessToken;
      } else {
        const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
        window.location = accessUrl;
      }
    }
  },
  search(userSearchTerm) {
    const accessToken = Spotify.getAccessToken();
    return fetch(
      `https://api.spotify.com/v1/search?type=track&q=${userSearchTerm}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data.tracks) return [];
        return data.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
        }));
      });
  },
  savePlaylist(name, uris) {
    if (!name || !uris.length) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    let userId;

    return fetch("https://api.spotify.com/v1/me", { headers: headers })
      .then((res) => res.json())
      .then((res) => {
        userId = res.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: headers,
          method: "POST",
          body: JSON.stringify({ name: name }),
        })
          .then((res) => res.json())
          .then((data) => {
            const playlistID = data.id;
            return fetch(
              `https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`,
              {
                method: "POST",
                headers: headers,
                body: JSON.stringify({ uris: uris }),
              }
            );
          });
      });
  },
};

export default Spotify;
