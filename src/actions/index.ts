const urlScript = import.meta.env.VITE_APPS_SCRIPT_URL;

export const getFriends = async () => {
  try {
    const response = await fetch(urlScript);
    const datos = await response.json();
    // ... tu lógica
    return datos;
  } catch (error) {
    console.error("Error al conectar con la base de datos", error);
  }
};

export const saveFriends = async (name: string, friend: string) => {
  try {
    await fetch(urlScript, {
      method: "POST",
      body: JSON.stringify({
        name,
        friend,
      }),
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain",
      },
    });

    return true;
  } catch (error) {
    console.error("Error al conectar con la base de datos", error);
  }
};

export const assignFriend = (
  value: string,
  friends: { [key: string]: string }
) => {
  const possibleFriends = Object.keys(friends).filter(
    (k) => k !== value && !friends[k]
  );
  const randomFriend =
    possibleFriends[Math.floor(Math.random() * possibleFriends.length)];

  return randomFriend;
};
