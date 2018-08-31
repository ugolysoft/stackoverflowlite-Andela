(function() {
  if (document.getElementById("questionstb")) {
    setTimeout(function() {
      const qns = new getData("/api/v1/questions/", _use.questions);
      qns.request();
    }, 500);
  }

  setTimeout(() => {
    const user = _use.getCookie("statckusers");
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
      const questionid = _use.getUrlVars();

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
  static getUrlVars() {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
      vars[key] = value;
    });
    return parseInt(vars["questionid"]);
  }
  static viewquestion(m) {
    let q = `<h3>${m.question.title}</h3><div class="">${m.question.question}
          <p class="unpad align-right"><b>${m.question.askeddby}</b> <span class="inline-table">
          ${m.question.createddate}</span></p></div><br><span class="caption">2 Answers</span>
          <table class="table-bottom-line table-topalign">`;
    for (let ans of m.answers) {
      let _vote =
        !isNaN(ans.votes) &&
        parseInt(Number(ans.votes)) == ans.votes &&
        !isNaN(parseInt(ans.votes, 10))
          ? ans.votes
          : 0;
      q += `<tr><td><div class="align-center"><span onclick="vote(1,this)" class="upvote block">
                    </span><p class="vote-score">${parseInt(
                      _vote
                    )}</p><span onclick="vote(-1,this)" class="downvote block">
                    </span></div></td><td>${
                      ans.answer
                    }<p class="unpad align-right"><b>Roy Nnanna</b>
                     <span class="inline-table">${
                       ans.createddate
                     }</span></p><br><span class="caption">Comments</span>
                      <div class="comments-container"><div><span class="link-btn" onclick="_use.addcomment(this,${
                        ans.id
                      })">
                      Add comment</span></div></div></td></tr>`;
    }
    q += `</table><br /> <b>Body</b><textarea name="answer" id="answer" placeholder="Type in your answer"  class="input-box" rows="15">
    </textarea><br /><br /><input type="button" id="signupbtn" class="btn" onclick="_use.postAnswer('${
      m.question.id
    }',this)" value="Post Your Answer"/><br><br>`;

    document.getElementById("questionviewer").innerHTML = q;
  }

  static addcomment(element, id) {
    let i = `<textarea class='input-box'  placeholder='Type in your comment'></textarea><br>`;
    i += `<input type='button' value='Post Your Comment' onclick='_use.postcomment(this,${id})' class='btn'>`;
    element.parentElement.innerHTML = i;
  }

  static postcomment($this, id) {
    var parent = element.parentElement;
    var msg = parent.childNodes[0].value;
    alert(msg);
    if (msg != "") {
      $this.className += " hidden";
      const data = {
        body: _format.htmlSpecialCharacter(msg)
      };
      const headers = {
        "Content-Type": "application/json",
        token: _use.getCookie("statckusers")
      };
      const req = new getData(
        "/api/v1/questions/answers/comments/" + parseInt(id),
        _use.reloadPage,
        "POST",
        data,
        headers
      );
      req.request();
    }
  }
  static postAnswer(questionid, $this) {
    const msg = document.getElementById("answer").value;
    if (msg != "") {
      $this.className += " hidden";
      const data = {
        body: _format.htmlSpecialCharacter(msg)
      };
      const headers = {
        "Content-Type": "application/json",
        token: _use.getCookie("statckusers")
      };
      const req = new getData(
        "/api/v1/questions/" + questionid + "/answers",
        _use.reloadPage,
        "POST",
        data,
        headers
      );
      req.request();
    }
  }
  static reloadPage() {
    window.location.reload();
  }
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
        token: _use.getCookie("statckusers")
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
      <td><a class="undecorated" href="reader.html?questionid=${value.qnsid}" ><b>
      ${value.title}</b></a><p class="unpad align-right">
      <b>${value.name}</b> <span class="inline-table">${value.askedate}</span></p></td></tr>`;
    });
    qnstb.innerHTML = rows;
  }

  static setCookie(cvalue) {
    alert(cvalue);
    const d = new Date();
    d.setTime(d.getTime() + 2 * 60 * 60 * 1000);
    var expires = "expires=" + d.toUTCString();
    document.cookie = "statckusers=" + cvalue + ";" + expires + ";path=/";
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
