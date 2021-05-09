export async function sendPushNotification(
  expoPushToken: string,
  title: string,
  body: string
) {
  if (expoPushToken == "" || expoPushToken == null) return;
  const pushMessage = {
    to: expoPushToken,
    sound: "default",
    title: title,
    body: body,
  };
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pushMessage),
  }).catch((e) => console.log(e));
}
