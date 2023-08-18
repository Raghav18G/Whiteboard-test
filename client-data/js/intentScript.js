function launchScannerApp() {
  console.log("Recording Started!");
  const intentURI =
    "intent://scan/#Intent;scheme=zxing;package=com.example.content_creation_front_end;end";

  if (window.navigator && window.navigator.userAgent.match(/Android/i)) {
    console.log("JODDDD");
    // Check if the user is using an Android device
    window.location.href = intentURI;
  } else {
    // Handle other platforms or show an error message
    console.log("This feature is only available on Android devices.");
    // You can also redirect the user to a different page or show an error message
  }
}
