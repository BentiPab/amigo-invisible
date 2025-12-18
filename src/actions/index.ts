const urlScript = import.meta.env.VITE_APPS_SCRIPT_URL;
const secretWord = import.meta.env.VITE_APPS_SECRET_DECRYPT;

export const getFriends = async () => {
  try {
    const response = await fetch(urlScript);
    const datosEncriptados = await response.text();

    const decodedBase64 = atob(datosEncriptados);

    let decrypted = "";
    for (let i = 0; i < decodedBase64.length; i++) {
      decrypted += String.fromCharCode(
        decodedBase64.charCodeAt(i) ^
          secretWord.charCodeAt(i % secretWord.length)
      );
    }
    return JSON.parse(decrypted);
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
