const CLIENT_ID = "944d4db48c1d4bdcaead9d482a9999a3"; // Spotify Developer Dashboardで取得
const CLIENT_SECRET = "85c04546eccc4c719522171006a64a34";

// アクセストークンを取得
async function getAccessToken() {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(CLIENT_ID + ":" + CLIENT_SECRET)}`,
      },
      body: "grant_type=client_credentials",
    });
  
    const data = await response.json();
    return data.access_token;
  }
  
  // Spotify検索
  async function searchSpotify() {
    const query = document.getElementById("searchInput").value;
    const searchType = document.getElementById("searchType").value;
  
    if (!query) {
      alert("検索内容を入力してください");
      return;
    }
  
    const token = await getAccessToken();
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${searchType}&limit=10`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    const data = await response.json();
  
    if (searchType === "artist") {
      if (!data.artists.items.length) {
        alert("該当するアーティストが見つかりません");
        return;
      }
      displayArtists(data.artists.items);
    } else if (searchType === "track") {
      if (!data.tracks.items.length) {
        alert("該当する曲が見つかりません");
        return;
      }
      displayTracks(data.tracks.items);
    }
  }
  
  // アーティスト検索結果を表示
  function displayArtists(artists) {
    const ranking = document.getElementById("ranking");
    ranking.innerHTML = "";
  
    artists.forEach((artist, index) => {
      const artistCard = document.createElement("div");
      artistCard.className = "track";
  
      artistCard.innerHTML = `
        <p><strong>Rank ${index + 1}</strong></p>
        <img src="${artist.images[0]?.url || 'https://via.placeholder.com/200'}" alt="${artist.name}" onclick="window.open('${artist.external_urls.spotify}', '_blank')">
        <p>${artist.name}</p>
      `;
  
      ranking.appendChild(artistCard);
    });
  }
  
  // 曲検索結果を表示
  function displayTracks(tracks) {
    const ranking = document.getElementById("ranking");
    ranking.innerHTML = "";
  
    tracks.forEach((track, index) => {
      const trackCard = document.createElement("div");
      trackCard.className = "track";
  
      trackCard.innerHTML = `
        <p><strong>${index + 1}位</strong></p>
        <img src="${track.album.images[0]?.url || 'https://via.placeholder.com/200'}" alt="${track.name}" onclick="window.open('${track.external_urls.spotify}', '_blank')">
        <p>${track.name}</p>
        <p>アーティスト: ${track.artists.map((artist) => artist.name).join(", ")}</p>
      `;
  
      ranking.appendChild(trackCard);
    });
  }