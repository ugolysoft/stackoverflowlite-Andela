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
      _use.removeClass("for-authorizeduser", nav);
      if (document.getElementById("welcomenote")) {
        document.getElementById("welcomenote").style.width = "100%";
        document.getElementById("entry").style.display = "none";
      }
      document.getElementById("user-dropdown").innerHTML = JSON.parse(user).name.split(" ")[0];
    } else {
      _use.removeClass("for-anonymous", nav);
    }
    if (document.getElementById("questionviewer")) {
      const questionid = _use.getUrlVars();

      if (questionid != "") {
        const qns = new getData(`/api/v1/questions/${questionid}`, _use.viewquestion);
        qns.request();
      }
    }
  }, 500);

  if (document.getElementsByClassName("delete")) {
    var elem = document.getElementsByClassName("delete");
    for (var i = 0; i < elem.length; i++) {
      elem[i].addEventListener("click", function() {
        var row = this.parentNode.parentNode;
        var q = row.getElementsByTagName("a")[0].childNodes[0].innerHTML;
        var con = confirm('Are you sure you want to delete this quwstion: "' + q + '"?');
        if (con) {
          
        }
      });
    }
  }
})();

class _use {

  static deletQuestion(id,$this){
    const q = $this.parentNode.parentNode.getElementsByTagName("a")[0].childNodes[0].innerHTML;
        if (confirm('Are you sure you want to delete this quwstion: "' + q + '"?')) {
          const data = {
            id: id
          };
          const req = new getData(
            "/api/v1/questions/" + parseInt(id),
            _use.reloadPage,
            "DELETE",
            data
          );
          req.request();
        }
  }
  static removeClass(_className, nav) {
    for (var val of nav) {
      if (val.classList.contains(_className)) {
        val.classList.remove("hidden");
      }
    }
  }

  static decoder(user) {
    document.getElementById("user-dropdown").innerHTML = user.name.split(" ")[0];
  }

  static getUrlVars() {
    var vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
      vars[key] = value;
    });
    return parseInt(vars["questionid"]);
  }
  static viewquestion(m) {
    const userid = JSON.parse(_use.getCookie("statckusers")).id;
    let q = `<h3>${m.title}</h3><div class="">${m.question}
          <p class="unpad align-right"><b>${m.askeddby}</b> <span class="inline-table">
          ${m.createddate}</span></p></div><br><span class="caption">${
      m.answers.length
    } Answers</span>
          <table class="table-bottom-line table-topalign">`;
    for (let ans of m.answers) {
      q += `<tr><td><div class="align-center"><span onclick="_use.vote(1,'${
        ans.id
      }');" class="upvote block">
            </span><p class="vote-score">${ans.votes || 0}</p>
            <span onclick="_use.vote(-1,'${ans.id}')" class="downvote block">
            </span></div></td><td><div><div class='inline-block'>${ans.answer}</div>`;
      if (userid == ans.userid) q += _use.edit(ans.id);
      q += `</div><p class="unpad align-right"><b>${ans.answeredby}</b>
            <span class="inline-table">${
              ans.createddate
            }</span></p><br><span class="caption">Comments</span>
            <div class="comments-container"><div id="${
              ans.id
            }comments"></div><div class="comments-container">
            <div><span class="link-btn" onclick="_use.addcomment(this,${ans.id})">
            Add comment</span></div></div></div></td></tr>`;
    }
    q += `</table><br /> <b>Body</b><textarea name="answer" id="answer" placeholder="Type in your answer"  class="input-box" rows="15">
    </textarea><br /><br /><input type="button" id="signupbtn" class="btn" onclick="_use.postAnswer('${
      m.id
    }',this)" value="Post Your Answer"/><br><br>`;

    document.getElementById("questionviewer").innerHTML = q;
    if (m.answers.length > 0) {
      const qns = new getData(`/api/v1/questions/${m.id}/answers/comments`, _use.userComments);
      qns.request();
    }
  }

  static edit(id) {
    return `<span class='edit' onclick='_use.toedit(this,${id})'>
    <span class='edit-pen'></span><span class='edit-mid'></span><span class='edit-end'></span></span>`;
  }

  static toedit($this, id) {
    $this.parentNode.innerHTML = `<textarea class='input-box'>
    ${$this.parentNode.childNodes[0].innerHTML}</textarea><p>
    <input type='button' value='Update' class='btn' onclick='_use.updateAnswer(${id},this)' ></p>`;
  }
  static userProfile(data) {
    const user = JSON.parse(_use.getCookie("statckusers"));
    if (user != "") {
      document.getElementById("nameofuser").innerHTML = user.name;
      document.getElementById("useremail").innerHTML = user.email;
      const answer = data.filter(x => x.title =="");
      const questions = data.filter(x => x.title !="");
      document.getElementById('noofaskedquestions').innerHTML=questions[0].totalquestions;
      document.getElementById('noofansweredquestions').innerHTML= answer[0].totalquestions;
      let q = ``;
      for(var question of questions){
        q += ` <tr><td><a href="viewquestion.html" class="undecorated"><b>${question.title}</b></a>
        <p class="unpad align-right">${question.askedate}</p></td><td class="align-center">
        <span onclick='_use.deletQuestion(${question.qnsid},this)' class="delete"></span></td></tr>`;
      }
      document.getElementById('userquestionstb').innerHTML = q;
    }
  }
  static updateAnswer(id, $this) {
    const data = {
      body: $this.parentNode.parentNode.childNodes[0].value
    };
    const req = new getData(
      "/api/v1/questions/answers/" + parseInt(id),
      _use.reloadPage,
      "PUT",
      data
    );
    req.request();
  }

  static vote(num, id) {
    const data = {
      vote: num
    };
    const req = new getData(
      "/api/v1/questions/answers/votes/" + parseInt(id),
      _use.reloadPage,
      "POST",
      data
    );
    req.request();
  }
  static userComments(comments) {
    let c = "",
      answerid = "";
    for (var com of comments) {
      if (c !== "" && answerid !== com.anscomment) {
        document.getElementById(answerid + "comments").innerHTML = c;
        c = "";
      }
      c += `<div class="comment">${com.message}<p class="unpad align-right">
      <b>${com.name}</b> <span class="inline-table">${com.commentdate}</span></p>
      </div>`;
      answerid = com.anscomment;
    }
    document.getElementById(answerid + "comments").innerHTML = c;
  }
  static addcomment(element, id) {
    let i = `<textarea class='input-box'  placeholder='Type in your comment'></textarea><br>`;
    i += `<input type='button' value='Post Your Comment' onclick='_use.postcomment(this,${id})' class='btn'>`;
    element.parentElement.innerHTML = i;
  }

  static postcomment($this, id) {
    var parent = $this.parentElement;
    var msg = parent.childNodes[0].value;
    if (msg != "") {
      $this.className += " hidden";
      const data = {
        body: _format.htmlSpecialCharacter(msg)
      };
      const req = new getData(
        "/api/v1/questions/answers/comments/" + parseInt(id),
        _use.reloadPage,
        "POST",
        data
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
      const req = new getData(
        "/api/v1/questions/" + questionid + "/answers",
        _use.reloadPage,
        "POST",
        data
      );
      req.request();
    }
  }

  static reloadPage(data) {
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
      const req = new getData("/api/v1/questions/", _use.reloadPage, "POST", data);
      req.request();
    }
  }

  static onlogin(data) {
    _use.setCookie(JSON.stringify(data));
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
  static logout() {
    _use.setCookie("", "Thu, 01 Jan 1970 00:00:00 GMT");
    window.location.href = "index.html";
  }
  static setCookie(cvalue, destroy = undefined) {
    const d = new Date();
    d.setTime(d.getTime() + 2 * 60 * 60 * 1000);
    const expires = "expires=" + (destroy || d.toUTCString());
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
  constructor(url, _fn, method = "GET", body = "") {
    this.url = url;
    this.fn = _fn;
    this.method = method;
    this.body = body;
  }

  request() {
    const user = _use.getCookie("statckusers");
    const _fetch =
      this.method == "GET"
        ? fetch(this.url,{
          method: "GET",
          headers: {
            token: user == "" ? user : JSON.parse(user).token
          }
        })
        : fetch(this.url, {
            method: this.method,
            body: JSON.stringify(this.body),
            headers: {
              "Content-Type": "application/json",
              token: user == "" ? user : JSON.parse(user).token
            }
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
        if (data.message.toLowerCase().indexOf("access denied") > -1) _use.logout();
      } else next(data.data);
    }
  }
}
