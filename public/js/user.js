(function() {
  if (document.getElementById("questionstb")) {
    setTimeout(function() {
      const qns = new getData("/api/v1/questions/", _use.questions);
      qns.request();
    }, 500);
  }

  setTimeout(() => {
    const user = _use.getCookie("statckuser");
    const nav = document.getElementsByClassName("user-nav");
    if (user != "") {
      for (var val of nav) {
        if (val.classList.contains("for-authorizeduser"))
          val.className = "for-authorizeduser user-nav";
      }
    } else {
      for (var val of nav) {
        if (val.classList.contains("for-anonymous")) val.className = "for-anonymous user-nav";
      }
    }
    if (document.getElementById("questionviewer")) {
      const questionid = _use.getCookie("questionid");
      if (questionid != "") {
        const qns = new getData(`/api/v1/questions/${questionid}`, _use.viewquestion);
        qns.request();
      }
    }
  }, 200);

  if (document.getElementsByClassName("delete")) {
    var elem = document.getElementsByClassName("delete");
    for (var i = 0; i < elem.length; i++) {
      elem[i].addEventListener("click", function() {
        var row = this.parentNode.parentNode;
        var q = row.getElementsByTagName("a")[0].childNodes[0].innerHTML;
        var con = confirm('Are you sure you want to delete this quwstion: "' + q + '"?');
        if (con) {
          var parent = this.parentNode.parentNode.parentNode;
          var rowindex = row.rowIndex;
          parent.deleteRow(rowindex);
        }
      });
    }
  }
})();

class _use {
  static viewquestion(m) {}

  static signup() {
    if (_format.validateInput("box")) {
      const data = {
        name: _format.htmlSpecialCharacter(document.getElementById("name").value),
        email: _format.htmlSpecialCharacter(document.getElementById("email").value),
        password: document.getElementById("password").value
      };
      const req = new getData("/api/v1/auth/signup/", null, "POST", data);
      req.request();
    }
  }

  static login() {
    if (_format.validateInput("box")) {
      const data = {
        email: _format.htmlSpecialCharacter(document.getElementById("email").value),
        password: document.getElementById("password").value
      };
      const req = new getData("/api/v1/auth/login/", _use.onlogin, "POST", data);
      req.request();
    }
  }

  static saveQuestion($this) {
    if (_format.validateInput("input-box")) {
      $this.className += " hidden";
      const data = {
        title: _format.htmlSpecialCharacter(document.getElementById("title").value),
        body: _format.htmlSpecialCharacter(document.getElementById("question").value)
      };
      const headers = {
        "Content-Type": "application/json",
        token: _use.getCookie("statckuser")
      };
      const req = new getData("/api/v1/questions/", null, "POST", data, headers);
      req.request();
    }
  }

  static onlogin(data) {
    _use.setCookie(data.token);
  }

  static questions(data) {
    const qnstb = document.getElementById("questionstb");
    let rows = "";
    data.forEach(value => {
      rows += `<tr><td><span class="inline-block unpad align-center">
      ${value.ans} ans</span></td>
      <td><a class="undecorated" onclick="_use.viewQuestion('${value.qnsid}')" ><b>
      ${value.title}</b></a><p class="unpad align-right">
      <b>${value.name}</b> <span class="inline-table">${value.askedate}</span></p></td></tr>`;
    });
    qnstb.innerHTML = rows;
  }

  static viewQuestion(id) {
    _use.setCookie(id, "questionid");
    window.location.href = "reader.html";
  }

  static setCookie(cvalue, name = "statckuser") {
    alert(cvalue);
    const d = new Date();
    d.setTime(d.getTime() + 2 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + cvalue + ";" + expires + ";path=/";
    window.location.href = "index.html";
  }

  static getCookie(cname) {
    const name = cname + "=";
    const ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  static search() {
    if (_format.validateInput("input-box")) {
      const data = {
        search: _format.htmlSpecialCharacter(document.getElementById("searchtext").value)
      };
      const req = new getData("/api/v1/questions/search/", _use.questions, "POST", data);
      req.request();
    }
  }
}

class getData {
  constructor(
    url,
    _fn,
    method = "GET",
    body = "",
    headers = {
      "Content-Type": "application/json"
    }
  ) {
    this.url = url;
    this.fn = _fn;
    this.method = method;
    this.body = body;
    this.headers = headers;
  }

  request() {
    const _fetch =
      this.method == "GET"
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
        _format.verifydata(data, this.fn);
      })
      .catch(err => {
        console.log(err);
        alert("Oops! Something went wrong. Please try again later");
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

  static verifydata(data, next) {
    if (typeof data == "string") alert(data);
    else if (typeof data == "object") {
      if (Array.isArray(data)) next(data);
      else if (data.data == "") {
        alert(`Success\n${data.success}\n\nMessage\n${data.message}`);
      } else next(data.data);
    }
  }
}
