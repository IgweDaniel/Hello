let id = (id) => document.getElementById(id);
let classes = (classes) => document.getElementsByClassName(classes);
const clip__container = document.querySelector(".clip");
const close__clip__container = document.querySelector("a.close");

const patterns = {
  username: /^[a-z]*\d*$/i,
  password: /^[\w@-]{8,20}$/,
};

let username = id("username"),
  email = id("email"),
  password = id("password"),
  form = id("form"),
  errorMsg = classes("error"),
  successIcon = classes("success-icon"),
  failureIcon = classes("failure-icon"),
  displayUserName = id("displayUserName");

let engine = (id, serial, message, regEx) => {
  if (id.value.trim() === "" || regEx.test(id.value) === false) {
    errorMsg[serial].innerHTML = message;
    id.style.border = "1px solid red";

    // icons
    failureIcon[serial].style.opacity = "1";
    successIcon[serial].style.opacity = "0";

    throw Error;
  } else {
    errorMsg[serial].innerHTML = "";
    id.style.border = "1px solid green";

    // icons
    failureIcon[serial].style.opacity = "0";
    successIcon[serial].style.opacity = "1";
  }
};

// Get User IP Address
const getUserIP = () => {
  return fetch("http://ip-api.com/json/", {})
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
    })
    .then((data) => {
      return data.query;
    });
};

// Say Hello in Native Language
const sayHello = (userIP) => {
  /**
   * Cors was affecting your fetch. the response.status was not returning 200 due to cors
   * Read up on it and if you're still confused, ask me
   */
  return fetch(`https://fourtonfish.com/hellosalut/?ip=${userIP}`, {
    mode: "cors",
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      /**From Daniel
       * You need to do something in the event the response.status is not 200
       * its just an observation not the reason your code didn;t work
       */
      throw new Error("Whatever error");
    })
    .then((data) => {
      return data.hello;
    })
    .catch((err) => {
      // Whatever is thrown can be caught here
      console.log(err);
    });
};

/**
 * From Daniel
 * I made the function async so you could await the promise returned from getUserIP
 * it was showing pending because you didn't resolve the promise returned from getUserIP
 * you could've have resolved it by calling .then or async & await
 * To support your coding logic/flow. async & await is best suited for this case
 *
 */

// Open Display Container
const openDisplay = async () => {
  // Get Users name
  const user = username.value;

  // Retrieve User IP address
  getUserIP().then((IPaddress) => {
    sayHello(IPaddress).then((message) => {
      console.log({ message });
      clip__container.classList.add("show");
    });
  });
};

form.addEventListener("submit", (e) => {
  e.preventDefault();

  console.log(
    patterns[password.attributes.name.value],
    patterns[username.attributes.name.value]
  );

  engine(
    username,
    0,
    "Username cannot be blank",
    patterns[username.attributes.name.value]
  );
  engine(
    password,
    1,
    "Password cannot be blank",
    patterns[password.attributes.name.value]
  );
  openDisplay();
});

close__clip__container.addEventListener("click", (e) => {
  if (clip__container.classList.contains("show")) {
    clip__container.classList.remove("show");
  }
});
