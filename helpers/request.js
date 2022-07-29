import axios from "axios";

const req = (() => {
  return axios.create({
    baseURL: "https://randomuser.me/api"
  })
});

const request = async function(options, store){
  console.log(options, "opsi")
  return req(options).then((res) => res.data).catch((err) => err);
}

export default request;
// export default axios.create({
//   baseURL: "https://randomuser.me/api"
// });