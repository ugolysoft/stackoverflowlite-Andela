(function() {
  if (document.getElementById("questionstb")) {
    setTimeout(function() {
      const qns = new getData("http://localhost:3000/api/v1/questions/", _use.questions);
      qns.request();
    }, 1000);
  }
})();

//static
class _use {
  static signup() {
    if (_format.validateInput("box")) {
      const data = {
        name: _format.htmlSpecialCharacter(document.getElementById("name").value),
        email: _format.htmlSpecialCharacter(document.getElementById("email").value),
        password: document.getElementById("password").value
      };
      const req = new getData("http://localhost:3000/api/v1/register/", _use.message, "POST", data);
      req.request();
    }
  }
  static message(data) {
    alert("hello");
  }
  static questions(data) {
    const qnstb = document.getElementById("questionstb");
    let rows = "";
    if (Array.isArray(data)) {
      data.forEach(value => {
        rows += `<tr><td><span class="inline-block unpad align-center">
        ${value.ans} ans</span></td>
        <td><a class="undecorated" onclick="_use.answer('${value.qnsid}')"><b>
        ${value.title}</b></a><p class="unpad align-right">
        <b>${value.name}</b> <span class="inline-table">${value.askedate}</span></p></td></tr>`;
      });
      qnstb.innerHTML = rows;
    }
  }
}

//abstract
class getData {
  constructor(url, _fn, method = "GET", body = "", headers = "") {
    this.url = url;
    this.fn = _fn;
    this.method = method;
    this.body = body;
    this.headers = headers;
  }

  request() {
    const _fetch =
      this.method === "GET"
        ? fetch(this.url)
        : fetch(this.url, {
            method: this.method,
            body: JSON.stringify(this.body),
            headers: this.headers
          });
    _fetch
      .then(res => res.json())
      .then(data => {
        console.log(JSON.stringify(data));
        this.fn(data);
      })
      .catch(err => {
        console.log(err);
        return "Oops! Something went wrong. Please try again later";
      });
  }
}

class _format {
  static htmlSpecialCharacter(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  static validateInput(_class) {
    const boxes = document.getElementsByClassName(_class);
    let isValid = true;
    for (var i = 0; i < boxes.length; i++) {
      if (boxes[i].value == "") {
        boxes[i].className += " invalid";
        isValid = false;
      } else if (boxes[i].name == "email" && !_format.validEmail(boxes[i].value)) {
        boxes[i].className += " invalid";
        isValid = false;
      }
    }
    return isValid;
  }

  static validEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
}