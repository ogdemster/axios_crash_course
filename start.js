//axios globals
axios.defaults.headers.common["X-Auth-Token"] = "sometoken";

// GET REQUEST
function getTodos() {
  ////long way
  // console.log("GET Request");
  // axios({
  //   method: "get",
  //   url: "https://jsonplaceholder.typicode.com/todos",
  //   params: {
  //     _limit: 5,
  //   },
  // })
  //   .then((res) => showOutput(res))
  //   .catch((err) => console.log(err));
  ////short way
  axios
    .get("https://jsonplaceholder.typicode.com/todos", {
      params: { _limit: 5 },
      // timeout: 5,
    })
    .then((res) => showOutput(res))
    .catch((err) => console.log(err));
}

// POST REQUEST
function addTodo() {
  // console.log("POST Request");
  ////long way
  // axios({
  //   method: "post",
  //   url: "https://jsonplaceholder.typicode.com/todos",
  //   data: {
  //     title: "new todo",
  //     complated: "false",
  //   },
  // })
  //   .then((res) => showOutput(res))
  //   .catch((err) => console.log(err));
  ////short way
  axios
    .post("https://jsonplaceholder.typicode.com/todos", {
      params: { title: "new todo", complated: false },
    })
    .then((res) => showOutput(res))
    .catch((err) => console.log(err));
}

// PUT/PATCH REQUEST
function updateTodo() {
  // console.log("PUT/PATCH Request");
  //put request will upldate every field, if it does not exist. would delete
  //patch will update fields that entered
  axios
    .patch("https://jsonplaceholder.typicode.com/todos/1", {
      params: { title: "updated todo", complated: true },
    })
    .then((res) => showOutput(res))
    .catch((err) => console.log(err));
}

// DELETE REQUEST
function removeTodo() {
  // console.log("DELETE Request");
  axios
    .delete("https://jsonplaceholder.typicode.com/todos/1")
    .then((res) => showOutput(res))
    .catch((err) => console.log(err));
}

// SIMULTANEOUS DATA (like multiple work)
function getData() {
  // console.log("Simultaneous Request");
  axios
    .all([
      axios.get('"https://jsonplaceholder.typicode.com/todos/'),
      axios.post('"https://jsonplaceholder.typicode.com/todos/'),
    ])
    .then(axios.spread((todos, posts) => showOutput(posts)))
    .catch((res) => console.log(res));
}

// CUSTOM HEADERS
function customHeaders() {
  // console.log("Custom Headers");
  //like access tokens etc

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "sometoken",
    },
  };

  axios
    .post(
      "https://jsonplaceholder.typicode.com/todos",
      {
        params: { title: "new todo", complated: false },
      },
      config
    )
    .then((res) => showOutput(res))
    .catch((err) => console.log(err));
}

// TRANSFORMING REQUESTS & RESPONSES
function transformResponse() {
  // console.log("Transform Response");
  const options = {
    method: "post",
    url: "https://jsonplaceholder.typicode.com/todos",
    data: {
      title: "hello world",
    },
    transformResponse: axios.defaults.transformResponse.concat((data) => {
      data.title = data.title.toUpperCase();
      return data;
    }),
  };

  axios(options).then((res) => showOutput(res));
}

// ERROR HANDLING
function errorHandling() {
  // console.log("Error Handling");
  axios
    .get("https://jsonplaceholder.typicode.com/todos", {
      params: { _limit: 5 },
      // validateStatus: function (status) {
      //   return status <= 500; //reject only if status is greater or equal to
      // },
    })
    .then((res) => showOutput(res))
    .catch((err) => {
      if (err.response) {
        //server responded with a status other than 200
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else if (err.request) {
        //request made but no response
        console.error(err.request);
      } else {
        console.log(err);
      }
    });
}

// CANCEL TOKEN
function cancelToken() {
  // console.log("Cancel Token");
  const source = axios.CancelToken.source();

  axios
    .get("https://jsonplaceholder.typicode.com/todos", {
      cancelToken: source.token,
    })
    .then((res) => showOutput(res))
    .catch((thrown) => {
      if (axios.isCancel(thrown)) {
        console.log("Request Canceled", thrown.message);
      }
    });

  //getting result will be canceled. nothing will return
  if (true) {
    source.cancel("Request canceled");
  }
}

// INTERCEPTING REQUESTS & RESPONSES

axios.interceptors.request.use(
  (config) => {
    console.log(
      `${config.method.toUpperCase()} request sent to ${
        config.url
      } at ${new Date().getTime()}`
    );
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// AXIOS INSTANCES
const axiosInstance = axios.create({
  //other custom settings
  baseURL: "https://jsonplaceholder.typicode.com",
});

// axiosInstance.get("/comments").then((res) => showOutput(res));

// Show output in browser
function showOutput(res) {
  document.getElementById("res").innerHTML = `
    <div class="card card-body mb-4">
      <h5>Status: ${res.status}</h5>
    </div>
  
    <div class="card mt-3">
      <div class="card-header">
        Headers
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.headers, null, 2)}</pre>
      </div>
    </div>
  
    <div class="card mt-3">
      <div class="card-header">
        Data
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.data, null, 2)}</pre>
      </div>
    </div>
  
    <div class="card mt-3">
      <div class="card-header">
        Config
      </div>
      <div class="card-body">
        <pre>${JSON.stringify(res.config, null, 2)}</pre>
      </div>
    </div>
  `;
}

// Event listeners
document.getElementById("get").addEventListener("click", getTodos);
document.getElementById("post").addEventListener("click", addTodo);
document.getElementById("update").addEventListener("click", updateTodo);
document.getElementById("delete").addEventListener("click", removeTodo);
document.getElementById("sim").addEventListener("click", getData);
document.getElementById("headers").addEventListener("click", customHeaders);
document
  .getElementById("transform")
  .addEventListener("click", transformResponse);
document.getElementById("error").addEventListener("click", errorHandling);
document.getElementById("cancel").addEventListener("click", cancelToken);
